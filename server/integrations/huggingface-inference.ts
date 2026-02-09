import { ApiKeyManager } from "../services/api-key-manager";

const HF_API_URL = "https://api-inference.huggingface.co/models";

export async function hfInference(inputs: any, model: string = "stabilityai/stable-diffusion-3.5-large") {
    const apiKey = await ApiKeyManager.getDecryptedKey("huggingface");
    if (!apiKey) throw new Error("HuggingFace API key not found");

    try {
        const response = await fetch(`${HF_API_URL}/${model}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HuggingFace Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        // For image generation, this often returns a blob
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("image/")) {
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }

        return await response.json();
    } catch (error: any) {
        console.error("HuggingFace API Error:", error.message);
        throw error;
    }
}
export async function chatCompletion(input: {
    messages: { role: string; content: string }[];
    model: string;
}) {
    // Format messages for typical HF chat models
    const prompt = input.messages
        .map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`)
        .join('\n\n') + '\n\nAssistant:';

    const result = await hfInference({
        inputs: prompt,
        parameters: { max_new_tokens: 512, return_full_text: false }
    }, input.model);

    // HF usually returns [{ generated_text: "..." }]
    const content = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text || "";

    return {
        content: content.trim(),
        raw: result
    };
}
