// scripts/register-panta.js
const BASE = "https://live-api.panta.market/api/v1";

const { PANTA_EMAIL: email, PANTA_PASSWORD: password, PANTA_APP_NAME: name = "Panta Creator" } = process.env;

async function main() {
  if (!email || !password) {
    throw new Error("Set PANTA_EMAIL and PANTA_PASSWORD before running this script.");
  }

  console.log("1. Registering account...");
  const registerRes = await fetch(`${BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const registerText = await registerRes.text();
  console.log("Status:", registerRes.status);
  console.log("Response:", registerText);

  let registerData;
  try {
    registerData = JSON.parse(registerText);
  } catch {
    console.error("Could not parse register response as JSON.");
    return;
  }

  const accessToken =
    registerData.access || registerData.access_token || registerData.token;

  if (!accessToken) {
    console.error("\n❌ No access token in response.");
    console.error("If you already registered this email, try logging in instead (see below).");
    return;
  }

    console.log("\n2. Creating API key...");
  const keyRes = await fetch(`${BASE}/account/keys/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ env: "test" }), // <-- ADDED
  });


  const keyText = await keyRes.text();
  console.log("Status:", keyRes.status);
  console.log("Response:", keyText);

  let keyData;
  try {
    keyData = JSON.parse(keyText);
  } catch {
    console.error("Could not parse key response as JSON.");
    return;
  }

  const apiKey =
    keyData.key || keyData.secret || keyData.apiKey || keyData.api_key;

  if (apiKey) {
    console.log("\n========================================");
    console.log("✅ YOUR PANTA API KEY:");
    console.log(apiKey);
    console.log("========================================");
    console.log("Copy this into your .env.local as PANTA_API_KEY");
    console.log("It will NOT be shown again.");
  } else {
    console.log("\nFull response (look for the key field):");
    console.log(JSON.stringify(keyData, null, 2));
  }
}

main().catch(console.error);
