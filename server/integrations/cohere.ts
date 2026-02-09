import { ApiKeyManager } from "../services/api-key-manager";

const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

export async function cohereChatCompletion(messages: any[], model: string = "command-r-plus") {
    const apiKey = await ApiKeyManager.getDecryptedKey("cohere");
    if (!apiKey) throw new Error("Cohere API key not found");

    const lastMessage = messages[messages.length - 1]?.content || "";
    const history = messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "CHATBOT" : "USER",
        message: m.content
    }));

    try {
        const response = await fetch(COHERE_API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: lastMessage,
                model,
                chat_history: history,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Cohere Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        return {
            choices: [{
                message: {
                    role: "assistant",
                    content: data.text || ""
                },
                finish_reason: "stop"
            }],
            usage: {
                total_tokens: data.token_count?.total_tokens || 0
            }
        };
    } catch (error: any) {
        console.error("Cohere API Error:", error.message);
        throw error;
    }
}
