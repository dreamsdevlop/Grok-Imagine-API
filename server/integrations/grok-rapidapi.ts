import { storage } from "../storage";

/**
 * Grok / RapidAPI Integration
 * Handles image, chat, and video generation via X-AI All Models on RapidAPI
 */

export function extractBase64Images(payload: any): { mimeType: string; dataBase64: string }[] {
    const images: { mimeType: string; dataBase64: string }[] = [];

    if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.data)) {
            payload.data.forEach((item: any) => {
                if (item.b64_json) {
                    images.push({ mimeType: "image/png", dataBase64: item.b64_json });
                } else if (item.url && item.url.startsWith('data:')) {
                    const match = item.url.match(/^data:([^;]+);base64,(.+)$/);
                    if (match) {
                        images.push({ mimeType: match[1], dataBase64: match[2] });
                    }
                }
            });
        } else if (Array.isArray(payload)) {
            payload.forEach((item: any) => {
                if (typeof item === 'string' && item.length > 100) {
                    images.push({ mimeType: "image/png", dataBase64: item });
                }
            });
        }
    }

    return images;
}

export const getApiKeys = () => {
    const keys = [process.env.RAPIDAPI_KEY, process.env.RAPIDAPI_KEY_2].filter(Boolean) as string[];
    if (keys.length === 0) {
        throw new Error("RAPIDAPI_KEY must be set");
    }
    return keys;
};

export async function callRapidApiWithRetry(
    url: string,
    body: any,
    errorMessage: string
): Promise<any> {
    const keys = getApiKeys();
    let lastError: Error | null = null;

    for (const key of keys) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-rapidapi-key": key,
                    "x-rapidapi-host": "xai-all-models.p.rapidapi.com",
                },
                body: JSON.stringify(body),
            });

            const text = await res.text();
            let payload: any;
            try {
                payload = text ? JSON.parse(text) : {};
            } catch {
                payload = { raw: text };
            }

            if (!res.ok) {
                if (res.status === 429 || res.status === 401 || res.status === 403) {
                    console.warn(`RapidAPI key ${key.substring(0, 8)}... failed with status ${res.status}. Trying next key...`);
                    const msg = payload?.error?.message ?? payload?.message ?? payload?.error ?? `RapidAPI request failed (${res.status})`;
                    lastError = new Error(msg);
                    continue;
                }

                const msg = payload?.error?.message ?? payload?.message ?? payload?.error ?? `RapidAPI request failed (${res.status})`;
                throw new Error(msg);
            }
            return payload;
        } catch (error: any) {
            console.error(`RapidAPI attempt with key ${key.substring(0, 8)}... failed:`, error);
            lastError = error;
        }
    }

    throw lastError ?? new Error(errorMessage);
}

export async function callRapidApiGenerateImage(input: {
    prompt: string;
    model: string;
    n: number;
    size: string;
}) {
    const url = "https://xai-all-models.p.rapidapi.com/images/generations";
    const body = {
        prompt: input.prompt,
        model: input.model,
        n: input.n,
        size: input.size,
        response_format: "b64_json",
    };

    const payload = await callRapidApiWithRetry(url, body, "Image generation failed");
    const images = extractBase64Images(payload);
    return { images, raw: payload };
}

export async function callRapidApiChatCompletion(input: {
    messages: { role: string; content: string }[];
    model: string;
}) {
    const url = "https://xai-all-models.p.rapidapi.com/chat/completions";

    const body = {
        model: input.model,
        messages: input.messages,
        max_tokens: 1000,
        temperature: 0.7,
    };

    const payload = await callRapidApiWithRetry(url, body, "Chat completion failed");
    const content = payload?.choices?.[0]?.message?.content ?? "";
    return { content, raw: payload };
}

export async function callRapidApiGenerateVideo(input: {
    prompt: string;
    model: string;
    duration: number;
    width: number;
    height: number;
}) {
    const url = "https://xai-all-models.p.rapidapi.com/videos/generations";

    const body = {
        prompt: input.prompt,
        model: input.model,
        duration: input.duration,
        width: input.width,
        height: input.height,
    };

    const payload = await callRapidApiWithRetry(url, body, "Video generation failed");

    const videoUrl = payload?.data?.[0]?.url ?? "";
    const thumbnailUrl = payload?.data?.[0]?.thumbnail_url ?? "";
    return { videoUrl, thumbnailUrl, raw: payload };
}
