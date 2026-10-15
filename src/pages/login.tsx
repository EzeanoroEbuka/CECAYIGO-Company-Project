import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, profile, isAdmin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in email and password.");
      return;
    }

    try {
      setLoading(true);
      if (isRegisterMode) {
        if (!name.trim()) {
          toast.error("Please provide your full name.");
          setLoading(false);
          return;
        }
        await signUp(name, email, password, phone);
      } else {
        await signIn(email, password);
      }

      const redirectPath = router.query.redirect as string;
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Authentication failed. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {isRegisterMode ? "Create Customer Account" : "Sign In"} | CeC Ayigo
        </title>
        <meta
          name="description"
          content="Sign in or register for your official CeC Ayigo customer account."
        />
      </Head>

      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center transition-colors">
        <div className="w-full max-w-md">
          {/* Logo & Brand Header */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-block bg-card p-3 rounded-2xl border border-border hover:border-brand-red/30 transition-colors shadow-xs mb-3"
            >
              <Image
                src="/image/cec-logo.png"
                alt="CeC Ayigo"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h1 className="text-2xl font-extrabold text-foreground">
              {isRegisterMode ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              One account for ordering, tracking delivery, and accessing the
              company portal.
            </p>
          </div>

          <Card className="border border-border bg-card rounded-3xl shadow-md overflow-hidden">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 border-b border-border bg-muted">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`py-3.5 text-xs sm:text-sm font-bold transition-all ${
                  !isRegisterMode
                    ? "bg-background text-brand-red border-b-2 border-brand-red shadow-xs"
                    : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`py-3.5 text-xs sm:text-sm font-bold transition-all ${
                  isRegisterMode
                    ? "bg-background text-brand-red border-b-2 border-brand-red shadow-xs"
                    : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        required
                        type="text"
                        placeholder="e.g. Chukwuemeka Obi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 bg-input border-border focus:border-brand-red rounded-xl text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-input border-border focus:border-brand-red rounded-xl text-sm"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+234 803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-11 bg-input border-border focus:border-brand-red rounded-xl text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-input border-border focus:border-brand-red rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isRegisterMode && (
                  <div className="text-[11px] text-muted-foreground bg-cream-50 dark:bg-gray-800/60 p-3 rounded-xl border border-border">
                    <ShieldCheck className="h-4 w-4 text-brand-red inline mr-1 -mt-0.5" />
                    The first registered account automatically receives full
                    Administrator privileges.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm shadow-xs transition-colors mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRegisterMode
                        ? "Create Account & Sign In"
                        : "Sign In to Account"}
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Back Link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-brand-red"
            >
              &larr; Back to CeC Ayigo Store
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
