import type { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/server-auth";
import { isRole, Role } from "@/lib/roles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const caller = await requireAdmin(req, res);
  if (!caller) return;

  // ---------- LIST ----------
  if (req.method === "GET") {
    try {
      const users: any[] = [];
      let pageToken: string | undefined;
      do {
        const page = await auth.listUsers(1000, pageToken);
        page.users.forEach((u) => {
          if (!u.email) return; // skip anonymous visitors
          users.push({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || u.email.split("@")[0],
            role: u.customClaims?.role === "admin" ? "admin" : "customer",
            disabled: u.disabled,
            createdAt: u.metadata.creationTime,
          });
        });
        pageToken = page.pageToken;
      } while (pageToken && users.length < 5000);

      // add phone numbers saved at sign-up
      if (users.length) {
        const refs = users.slice(0, 500).map((u) => db.collection("users").doc(u.uid));
        const docs = await db.getAll(...refs);
        docs.forEach((d, i) => {
          if (d.exists) users[i].phone = d.data()?.phone || "";
        });
      }
      users.sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === "admin" ? -1 : 1));
      return res.status(200).json({ users });
    } catch (error) {
      console.error("list users error:", error);
      return res.status(500).json({ error: "Could not load users." });
    }
  }

  // ---------- CREATE (only admins can reach this, so only admins can create admins) ----------
  if (req.method === "POST") {
    const { name, email, password, role } = req.body || {};
    const newRole: Role = isRole(role) ? role : "customer";

    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Temporary password must be at least 8 characters." });
    }
    const displayName = typeof name === "string" && name.trim() ? name.trim().slice(0, 80) : email.split("@")[0];

    try {
      const record = await auth.createUser({
        email: email.trim().toLowerCase(),
        password,
        displayName,
        emailVerified: false,
      });
      await auth.setCustomUserClaims(record.uid, { role: newRole });
      await db.collection("users").doc(record.uid).set({
        uid: record.uid,
        email: record.email,
        displayName,
        role: newRole,
        phone: "",
        mustChangePassword: true, // they must choose their own password on first sign-in
        createdBy: caller.uid,
        createdAt: new Date().toISOString(),
      });


      // Ask Firebase to email them a verification link right away
      // (the Admin SDK cannot send it, so we sign in as them once with the temporary password).
      let verificationEmailSent = false;
      try {
        const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const signIn = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password, returnSecureToken: true }),
          }
        );
        const signInData = await signIn.json();
        if (signIn.ok && signInData.idToken) {
          const send = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken: signInData.idToken }),
            }
          );
          verificationEmailSent = send.ok;
        }
      } catch (e) {
        console.warn("Could not send verification email:", e);
      }

      // return res.status(201).json({
      //   user: { uid: record.uid, email: record.email, displayName, role: newRole },
      //   verificationEmailSent,
      // });





      return res.status(201).json({
        user: { uid: record.uid, email: record.email, displayName, role: newRole },
      });
    } catch (error: any) {
      if (error?.code === "auth/email-already-exists") {
        return res.status(409).json({
          error: "An account with this email already exists. Use \"Make Admin\" in the list below instead.",
        });
      }
      if (error?.code === "auth/invalid-password") {
        return res.status(400).json({ error: "That password is too weak." });
      }
      console.error("create user error:", error);
      return res.status(500).json({ error: "Could not create the account." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
