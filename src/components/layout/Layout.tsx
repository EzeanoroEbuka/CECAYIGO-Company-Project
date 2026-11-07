import React, { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderNotification } from "@/components/admin/OrderNotification";
import NotFound from "@/pages/404";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

/** Everything inside the providers: decides what each visitor is allowed to see. */
function AppShell({ children }: LayoutProps) {
  const router = useRouter();
  const { isAdmin, profile, loading } = useAuth();
  const isAdminPage = router.pathname.startsWith("/admin");

  // Accounts with a temporary password (e.g. the seeded admin) must choose their own first.
  const mustChangePassword = !!profile?.mustChangePassword;
  useEffect(() => {
    if (mustChangePassword && router.pathname !== "/account/security") {
      router.replace("/account/security");
    }
  }, [mustChangePassword, router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  let content: React.ReactNode = children;
  if (isAdminPage) {
    if (loading) {
      content = (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      );
    } else if (!isAdmin) {
      // Customers and guests get the ordinary "page not found" — the admin area is invisible to them.
      content = <NotFound />;
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        <main className="flex-grow">{content}</main>
        <Footer />
      </div>
      {isAdminPage && isAdmin && <OrderNotification />}
    </>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppShell>{children}</AppShell>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
