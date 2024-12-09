import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
    BedrockRuntimeClient,
    ConversationRole,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { createClient } from '@/lib/supabase/server';
import { searchSemanticScholar } from './searchSemanticScholar';

const prisma = new PrismaClient();
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS!,
        secretAccessKey: process.env.AWS_SECRET!,
    },
});

interface Insight {
    type: "outread" | "semantic_scholar";
    paper_id: string;
    insight: string;
    keyword: string;
    insight_explanation: string;
    doi: string;
    title?: string;
    authors?: string[];
    year?: number;
    citationCount?: number;
    url?: string;
    verification?: string;
}

interface Payload {
    query: string;
    complexity?: string;
    userId: string;
}

function sanitizeJson(response: string): string | null {
    try {
        const start = response.indexOf('{');
        const end = response.lastIndexOf('}') + 1;
        const jsonString = response.slice(start, end);
        return jsonString;
    } catch (error) {
        console.log(response);
        return null;
    }
}

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized session')


    const prismaUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if (!prismaUser) {
        throw new Error('Unauthorized prisma')
    }

    const userId = prismaUser.id

    try {
        const body: Payload = await request.json();
        const { query, complexity = 'simple' } = body;

        if (!query) {
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }
        const fullArticles: any[] = [];  // No Outread articles considered.
        const dois = fullArticles.map(article => article.doi);
        const semanticScholarPapers = await searchSemanticScholar(query, dois, bedrockClient);

        // Assign stable paper_ids
        const relevantPapers = semanticScholarPapers.map((paper, index) => {
            return {
                paper_id: `${index}`,
                title: paper.title,
                authors: paper.authors,
                doi: paper.doi,
                relevance_score: paper.relevance_score,
                one_card_summary: paper.abstract,
                type: 'semantic_scholar',
                citationCount: paper.citationCount,
                year: paper.year,
                abstract: paper.abstract
            };
        });

        // Build a JSON representation of the papers
        const papersJson = JSON.stringify(relevantPapers.map(p => ({
            paper_id: p.paper_id,
            title: p.title,
            authors: p.authors,
            doi: p.doi,
            citationCount: p.citationCount,
            year: p.year,
            abstract: p.abstract,
            relevance_score: p.relevance_score
        })), null, 2);

        let contentToSummarize = `Query: ${query}\n\n`;
        contentToSummarize += `Below is a JSON array of papers with their metadata. Use the provided paper_id as a key and do not alter it or any metadata fields.\n\n`;
        contentToSummarize += `${papersJson}\n\n`;

        const totalPapers = relevantPapers.length;
        const outreadPapersCount = relevantPapers.filter(paper => paper.type === 'outread').length;

        const prompt = `
Analyze the following ${totalPapers} research papers (${outreadPapersCount} from Outread and ${totalPapers - outreadPapersCount} from Semantic Scholar) in relation to the given query: ${query}.

Each paper is given as a JSON object with a unique paper_id and associated metadata. You must:
- Not alter the paper_id or any provided metadata like DOI, authors, and citationCount.
- Generate exactly one insight per paper, referencing the correct paper_id .

After analyzing the papers, provide a summarised_response weaving all insights together. Include <reference> tags for each insight in the summarised_response. 

Example content <reference>id</reference>

Return the result in the following structure:
{
    "insight": [
        {
            "type": "semantic_scholar",
            "paper_id": "string",
            "insight": "string",
            "keyword": "descriptive keyword",
            "insight_explanation": "string",
            "doi": "string"
        }
    ],
    "summarised_response": "string"
}

Do not alter any DOIs, authors, or citationCounts. Maintain the exact paper_id for each insight. Do not include any non-JSON text. Do not add commentary before or after the JSON.

${contentToSummarize}
`;

        let modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"

        const conversation = [
            {
                role: "user" as ConversationRole,
                content: [{ text: prompt }]
            },
            {
                role: "assistant" as ConversationRole,
                content: [{ text: "Here is the output in json format :" }]
            }
        ];

        const command = new ConverseCommand({
            modelId,
            messages: conversation,
            inferenceConfig: {
                maxTokens: 4096,
                temperature: 0.5,
                topP: 0.9
            }
        });

        let response = null;
        try {
            response = await bedrockClient.send(command);
        }
        catch (error) {
            console.log("Error with Claude:", error);
            return NextResponse.json({ error: 'Claude error' }, { status: 500 });
        }

        let responseText: string | undefined;
        if (response.output?.message?.content?.[0]?.text) {
            responseText = response.output.message.content[0].text;
        } else {
            console.error('Unexpected response structure:', response);
            return NextResponse.json({ error: 'Invalid response from Bedrock' }, { status: 500 });
        }

        console.log(response)
        const json = sanitizeJson(responseText);
        console.log(json)
        if (!json) {
            return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 });
        }
        let parsedJson;
        try {
            parsedJson = JSON.parse(json);

        }catch {
            console.log("Faile")
        }

        const result = {
            summary: parsedJson,
            relevant_papers: relevantPapers,
        };

        console.log({ totalPapers })
        console.log({ parsedJson })
        console.log({ relevantPapers })

        // Verify insights against abstracts
        if (parsedJson?.insight && Array.isArray(parsedJson.insight)) {
            for (let i = 0; i < parsedJson.insight.length; i++) {
                const insightObj = parsedJson.insight[i] as Insight;
                // find the paper by paper_id now
                const paper = relevantPapers.find(p => p.paper_id === insightObj.paper_id);
                const abstractText = paper ? paper.abstract : 'No abstract found';

                const verificationPrompt = 
                `You are a strict fact checker. Given an insight extracted from a research paper and the paper's abstract, 
                determine if the insight is factually supported by the abstract. If it is supported, say "VALID". 
                If not, say "INVALID". Do not provide additional explanations.
                Abstract:
                "${abstractText}"

                Insight:
                "${insightObj.insight}"`;

                const verifyConversation = [
                    {
                        role: "user" as ConversationRole,
                        content: [{ text: verificationPrompt }]
                    }
                ];

                const verifyCommand = new ConverseCommand({
                    modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
                    messages: verifyConversation,
                    inferenceConfig: {
                        maxTokens: 500,
                        temperature: 0,
                        topP: 0.9
                    }
                });

                let verifyResponse: any = null;
                try {
                    verifyResponse = await bedrockClient.send(verifyCommand);
                } catch (verifError) {
                    console.log("Error verifying insight:", verifError);
                    insightObj.verification = "UNKNOWN";
                    continue;
                }

                let verificationResult: string = "UNKNOWN";
                if (verifyResponse?.output?.message?.content?.[0]?.text) {
                    const verifyText = verifyResponse.output.message.content[0].text.trim();
                    if (verifyText.toUpperCase().includes("VALID")) {
                        verificationResult = "VALID";
                    } else if (verifyText.toUpperCase().includes("INVALID")) {
                        verificationResult = "INVALID";
                    } else {
                        verificationResult = "UNKNOWN";
                    }
                }

                insightObj.verification = verificationResult;

                // Update insight metadata from the paper
                if (paper) {
                    insightObj.doi = paper.doi;
                    insightObj.title = paper.title;
                    insightObj.authors = paper.authors ? paper.authors.split(', ') : [];
                    insightObj.citationCount = paper.citationCount;
                    insightObj.year = paper.year;
                }

                console.log(`Insight verification for ${insightObj.paper_id}: ${insightObj.verification}`);
            }
        }

        if (parsedJson.insight && Array.isArray(parsedJson.insight)) {
            parsedJson.insight.forEach((insightObj: Insight, index: number) => {
                console.log(`Insight #${index + 1}:`);
                console.log(`Type: ${insightObj.type}`);
                console.log(`DOI: ${insightObj.doi}`);
                console.log(`Paper ID: ${insightObj.paper_id}`);
                console.log(`Insight: ${insightObj.insight}`);
                console.log(`Keyword: ${insightObj.keyword}`);
                console.log(`Explanation: ${insightObj.insight_explanation}`);
                if (insightObj.verification) {
                    console.log(`Verification: ${insightObj.verification}`);
                }
                console.log('-------------------------');
            });
        }

        try {
            await prisma.trendAnalysisResponse.create({
                data: {
                    userId: userId,
                    query,
                    complexity,
                    response: result,
                }
            });
        } catch (dbError) {
            console.error('Error saving query to database:', dbError);
        }

        return NextResponse.json({ result }, { status: 200 })
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
