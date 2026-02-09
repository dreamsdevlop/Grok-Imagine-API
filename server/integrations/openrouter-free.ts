import { ApiKeyManager } from "../services/api-key-manager";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";

export async function chatCompletion(messages: any[], model: string = "google/gemini-2.0-flash-exp:free") {
    const apiKey = await ApiKeyManager.getDecryptedKey("openrouter");
    if (!apiKey) throw new Error("OpenRouter API key not found");

    try {
        const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Grok Multi-Model Studio",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenRouter Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("OpenRouter API Error:", error.message);
        throw error;
    }
}
