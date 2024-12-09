export async function vectorise(query: string) {
    const url = "https://api.openai.com/v1/embeddings";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
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
    const queryVector = result.data[0].embedding;
    return queryVector;
}

export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}


