import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pinecone } from '@pinecone-database/pinecone';
import {
    BedrockRuntimeClient,
    ConversationRole,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const prisma = new PrismaClient();

async function vectorise(query: string) {
    const url = "https://api.openai.com/v1/embeddings";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    };
    const data = {
        "input": query,
        "model": "text-embedding-ada-002"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
}

function sanitizeJson(response: string): string {
    try {
        const start = response.indexOf('{');
        const end = response.lastIndexOf('}') + 1;
        const jsonString = response.slice(start, end);
        return jsonString;
    } catch (error) {
        console.log(response);
        throw new Error('Failed to sanitize JSON response');
    }
}

export async function POST(request: NextRequest) {
    try {
        const { phrase, xValue, nValue } = await request.json();

        if (!phrase) {
            return NextResponse.json({ error: 'No phrase provided' }, { status: 400 });
        }

        // Initialize Bedrock client
        const bedrockClient = new BedrockRuntimeClient({
            region: process.env.AWS_REGION || 'us-west-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS!,
                secretAccessKey: process.env.AWS_SECRET!,
            },
        });

        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });

        const pineconeIndex = pc.Index("research-articles");

        const vectorisedQuery = await vectorise(phrase);

        const topKMatches = await pineconeIndex.query({
            topK: xValue,
            vector: vectorisedQuery,
            includeMetadata: true
        });

        const articleIds = topKMatches.matches.map(match => match.id);

        const articles = await prisma.article.findMany({
            where: {
                id: {
                    in: articleIds
                }
            },
        });

        let contentToAnalyze = `Analyze the following ${xValue} research papers in relation to the given phrase: ${phrase}.\n\n`;

        for (const article of articles) {
            const matchScore = topKMatches.matches.find(match => match.id === article.id)?.score;

            contentToAnalyze += `paper_id: ${article.id || 'No id'}\n`;
            contentToAnalyze += `Title: ${article.title || 'No title'}\n`;
            contentToAnalyze += `Author: ${article.authorName || 'No author'}\n`;
            contentToAnalyze += `Relevance: ${matchScore}\n`;
            contentToAnalyze += `Summary: ${article.simpleSummary}\n\n`;
        }

        const prompt = `${contentToAnalyze}

        For each of the papers:
        1. Extract the top 10 most prevalent keywords.
        2. Assign a float value (0-1) to each keyword representing its significance.

        Then, create ${nValue} clusters based on the most significant keywords across all papers.

        Return the result as a JSON object with the following structure:
        {
            "clusters": [
                {
                    "mainKeyword": "string",
                    "relatedKeywords": ["string"]
                }
            ]
        }

        Ensure that:
        - Each cluster has one main keyword (the most significant one)
        - Related keywords are the next most significant keywords (up to 9)
        - The clusters are ordered by the significance of their main keywords
        - There are exactly ${nValue} clusters (or fewer if there aren't enough significant keywords)

        Make sure that the generated JSON is complete and valid. Do not include any explanations or notes outside of the JSON structure.`;

        const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

        const conversation = [
            {
                role: "user" as ConversationRole,
                content: [{ text: prompt }]
            },
        ];

        const command = new ConverseCommand({ modelId, messages: conversation, inferenceConfig: { maxTokens: 4096, temperature: 0.5, topP: 0.9 } });

        const response = await bedrockClient.send(command);

        let responseText: string | undefined;
        if (response.output && response.output.message && response.output.message.content && response.output.message.content.length > 0) {
            responseText = response.output.message.content[0].text;
        } else {
            console.error('Unexpected response structure:', response);
            return NextResponse.json({ error: 'Unexpected response from Bedrock' }, { status: 500 });
        }

        if (!responseText) {
            return NextResponse.json({ error: 'Empty response from Bedrock' }, { status: 500 });
        }

        const json = sanitizeJson(responseText);
        const parsedJson = JSON.parse(json);
        return NextResponse.json(parsedJson, { status: 200 });

    } catch (error) {
        console.error('Error in cluster analysis:', error);
        return NextResponse.json({ error: 'An error occurred during cluster analysis' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
