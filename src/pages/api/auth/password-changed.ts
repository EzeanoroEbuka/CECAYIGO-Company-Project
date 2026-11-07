import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase-admin";
import { getCaller } from "@/lib/server-auth";

/** POST /api/auth/password-changed — called after the user successfully sets a new password. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const caller = await getCaller(req);
  if (!caller || caller.firebase?.sign_in_provider === "anonymous") {
    return res.status(401).json({ error: "Please sign in." });
  }

  await db.collection("users").doc(caller.uid).set({ mustChangePassword: false }, { merge: true });
  return res.status(200).json({ ok: true });
}
