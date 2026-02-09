/**
 * Together AI Free Tier Integration
 * Uses Together AI API (OpenAI-compatible)
 */

export async function chatCompletion(input: {
    messages: { role: string; content: string }[];
    model: string;
}) {
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
        throw new Error("TOGETHER_API_KEY is not configured");
    }

    const model = input.model.replace("together/", "");
    const url = "https://api.together.xyz/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            messages: input.messages,
            max_tokens: 1024,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message ?? `Together AI API failed (${response.status})`;
        throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return {
        content,
        raw: data,
    };
}
