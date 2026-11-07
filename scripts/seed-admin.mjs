/**
 * Creates the FIRST admin account (the "default admin").
 * Safe to run more than once.
 *
 *   npm run seed:admin
 *
 * Optional settings (in .env, or inline):
 *   SEED_ADMIN_EMAIL     default: admin@cecayigo.com
 *   SEED_ADMIN_PASSWORD  default: a random strong password, printed ONCE below
 *   SEED_ADMIN_NAME      default: CeC Ayigo Admin
 *
 * If the account already exists it is (re)promoted to admin. Its password is only changed
 * if you explicitly set SEED_ADMIN_PASSWORD — that is how you recover a forgotten admin password.
 */
import { randomBytes } from "node:crypto";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch (e) {
    if (typeof process.loadEnvFile !== "function") {
      console.error("This script needs Node.js 20.12 or newer. Please upgrade Node and try again.");
      process.exit(1);
    }
    /* file not present — fine */
  }
}

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in your .env file.");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/^"+|"+$/g, "").replace(/\\n/g, "\n"),
  }),
});
const auth = getAuth();
const db = getFirestore();

const email = (process.env.SEED_ADMIN_EMAIL || "admin@cecayigo.com").trim().toLowerCase();
const displayName = process.env.SEED_ADMIN_NAME || "CeC Ayigo Admin";
const givenPassword = process.env.SEED_ADMIN_PASSWORD;
const password = givenPassword || randomBytes(12).toString("base64url"); // 16 chars

let uid;
let created = false;
try {
  const existing = await auth.getUserByEmail(email);
  uid = existing.uid;
  if (givenPassword) await auth.updateUser(uid, { password: givenPassword });
} catch (error) {
  if (error.code !== "auth/user-not-found") throw error;
  const record = await auth.createUser({ email, password, displayName, emailVerified: true });
  uid = record.uid;
  created = true;
}

await auth.setCustomUserClaims(uid, { role: "admin" });
await db.collection("users").doc(uid).set(
  {
    uid,
    email,
    displayName,
    role: "admin",
    phone: "",
    // Force a password change on first sign-in whenever we set/generate the password
    ...(created || givenPassword ? { mustChangePassword: true } : {}),
    createdAt: new Date().toISOString(),
  },
  { merge: true }
);

console.log("\n==============================================");
console.log(created ? " Default admin account CREATED" : " Existing account promoted to admin");
console.log("----------------------------------------------");
console.log(" Email:    ", email);
if (created || givenPassword) {
  console.log(" Password: ", password);
  console.log(" (You will be asked to change this at first sign-in. Save it now — it is not shown again.)");
} else {
  console.log(" Password:  unchanged (set SEED_ADMIN_PASSWORD to reset it)");
}
console.log(" Sign in at: /login");
console.log("==============================================\n");
process.exit(0);
