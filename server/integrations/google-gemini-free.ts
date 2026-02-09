/**
 * Google Gemini Free Tier Integration
 * Uses Google AI Studio API for Gemini 2.0 Flash / 1.5 Flash
 */

export async function chatCompletion(input: {
    messages: { role: string; content: string }[];
    model: string;
}) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    // Model names mapping to official Google API IDs
    const modelMap: Record<string, string> = {
        "google/gemini-2.0-flash-exp:free": "gemini-2.0-flash-exp",
        "google/gemini-1.5-flash:free": "gemini-1.5-flash",
        "gemini-2.0-flash-exp": "gemini-2.0-flash-exp",
        "gemini-1.5-flash": "gemini-1.5-flash",
    };

    const googleModel = modelMap[input.model] || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${apiKey}`;

    // Convert messages to Google format
    const contents = input.messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
    }));

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents,
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message ?? `Google Gemini API failed (${response.status})`;
        throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return {
        content,
        raw: data,
    };
}
