import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { authFetch } from "@/lib/authFetch";
import { useAuth } from "@/contexts/AuthContext";

export default function SecurityPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">Please sign in to manage your password.</p>
        <Button asChild><Link href="/login?redirect=/account/security">Sign in</Link></Button>
      </div>
    );
  }

  const forced = !!profile?.mustChangePassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (next !== confirm) return toast.error("The new passwords don't match.");
    if (next === current) return toast.error("Choose a password different from the current one.");

    try {
      setSaving(true);
      const fbUser = auth.currentUser!;
      await reauthenticateWithCredential(fbUser, EmailAuthProvider.credential(fbUser.email!, current));
      await updatePassword(fbUser, next);
      await authFetch("/api/auth/password-changed", { method: "POST" });
      await refreshProfile();
      toast.success("Password updated.");
      router.push(profile?.role === "admin" ? "/admin/dashboard" : "/products");
    } catch (err: any) {
      toast.error(
        err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password"
          ? "Your current password is incorrect."
          : err?.message || "Could not update the password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head><title>Change Password | CeC Ayigo</title></Head>
      <div className="min-h-[70vh] py-12 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Change password</CardTitle>
            <CardDescription>
              {forced
                ? "You're using a temporary password. Please choose your own before continuing."
                : "Enter your current password and pick a new one."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input type="password" placeholder="Current (temporary) password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
              <Input type="password" placeholder="New password (min. 8 characters)" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
              <Input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
              <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving…" : "Update password"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
