import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, profile, loading, emailVerified, resendVerification, checkEmailVerified, signOut } = useAuth();
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Already verified (or not signed in): nothing to do here
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (emailVerified) router.replace(profile?.role === "admin" ? "/admin/dashboard" : "/products");
  }, [loading, user, emailVerified, profile, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleCheck = async () => {
    setChecking(true);
    try {
      const ok = await checkEmailVerified();
      if (!ok) toast.error("Not verified yet. Open the link in the email first, then try again.");
    } catch {
      toast.error("Could not check right now. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setCooldown(60);
      toast.success("Verification email sent. Check your inbox and spam folder.");
    } catch (err: any) {
      toast.error(
        err?.code === "auth/too-many-requests"
          ? "Too many requests. Please wait a few minutes before asking for another email."
          : "Could not send the email. Please try again."
      );
    }
  };

  if (loading || !user) return null;

  return(
    <>
      <Head><title>Verify your email | CeC Ayigo</title></Head>
      <div className="min-h-[70vh] py-12 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MailCheck className="h-5 w-5" /> Verify your email</CardTitle>
            <CardDescription>
              We sent a verification link to <strong>{user.email}</strong>. Open it, then come back here and press the button below.
              Check your spam folder if you don&apos;t see it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={handleCheck} disabled={checking}>
              {checking ? "Checking…" : "I've verified my email"}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleResend} disabled={cooldown > 0}>
              {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend verification email"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={signOut}>Sign out</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

}