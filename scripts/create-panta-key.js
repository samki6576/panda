// scripts/create-panta-key.js
const BASE = "https://live-api.panta.market/api/v1";

const accessToken = process.env.PANTA_ACCESS_TOKEN;

async function tryEnv(env) {
  if (!accessToken) {
    throw new Error("Set PANTA_ACCESS_TOKEN before running this script.");
  }

  console.log(`\nTrying env: "${env}"...`);
  const res = await fetch(`${BASE}/account/keys/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ env }),
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);

  if (res.ok) {
    try {
      const data = JSON.parse(text);
      const key = data.key || data.secret || data.apiKey || data.api_key;
      if (key) {
        console.log("\n========================================");
        console.log("✅ YOUR PANTA API KEY:");
        console.log(key);
        console.log("========================================");
        return true;
      }
    } catch {}
  }
  return false;
}

async function main() {
  // Try common env names — stop at first success
  const candidates = ["test", "sandbox", "dev", "development", "staging", "live", "production"];
  for (const env of candidates) {
    const ok = await tryEnv(env);
    if (ok) return;
  }
  console.log("\n❌ None of the env values worked. Check Panta docs for the exact value.");
}

main().catch(console.error);
