import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Menu,
  ShoppingCart,
  X,
  User,
  ShieldCheck,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || "3";

export function Header() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const envLogo = (process.env.NEXT_PUBLIC_LOGO_PATH || "").trim();
  const logoCandidates = [
    envLogo || "",
    "/image/cec-logo.png",
    "/image/logo.png",
    "/image/cec.png",
    "/image/cec-logo.png",
  ].filter(Boolean);
  const [logoIdx, setLogoIdx] = useState(0);

  const navItems = [
    { label: "Products & Prices", href: "/products" },
    { label: "Video Guides", href: "/guides" },
    { label: "Feedback", href: "/feedback" },
    { label: "Track Order", href: "/order-tracking" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border transition-colors shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex-shrink-0 group min-w-0"
            aria-label="CeC Ayigo Home"
          >
            <div className="relative bg-white dark:bg-brand-dark-card px-2 py-1.5 rounded-xl border border-border shadow-xs transition-all group-hover:border-brand-red/40">
              <Image
                src={`${logoCandidates[logoIdx]}${logoCandidates[logoIdx].startsWith("http") ? "" : `?v=${ASSET_VERSION}`}`}
                alt="CeC Ayigo"
                width={180}
                height={50}
                className="h-8 sm:h-10 w-auto object-contain max-w-[120px] sm:max-w-[160px]"
                priority
                onError={() =>
                  setLogoIdx((i) => Math.min(i + 1, logoCandidates.length - 1))
                }
              />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs sm:text-sm font-semibold px-3 py-2 rounded-full transition-all ${
                    isActive
                      ? "bg-brand-red text-white shadow-brand-red"
                      : "text-foreground/80 hover:text-brand-red hover:bg-brand-red/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart — hidden on xs, shown from sm up */}
            <Link
              href="/cart"
              aria-label="View shopping cart"
              className="hidden sm:inline-flex"
            >
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 px-3 bg-card hover:bg-muted text-foreground border border-border rounded-full font-medium transition-all shadow-xs"
              >
                <ShoppingCart className="h-4 w-4 text-brand-red mr-1" />
                <span className="hidden sm:inline text-xs font-bold">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1.5 bg-brand-red text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>
            {/* Cart icon-only on xs */}
            <Link
              href="/cart"
              aria-label="View shopping cart"
              className="sm:hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 bg-card hover:bg-muted text-foreground border border-border rounded-full transition-all shadow-xs"
              >
                <ShoppingCart className="h-4 w-4 text-brand-red" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-0.5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Account / Admin */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 bg-card text-foreground border border-border rounded-full flex items-center gap-1.5 shadow-xs text-xs font-semibold hover:bg-muted"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">
                      {profile?.displayName
                        ? profile.displayName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="hidden lg:inline max-w-[90px] truncate">
                      {profile?.displayName || "Account"}
                    </span>
                    {isAdmin && (
                      <span className="hidden xl:inline text-[9px] bg-brand-blue/20 text-brand-blue px-1.5 py-0.5 rounded font-bold uppercase">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-1.5 bg-card border-border shadow-card-dark rounded-2xl"
                >
                  <div className="px-3 py-2 border-b border-border text-xs mb-1">
                    <p className="font-bold text-foreground truncate">
                      {profile?.displayName || "Customer"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] bg-brand-blue/15 text-brand-blue font-bold px-2 py-0.5 rounded-full">
                        Administrator
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/dashboard"
                        className="cursor-pointer text-xs font-bold text-brand-red flex items-center gap-2 py-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link
                      href="/order-tracking"
                      className="cursor-pointer text-xs flex items-center gap-2 py-2 text-foreground"
                    >
                      <Package className="h-4 w-4" />
                      Track My Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-xs text-brand-red flex items-center gap-2 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="h-9 px-3.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-brand-red"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              className="md:hidden h-9 w-9 p-0 bg-card text-foreground border border-border rounded-full hover:bg-muted"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* ── Mobile Dropdown ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border py-3 space-y-1"
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-brand-red/10 text-brand-red border border-brand-red/20"
                        : "text-foreground hover:text-brand-red hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-brand-red bg-brand-red/10 border border-brand-red/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}

              {!user && (
                <div className="pt-2 px-3 pb-1">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold rounded-xl text-sm py-2.5">
                      Sign In / Register
                    </Button>
                  </Link>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
