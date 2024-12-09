
import {
    BedrockRuntimeClient,
    ConversationRole,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

import { vectorise, calculateCosineSimilarity } from "./pinecone";

async function generateSearchQueries(question: string, bedrockClient: BedrockRuntimeClient): Promise<string[]> {
    const prompt = `Convert this research question into 3-4 different search queries that would help find relevant academic papers on Semantic Scholar. Focus on key concepts and use different combinations of synonyms. Make queries concise (2-4 words each) and targeted.

Original question: "${question}"

Return only the search queries, one per line, with no numbering, prefixes, or explanations.
Each query should focus on different aspects or synonyms of the key concepts.
Keep queries concise for best search results.`;

    const conversation = [
        {
            role: "user" as ConversationRole,
            content: [{ text: prompt }]
        },
        {
            role: "assistant" as ConversationRole,
            content: [{ text: "Here are the search queries:" }]
        }
    ];

    const command = new ConverseCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        messages: conversation,
        inferenceConfig: {
            maxTokens: 150,
            temperature: 0.7,
            topP: 0.9
        }
    });

    try {
        const response = await bedrockClient.send(command);

        if (!response.output?.message?.content?.[0]?.text) {
            console.error('Unexpected response structure from Claude');
            return [question];
        }

        const queries = response.output.message.content[0].text
            .split('\n')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.toLowerCase().includes('here are') && !q.toLowerCase().includes('search queries'));

        const result = Array.from(new Set([...queries, question]));
        return result
    } catch (error) {
        console.error('Error generating queries with Claude:', error);
        return [question];
    }
}

export async function searchSemanticScholar(question: string, dois: string[], bedrockClient: BedrockRuntimeClient) {
    const headers = {
        "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY as string,
    };

    const searchQueries = await generateSearchQueries(question, bedrockClient);
    console.log("Generated queries:", searchQueries);

    const papersMap = new Map();
    const questionEmbedding = await vectorise(question);

    const limit = 40; 

    for (const query of searchQueries) {
        const searchQuery = encodeURIComponent(query);
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${searchQuery}&sort=citationCount:desc&fields=title,abstract,citationCount,authors,externalIds,year&limit=${limit}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });
            const json = await response.json();

            await Promise.all(
                json.data.map(async (paper: any) => {
                    try {
                        const abstract = paper.abstract;
                        const title = paper.title;
                        if (!abstract || !title) return null;

                        const doi = paper.externalIds?.DOI;
                        if (!doi || dois.includes(doi)) return null;

                        const paperContent = `${title} ${abstract}`;
                        const paperEmbedding = await vectorise(paperContent);

                        const relevance_score = calculateCosineSimilarity(questionEmbedding, paperEmbedding);

                        const paperData = {
                            abstract: abstract,
                            title: title,
                            citationCount: paper.citationCount || 0,
                            doi: doi,
                            authors: paper.authors?.map((author: any) => author.name).join(', ') || 'Unknown',
                            year: paper.year,
                            relevance_score: relevance_score,
                        };

                        if (!papersMap.has(doi)) {
                            papersMap.set(doi, paperData);
                        } else {
                            const existing = papersMap.get(doi);
                            if (relevance_score > existing.relevance_score) {
                                papersMap.set(doi, paperData);
                            }
                        }

                    } catch (error) {
                        console.log(`Error processing paper: ${error}`);
                    }
                })
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.log(`Error with query "${query}":`, error);
        }
    }

    const goodPapers = Array.from(papersMap.values())
        .sort((a, b) => {
            const scoreDiff = b.relevance_score - a.relevance_score;
            if (Math.abs(scoreDiff) > 0.05) return scoreDiff;
            return b.citationCount - a.citationCount;
        })
        .filter(paper => paper.relevance_score >= 0.8)
    const allPapers = goodPapers.slice(0, 10);
    console.log(allPapers)
    return allPapers;
}