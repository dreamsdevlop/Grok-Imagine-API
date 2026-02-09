
import "dotenv/config";

async function discoverEndpoints() {
    const host = "xai-all-models.p.rapidapi.com";
    const key = process.env.RAPIDAPI_KEY;
    const paths = [
        "/v1/chat/completions",
        "/v1/images/generations",
    ];

    console.log(`Testing host: ${host} with POST`);
    for (const path of paths) {
        try {
            const res = await fetch(`https://${host}${path}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-rapidapi-key": key || "",
                    "x-rapidapi-host": host,
                },
                body: JSON.stringify({
                    model: "grok-2",
                    messages: [{ role: "user", content: "hi" }],
                    prompt: "test", // for images
                    n: 1,
                    size: "256x256"
                })
            });
            console.log(`${path} -> ${res.status}`);
            const text = await res.text();
            try {
                console.log(`Response: ${JSON.stringify(JSON.parse(text), null, 2)}`);
            } catch {
                console.log(`Raw: ${text}`);
            }
        } catch (err: any) {
            console.log(`${path} -> Error: ${err.message}`);
        }
    }
}

discoverEndpoints();
