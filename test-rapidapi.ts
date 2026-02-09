
import "dotenv/config";

async function testRapidApi() {
    const url = "https://xai-all-models.p.rapidapi.com/v1/chat/completions";
    const body = {
        model: "grok-beta",
        messages: [{ role: "user", content: "Hello" }],
    };

    const keys = [process.env.RAPIDAPI_KEY, process.env.RAPIDAPI_KEY_2].filter(Boolean);

    for (const key of keys) {
        console.log(`Testing key: ${key.substring(0, 8)}...`);
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

            console.log(`Status: ${res.status}`);
            const text = await res.text();
            try {
                console.log(`Response: ${JSON.stringify(JSON.parse(text), null, 2)}`);
            } catch {
                console.log(`Raw Response: ${text}`);
            }
        } catch (err) {
            console.error(`Error:`, err);
        }
    }
}

testRapidApi();
