import type { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/server-auth";
import { isRole } from "@/lib/roles";

/** PATCH /api/admin/users/:uid/role  { role: "admin" | "customer" } */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  const caller = await requireAdmin(req, res);
  if (!caller) return;

  const uid = String(req.query.uid || "");
  const { role } = req.body || {};
  if (!uid || !isRole(role)) return res.status(400).json({ error: "A user and a valid role are required." });

  // Prevents locking yourself out — and guarantees at least one admin always remains.
  if (uid === caller.uid) {
    return res.status(400).json({ error: "You can't change your own role. Ask another admin." });
  }

  try {
    await auth.getUser(uid); // throws if the user doesn't exist
    await auth.setCustomUserClaims(uid, { role });
    await db.collection("users").doc(uid).set({ role }, { merge: true });
    // On demotion, force their existing sessions to expire so access ends right away.
    if (role === "customer") await auth.revokeRefreshTokens(uid);
    return res.status(200).json({ ok: true, uid, role });
  } catch (error: any) {
    if (error?.code === "auth/user-not-found") return res.status(404).json({ error: "User not found." });
    console.error("set role error:", error);
    return res.status(500).json({ error: "Could not update the role." });
  }
}
