import { ApiKeyManager } from "../services/api-key-manager";

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

export async function togetherChatCompletion(messages: any[], model: string = "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo") {
    const apiKey = await ApiKeyManager.getDecryptedKey("together");
    if (!apiKey) throw new Error("Together AI key not found");

    try {
        const response = await fetch(TOGETHER_API_URL, {
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
            throw new Error(`Together AI Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Together AI Error:", error.message);
        throw error;
    }
}
