import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Menu,
  X,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Package,
  ShoppingCart,
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

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Guides", href: "/guides" },
  { label: "Contact", href: "/contact" },
];

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
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoIdx, setLogoIdx] = useState(0);
  const logos = ["/image/cec-logo.png", "/image/logo.png", "/image/cec.png"];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-cec-gray-bd shadow-xs">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0" aria-label="CEC Lighting home">
          <Image
            src={`${logos[logoIdx]}?v=${ASSET_VERSION}`}
            alt="CEC Lighting"
            width={150}
            height={42}
            className="h-9 w-auto object-contain"
            priority
            onError={() => setLogoIdx((i) => Math.min(i + 1, logos.length - 1))}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((item) => {
            const active =
              router.pathname === item.href ||
              (item.href !== "/" && router.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "text-cec-navy font-semibold"
                    : "text-cec-gray-text hover:text-cec-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Products dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-cec-gray-text hover:text-cec-navy rounded-md transition-colors">
                Categories <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-white border-cec-gray-bd shadow-card-md rounded-xl p-1"
            >
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem key={cat.href} asChild>
                  <Link
                    href={cat.href}
                    className="text-sm text-cec-charcoal hover:text-cec-navy px-3 py-2 cursor-pointer rounded-md"
                  >
                    {cat.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex items-center justify-center h-9 w-9 rounded-md border border-cec-gray-bd text-cec-charcoal hover:bg-cec-gray-lt transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-0.5 bg-cec-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-cec-gray-bd text-sm font-medium text-cec-charcoal hover:bg-cec-gray-lt transition-colors">
                  <div className="w-5 h-5 rounded-full bg-cec-navy text-white flex items-center justify-center text-[10px] font-bold">
                    {profile?.displayName?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {profile?.displayName ?? "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-white border-cec-gray-bd shadow-card-md rounded-xl"
              >
                <div className="px-3 py-2 border-b border-cec-gray-bd text-xs">
                  <p className="font-semibold text-cec-charcoal truncate">
                    {profile?.displayName ?? "Customer"}
                  </p>
                  <p className="text-cec-gray-text truncate text-[11px]">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] bg-cec-navy/10 text-cec-navy font-bold px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/dashboard"
                      className="text-xs font-semibold text-cec-navy flex items-center gap-2 py-2 cursor-pointer px-3"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/order-tracking"
                    className="text-xs flex items-center gap-2 py-2 cursor-pointer px-3 text-cec-charcoal"
                  >
                    <Package className="h-3.5 w-3.5" /> Track My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-xs text-cec-red flex items-center gap-2 py-2 cursor-pointer px-3"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-cec-navy text-white text-sm font-semibold hover:bg-cec-navy-mid active:scale-95 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md border border-cec-gray-bd hover:bg-cec-gray-lt transition-colors"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-cec-gray-bd bg-white"
          >
            <nav className="container py-3 flex flex-col gap-0.5">
              {NAV_LINKS.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? "text-cec-navy bg-cec-navy/5" : "text-cec-charcoal hover:bg-cec-gray-lt"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-cec-gray-text uppercase tracking-widest">
                Categories
              </p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm text-cec-charcoal hover:bg-cec-gray-lt transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 px-3 py-2.5 rounded-md text-sm font-semibold text-cec-navy bg-cec-navy/5 flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 mx-0 flex items-center justify-center gap-2 py-2.5 rounded-md bg-cec-navy text-white text-sm font-semibold"
                >
                  <User className="h-4 w-4" /> Sign In / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
