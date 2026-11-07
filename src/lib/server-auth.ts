import type { NextApiRequest, NextApiResponse } from "next";
import type { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "@/lib/firebase-admin";

/** Reads and verifies the Firebase ID token sent as "Authorization: Bearer <token>". */
export async function getCaller(req: NextApiRequest): Promise<DecodedIdToken | null> {
  const match = (req.headers.authorization || "").match(/^Bearer (.+)$/i);
  if (!match) return null;
  try {
    // `true` = also reject tokens of users whose access was revoked (e.g. demoted admins)
    return await auth.verifyIdToken(match[1], true);
  } catch {
    return null;
  }
}

/** Use at the top of any admin-only API route. Returns null (and has already replied) if not allowed. */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DecodedIdToken | null> {
  const caller = await getCaller(req);
  if (!caller) {
    res.status(401).json({ error: "Please sign in." });
    return null;
  }
  if (caller.role !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return null;
  }
  return caller;
}
