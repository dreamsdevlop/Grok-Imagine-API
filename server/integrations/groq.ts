import { ApiKeyManager } from "../services/api-key-manager";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function groqChatCompletion(messages: any[], model: string = "llama-3.1-70b-versatile") {
    const apiKey = await ApiKeyManager.getDecryptedKey("groq");
    if (!apiKey) throw new Error("Groq API key not found");

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Groq Error:", error.message);
        throw error;
    }
}
