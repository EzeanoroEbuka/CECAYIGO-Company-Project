import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderNotification } from "@/components/admin/OrderNotification";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {/* Root shell — uses CSS variable tokens so both modes are covered */}
            <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            {isAdminPage && <OrderNotification />}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
