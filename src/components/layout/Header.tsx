"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Menu,
  X,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || "1";

/** Product category pages linked directly from the nav */
const CATEGORIES = [
  { label: "Solar Cameras", href: "/products?category=Solar+cameras" },
  {
    label: "Solar Street Lights",
    href: "/products?category=Solar+streetlights",
  },
  { label: "Solar Floodlights", href: "/products?category=Solar+Floodlights" },
  {
    label: "Energy Storage",
    href: "/products?category=Lithium+battery%2C+lithium+tubular+battery",
  },
  {
    label: "Solar Indoor Lights",
    href: "/products?category=Solar+ceiling+lamps",
  },
  { label: "Solar Fans", href: "/products?category=Solar+fans" },
  {
    label: "Batteries & Inverters",
    href: "/products?category=Hybrid+inverters",
  },
];

export function Header() {
  const router = useRouter();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoCandidates = [
    "/image/cec-logo.png",
    "/image/logo.png",
    "/image/cec.png",
  ].filter(Boolean);
  const [logoIdx, setLogoIdx] = useState(0);

  const isHome = router.pathname === "/";
  const activeCat = CATEGORIES.find(
    (c) =>
      router.asPath.startsWith(c.href.split("?")[0]) &&
      router.query.category ===
        c.href.split("category=")[1]?.replace(/\+/g, " "),
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* ── Top bar: logo + utility icons ── */}
      <div className="container flex h-14 sm:h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="CeC Ayigo home">
          <Image
            src={`${logoCandidates[logoIdx]}?v=${ASSET_VERSION}`}
            alt="CeC Ayigo"
            width={160}
            height={44}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
            onError={() =>
              setLogoIdx((i) => Math.min(i + 1, logoCandidates.length - 1))
            }
          />
        </Link>

        {/* Desktop: Home link + categories */}
        <nav
          className="hidden lg:flex items-center gap-0.5"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              isHome
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <span className="text-border mx-1">|</span>
          {CATEGORIES.map((cat) => {
            const active =
              router.asPath === cat.href ||
              router.query.category ===
                decodeURIComponent(cat.href.split("category=")[1] || "");
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                  active
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: theme + account + hamburger */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 h-8 px-2.5 rounded border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {profile?.displayName
                      ? profile.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {profile?.displayName || "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-card border-border rounded-lg shadow-card-md"
              >
                <div className="px-3 py-2 border-b border-border text-xs">
                  <p className="font-semibold text-foreground truncate">
                    {profile?.displayName || "Customer"}
                  </p>
                  <p className="text-muted-foreground truncate text-[11px]">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">
                      Administrator
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/dashboard"
                      className="text-xs font-semibold text-primary flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/order-tracking"
                    className="text-xs flex items-center gap-2 py-2 cursor-pointer text-foreground"
                  >
                    <Package className="h-3.5 w-3.5" /> Track My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-xs text-primary flex items-center gap-2 py-2 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 h-8 px-3 rounded border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Hamburger — tablet + mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded border border-border text-foreground hover:bg-muted transition-colors"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet nav drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav
              className="container py-3 flex flex-col gap-0.5"
              aria-label="Mobile navigation"
            >
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isHome
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Home
              </Link>

              {/* Thin divider */}
              <div className="border-t border-border my-1" />
              <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Product Categories
              </p>

              {CATEGORIES.map((cat) => {
                const active = router.asPath === cat.href;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                      active
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}

              {/* Admin link if applicable */}
              {isAdmin && (
                <>
                  <div className="border-t border-border my-1" />
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                  </Link>
                </>
              )}

              {!user && (
                <>
                  <div className="border-t border-border my-1" />
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 mx-3 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:opacity-90"
                  >
                    <User className="h-4 w-4" /> Sign In / Register
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
