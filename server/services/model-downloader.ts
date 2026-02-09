export async function pullLocalModel(model: string) {
    const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

    try {
        const response = await fetch(`${OLLAMA_URL}/api/pull`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: model, stream: false }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ollama Pull Error: ${error}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Model Downloader Error:", error.message);
        throw error;
    }
}

export async function deleteLocalModel(model: string) {
    const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

    try {
        const response = await fetch(`${OLLAMA_URL}/api/delete`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: model }),
        });

        if (!response.ok) throw new Error("Failed to delete model");
        return { success: true };
    } catch (error: any) {
        console.error("Model Delete Error:", error.message);
        throw error;
    }
}
