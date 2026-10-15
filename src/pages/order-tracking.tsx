import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface OrderData {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  customer?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  status: "pending" | "confirmed" | "dispatched" | "delivered";
  createdAt?: any;
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const { orderId: queryOrderId } = router.query;
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryOrderId && typeof queryOrderId === "string") {
      setSearchId(queryOrderId);
      lookupOrder(queryOrderId);
    } else if (typeof window !== "undefined") {
      // Check last order from session storage
      try {
        const last = sessionStorage.getItem("lastOrder");
        if (last) {
          const parsed = JSON.parse(last);
          if (parsed.orderId) {
            setSearchId(parsed.orderId);
            lookupOrder(parsed.orderId);
          }
        }
      } catch {}
    }
  }, [queryOrderId]);

  const lookupOrder = async (idToFind: string) => {
    const trimmed = idToFind.trim();
    if (!trimmed) {
      toast.error("Please enter an Order ID");
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);

    // 1. Try Firestore
    try {
      if (db) {
        const docSnap = await getDoc(doc(db, "orders", trimmed));
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...(docSnap.data() as any) });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Firestore lookup error:", err);
    }

    // 2. Fallback check local session storage
    if (typeof window !== "undefined") {
      try {
        const last = sessionStorage.getItem("lastOrder");
        if (last) {
          const parsed = JSON.parse(last);
          if (parsed.orderId === trimmed) {
            setOrder({
              id: trimmed,
              items: [
                { name: "CeC Pro Electrical Order", quantity: 1, price: parsed.totals?.total || 38500 }
              ],
              total: parsed.totals?.total || 38500,
              customer: {
                name: "Valued Customer",
                phone: "+234...",
                address: "Delivery in progress",
                city: "Lagos",
                state: "Lagos State"
              },
              status: "confirmed"
            });
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    // Demo lookup if user tests with DEMO-123
    if (trimmed.toUpperCase() === "DEMO" || trimmed.toUpperCase() === "DEMO-123") {
      setOrder({
        id: "DEMO-123",
        items: [
          { name: "CeC Pro Series 100W IP66 LED Floodlight", quantity: 2, price: 38500 },
          { name: "CeC Luxury Tempered Glass 13A Wall Socket", quantity: 4, price: 9800 }
        ],
        total: 116200,
        customer: {
          name: "Ifeanyi Okafor",
          phone: "+234 803 555 1234",
          address: "14 Admiralty Way, Lekki Phase 1",
          city: "Lekki",
          state: "Lagos State"
        },
        status: "dispatched"
      });
    }

    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(searchId);
  };

  const openWhatsAppOrderHelp = () => {
    const text = `Hello CeC Ayigo, I am tracking my Order ID: ${order?.id || searchId}. Please give me an update on delivery status.`;
    window.open(`https://wa.me/2348147254399?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getStatusStep = (status?: string) => {
    switch (status) {
      case "pending": return 1;
      case "confirmed": return 2;
      case "dispatched": return 3;
      case "delivered": return 4;
      default: return 2;
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order | CeC Ayigo</title>
        <meta name="description" content="Track your CeC Ayigo electrical product order dispatch and delivery status in real-time." />
      </Head>

      <div className="min-h-screen bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs md:text-sm font-semibold mb-3 border border-brand-red/20">
              <Package className="h-4 w-4" />
              Real-time Order & Delivery Lookup
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              Track Your CeC Order
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Enter your Order Reference ID from your checkout screen or WhatsApp receipt to inspect order status and dispatch details.
            </p>
          </div>

          {/* Search Box */}
          <Card className="border border-border bg-card rounded-3xl p-6 shadow-sm mb-8">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Enter Order ID (e.g. nL24k9... or DEMO-123)"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  className="pl-10 h-12 bg-muted border-cream-300 focus:border-brand-red rounded-2xl text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-8 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-2xl text-sm shadow-xs"
              >
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>
          </Card>

          {/* Order Details Display */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border border-border bg-card rounded-3xl p-6 md:p-8 shadow-sm">
                
                {/* Header status line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Reference</span>
                    <h2 className="text-2xl font-bold font-mono text-foreground">{order.id}</h2>
                  </div>
                  <Badge className="bg-brand-blue/15 text-brand-blue border-none font-bold text-sm px-3.5 py-1.5 self-start sm:self-auto uppercase">
                    Status: {order.status || "CONFIRMED"}
                  </Badge>
                </div>

                {/* Progress Steps */}
                <div className="py-8">
                  <div className="grid grid-cols-4 gap-2 text-center relative">
                    {[
                      { step: 1, label: "Received", icon: Clock },
                      { step: 2, label: "Confirmed", icon: CheckCircle2 },
                      { step: 3, label: "Dispatched", icon: Truck },
                      { step: 4, label: "Delivered", icon: Package }
                    ].map((s) => {
                      const currentStep = getStatusStep(order.status);
                      const isComplete = currentStep >= s.step;
                      return (
                        <div key={s.step} className="space-y-2">
                          <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full flex items-center justify-center transition-all ${
                            isComplete 
                              ? "bg-brand-red text-white shadow-xs" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            <s.icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs md:text-sm font-bold block ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  
                  {/* Item List */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-3">Order Items</h3>
                    <div className="space-y-2.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-xl border border-border text-xs sm:text-sm">
                          <div>
                            <span className="font-semibold text-foreground">{item.name}</span>
                            <span className="text-muted-foreground block text-xs">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-bold text-brand-red">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-3 font-bold text-sm text-foreground border-t border-cream-300">
                        <span>Total Paid / Payable:</span>
                        <span className="text-brand-red text-base">₦{order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location & Direct Escalation */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground mb-3">Delivery Information</h3>
                    <div className="p-4 bg-muted rounded-xl border border-border space-y-2 text-xs sm:text-sm text-foreground/80">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-brand-red flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{order.customer?.name || "Customer"}</strong>
                          <div className="text-muted-foreground">{order.customer?.address || "Address provided during checkout"}</div>
                          <div className="text-muted-foreground">{order.customer?.city}, {order.customer?.state}</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={openWhatsAppOrderHelp}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Contact Dispatch via WhatsApp
                    </Button>
                  </div>

                </div>

              </Card>
            </motion.div>
          )}

          {searched && !order && !loading && (
            <Card className="border border-border bg-card rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Order Reference Not Found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                We could not locate an active order with ID <strong>"{searchId}"</strong>. If you placed your order via WhatsApp, please message us directly with your phone number.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={openWhatsAppOrderHelp}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl px-5 py-2.5"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  Ask Dispatch on WhatsApp
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="border-cream-300 text-foreground rounded-xl text-xs font-semibold px-5 py-2.5">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </Card>
          )}

        </div>
      </div>
    </>
  );
}
