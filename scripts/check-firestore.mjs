/**
 * Diagnoses "5 NOT_FOUND" Firestore errors.   Run:  node scripts/check-firestore.mjs
 * It prints project IDs and Google's own answer. It never prints your private key.
 */
import { cert } from "firebase-admin/app";

for (const file of [".env.local", ".env"]) {
  try { process.loadEnvFile(file); } catch { /* file not present */ }
}

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in .env");
  process.exit(1);
}

const emailProject = (FIREBASE_CLIENT_EMAIL.match(/@(.+)\.iam\.gserviceaccount\.com$/) || [])[1];
console.log("\nServer project (FIREBASE_PROJECT_ID):     ", JSON.stringify(FIREBASE_PROJECT_ID));
console.log("Browser project (NEXT_PUBLIC_..._PROJECT_ID):", JSON.stringify(NEXT_PUBLIC_FIREBASE_PROJECT_ID));
console.log("Service account email:                    ", FIREBASE_CLIENT_EMAIL);
console.log("Project the service account belongs to:   ", emailProject);
if (emailProject !== FIREBASE_PROJECT_ID) console.log(">>> MISMATCH: the service-account key is from a different project than FIREBASE_PROJECT_ID");
if (NEXT_PUBLIC_FIREBASE_PROJECT_ID !== FIREBASE_PROJECT_ID) console.log(">>> MISMATCH: browser and server point at different projects");

const credential = cert({
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY.replace(/^"+|"+$/g, "").replace(/\\n/g, "\n"),
});

async function call(label, url, init = {}) {
  try {
    const { access_token } = await credential.getAccessToken();
    const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" } });
    const text = await res.text();
    console.log(`\n--- ${label} --- HTTP ${res.status}`);
    console.log(text.slice(0, 1500));
  } catch (e) {
    console.log(`\n--- ${label} --- FAILED: ${e.message}`);
  }
}

const base = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}`;
await call("Databases in this project", `${base}/databases`);
await call("Can the (default) database be used?", `${base}/databases/(default)/documents:listCollectionIds`, {
  method: "POST",
  body: "{}",
});
console.log("\nDone. Copy everything above (it contains no secrets) and send it back.\n");