import type { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/lib/firebase-admin";
import { getCaller } from "@/lib/server-auth";

/**
 * GET/POST /api/auth/profile
 * Returns the caller's profile, creating it on first sign-in.
 * The role is NEVER taken from the request: it comes from the verified token (custom claim),
 * and anyone without the claim is a customer.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const caller = await getCaller(req);
  if (!caller || caller.firebase?.sign_in_provider === "anonymous") {
    return res.status(401).json({ error: "Please sign in." });
  }

  try {
    const role = caller.role === "admin" ? "admin" : "customer";
    const ref = db.collection("users").doc(caller.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const record = await auth.getUser(caller.uid);
      const phone =
        req.method === "POST" && typeof req.body?.phone === "string"
          ? req.body.phone.trim().slice(0, 30)
          : "";
      const profile = {
        uid: caller.uid,
        email: record.email || "",
        displayName: record.displayName || (record.email || "Customer").split("@")[0],
        role,
        phone,
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
      };
      await ref.set(profile);
      return res.status(200).json({ profile });
    }

    const data = snap.data() as Record<string, any>;
    // Keep the stored copy in sync with the real source of truth (the token claim)
    if (data.role !== role) {
      await ref.set({ role }, { merge: true });
      data.role = role;
    }
    return res.status(200).json({ profile: { uid: caller.uid, ...data } });
  } catch (error) {
    console.error("profile error:", error);
    return res.status(500).json({ error: "Could not load profile." });
  }
}
