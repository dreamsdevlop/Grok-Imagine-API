
import "dotenv/config";

async function testNoV1() {
    const host = "xai-all-models.p.rapidapi.com";
    const key = process.env.RAPIDAPI_KEY;
    const path = "/chat/completions";

    console.log(`Testing POST https://${host}${path}`);
    try {
        const res = await fetch(`https://${host}${path}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-rapidapi-key": key,
                "x-rapidapi-host": host,
            },
            body: JSON.stringify({
                model: "grok-2",
                messages: [{ role: "user", content: "hi" }]
            })
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Response: ${text}`);
    } catch (err) {
        console.error(`Error:`, err);
    }
}

testNoV1();
