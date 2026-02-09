/**
 * Groq Free Tier Integration
 * Uses Groq API (OpenAI-compatible)
 * Priority models: Llama 3.1 70B, Mixtral 8x7B
 */

export async function chatCompletion(input: {
    messages: { role: string; content: string }[];
    model: string;
}) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    // Model names mapping to official Groq API IDs
    const modelMap: Record<string, string> = {
        "groq/llama-3.1-70b-versatile": "llama-3.1-70b-versatile",
        "groq/mixtral-8x7b-32768": "mixtral-8x7b-32768",
        "groq/gemma2-9b-it": "gemma2-9b-it",
    };

    const groqModel = modelMap[input.model] || input.model.replace("groq/", "");
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: groqModel,
            messages: input.messages,
            max_tokens: 1024,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message ?? `Groq API failed (${response.status})`;
        throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return {
        content,
        raw: data,
    };
}
