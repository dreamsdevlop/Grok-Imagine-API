const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export async function ollamaChat(messages: any[], model: string = "qwen2.5:0.5b") {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Ollama API Error:", error.message);
        throw error;
    }
}

export async function listLocalModels() {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.models || [];
    } catch (error) {
        return [];
    }
}
