
import "dotenv/config";

async function discoverHosts() {
    const hosts = [
        "xai-all-models.p.rapidapi.com",
        "x-grok-api.p.rapidapi.com",
        "grok-api.p.rapidapi.com",
        "xai-api.p.rapidapi.com",
        "xai.p.rapidapi.com"
    ];
    const key = process.env.RAPIDAPI_KEY;

    for (const host of hosts) {
        try {
            const res = await fetch(`https://${host}/v1/models`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": key,
                    "x-rapidapi-host": host,
                }
            });
            console.log(`${host} -> ${res.status}`);
        } catch (err) {
            console.log(`${host} -> Error: ${err.message}`);
        }
    }
}

discoverHosts();
