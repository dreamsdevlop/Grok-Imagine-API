import { ApiKeyManager } from "../services/api-key-manager";

const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function googleChatCompletion(messages: any[], model: string = "gemini-1.5-flash") {
    const apiKey = await ApiKeyManager.getDecryptedKey("google");
    if (!apiKey) throw new Error("Google AI key not found");

    // Convert OpenAI format to Gemini format
    const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));

    try {
        const response = await fetch(`${GOOGLE_API_URL}/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contents }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Google AI Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // Map Gemini response back to OpenAI-compatible format
        return {
            choices: [{
                message: {
                    role: "assistant",
                    content: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                },
                finish_reason: "stop"
            }],
            usage: {
                total_tokens: 0 // Google doesn't return this in simple generateContent often without extra flags
            }
        };
    } catch (error: any) {
        console.error("Google AI Studio Error:", error.message);
        throw error;
    }
}
