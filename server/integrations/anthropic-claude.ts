import { ApiKeyManager } from "../services/api-key-manager";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function anthropicChatCompletion(messages: any[], model: string = "claude-3-5-sonnet-20240620") {
    const apiKey = await ApiKeyManager.getDecryptedKey("anthropic");
    if (!apiKey) throw new Error("Anthropic API key not found");

    // Anthropic handles system messages separately
    const systemMessage = messages.find(m => m.role === "system")?.content;
    const filteredMessages = messages.filter(m => m.role !== "system");

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                max_tokens: 4096,
                system: systemMessage,
                messages: filteredMessages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Anthropic Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        return {
            choices: [{
                message: {
                    role: "assistant",
                    content: data.content?.[0]?.text || ""
                },
                finish_reason: data.stop_reason === "end_turn" ? "stop" : data.stop_reason
            }],
            usage: {
                total_tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0
            }
        };
    } catch (error: any) {
        console.error("Anthropic API Error:", error.message);
        throw error;
    }
}
