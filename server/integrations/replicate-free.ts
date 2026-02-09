const REPLICATE_API_URL = "https://api.replicate.com/v1";

import { ApiKeyManager } from "../services/api-key-manager";

export async function replicateImageGen(prompt: string, model: string = "black-forest-labs/flux-schnell", version?: string) {
    const apiKey = await ApiKeyManager.getDecryptedKey("replicate");
    if (!apiKey) throw new Error("Replicate API key not found");

    const input = { prompt };

    try {
        const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
            method: 'POST',
            headers: {
                "Authorization": `Token ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version: version || (model.includes(":") ? model.split(':')[1] : undefined),
                model: model.includes(":") ? undefined : model,
                input,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Replicate Error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        let prediction = await response.json();

        // Poll for results (simple polling for demonstration)
        while (prediction.status !== "succeeded" && prediction.status !== "failed") {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const pollResponse = await fetch(`${REPLICATE_API_URL}/predictions/${prediction.id}`, {
                headers: { "Authorization": `Token ${apiKey}` },
            });
            prediction = await pollResponse.json();
        }

        if (prediction.status === "failed") {
            throw new Error(`Replicate Prediction Failed: ${prediction.error}`);
        }

        return prediction.output;
    } catch (error: any) {
        console.error("Replicate API Error:", error.message);
        throw error;
    }
}
