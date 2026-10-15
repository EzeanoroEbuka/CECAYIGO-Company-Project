import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  ArrowRight,
  Sun,
  Phone,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { productService } from "@/services/productService";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  description: string;
  inStock: boolean;
  category?: string;
}

const SHOW_PRODUCT = true;

export function HeroSection() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    if (!SHOW_PRODUCT) return;
    const fetchProducts = async () => {
      try {
        const featuredProducts = await productService.getFeaturedProducts(3);
        setProducts(featuredProducts);
        if (featuredProducts.length > 0) {
          const img = new window.Image();
          img.src = featuredProducts[0].images[0];
        }
      } catch {
        setProducts([
          {
            id: "1",
            name: "Complete Solar System 5KVA",
            price: 850000,
            discountedPrice: 750000,
            images: [
              "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80&auto=format",
            ],
            description: "Complete solar package with battery & inverter",
            inStock: true,
            category: "Solar Systems",
          },
          {
            id: "2",
            name: "Solar Street Light 150W",
            price: 180000,
            discountedPrice: 165000,
            images: [
              "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80&auto=format",
            ],
            description: "High-efficiency LED solar street light",
            inStock: true,
            category: "Street Lights",
          },
          {
            id: "3",
            name: "Lithium Battery 200AH",
            price: 450000,
            images: [
              "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80&auto=format",
            ],
            description: "Long-lasting lithium battery",
            inStock: true,
            category: "Batteries",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!SHOW_PRODUCT || products.length <= 1) return;
    const nextIndex = (currentSlide + 1) % products.length;
    const img = new window.Image();
    img.src = products[nextIndex].images[0];
  }, [currentSlide, products]);

  useEffect(() => {
    if (!SHOW_PRODUCT || products.length <= 1 || !isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length, isAutoPlaying]);

  const handleShopNow = useCallback(() => {
    router.push("/products");
  }, [router]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      try {
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.discountedPrice || product.price,
          imageUrl: product.images[0],
          quantity: 1,
        });
        toast.success(`${product.name} added to cart!`);
      } catch {
        toast.error("Failed to add item to cart");
      }
    },
    [addToCart],
  );

  const nextSlide = () => {
    setCurrentSlide((p) => (p + 1) % products.length);
    setIsAutoPlaying(false);
  };
  const prevSlide = () => {
    setCurrentSlide((p) => (p - 1 + products.length) % products.length);
    setIsAutoPlaying(false);
  };
  const handleImageLoad = (productId: string) =>
    setImageLoaded((p) => ({ ...p, [productId]: true }));

  if (SHOW_PRODUCT && loading) {
    return (
      <section className="w-full min-h-[70vh] bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  const currentProduct =
    SHOW_PRODUCT && products.length > 0 ? products[currentSlide] : null;
  const discountPercent = currentProduct?.discountedPrice
    ? Math.round(
        ((currentProduct.price - currentProduct.discountedPrice) /
          currentProduct.price) *
          100,
      )
    : 0;

  return (
    <section className="relative w-full bg-background border-b border-border overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-red/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-cream/3 dark:bg-brand-blue/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
        <div
          className={`grid grid-cols-1 ${SHOW_PRODUCT ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-8 lg:gap-14 items-center`}
        >
          {/* ── Left column: Brand & messaging ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Brand header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center bg-brand-red/10 border border-brand-red/20 dark:bg-brand-red/15 dark:border-brand-red/30">
                <Sun className="h-5 w-5 text-brand-red" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-foreground leading-tight truncate">
                  CEC AYIGO AND SONS LIGHTINGS
                </h2>
                <p className="text-xs text-brand-blue font-semibold mt-0.5 truncate">
                  CAC Registered · Alaba International · Lagos
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-foreground">
                Quality Electrical,{" "}
                <span className="text-brand-red">Lighting</span> &amp;{" "}
                <span className="text-brand-blue">Solar Systems</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Inspect technical product details and live prices, watch
                certified video tutorials, and order directly with rapid Lagos
                and nationwide delivery.
              </p>
            </div>

            {/* Quick-action badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/guides"
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                  bg-brand-blue/10 border-brand-blue/25 text-brand-blue hover:bg-brand-blue/20
                  dark:bg-brand-blue/15 dark:border-brand-blue/30"
              >
                🎥 Video Guides
              </a>
              <a
                href="/feedback"
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                  bg-brand-red/10 border-brand-red/20 text-brand-red hover:bg-brand-red/20
                  dark:bg-brand-red/15 dark:border-brand-red/30"
              >
                🛡️ Complaints
              </a>
              <a
                href="/order-tracking"
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                  bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-muted/80"
              >
                📦 Track Order
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShopNow}
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-brand-red transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Browse Products &amp; Prices
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo,%20I%20want%20to%20inquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-colors
                  bg-card border border-border text-foreground hover:bg-muted"
              >
                <Phone className="h-4 w-4 text-green-500" />
                Chat on WhatsApp
              </motion.a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
              {["Trusted Customers", "Genuine Products", "Fast Delivery"].map(
                (text, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {text}
                    </span>
                  </div>
                ),
              )}
            </div>

            {/* Mobile product card */}
            {SHOW_PRODUCT && currentProduct && (
              <div className="lg:hidden mt-6">
                <ProductCard
                  product={currentProduct}
                  discountPercent={discountPercent}
                  imageLoaded={imageLoaded[currentProduct.id]}
                  onImageLoad={() => handleImageLoad(currentProduct.id)}
                  onAddToCart={() => handleAddToCart(currentProduct)}
                />
                {products.length > 1 && (
                  <CarouselIndicators
                    total={products.length}
                    current={currentSlide}
                    onChange={(index) => {
                      setCurrentSlide(index);
                      setIsAutoPlaying(false);
                    }}
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* ── Right column: Product carousel (desktop) ── */}
          {SHOW_PRODUCT && currentProduct && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative bg-card border border-border rounded-2xl shadow-card-dark p-5">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-red via-brand-blue to-brand-red" />

                {products.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9
                        bg-background/80 backdrop-blur-sm border border-border rounded-full
                        flex items-center justify-center hover:border-brand-red hover:text-brand-red
                        transition-colors shadow-sm"
                      aria-label="Previous product"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9
                        bg-background/80 backdrop-blur-sm border border-border rounded-full
                        flex items-center justify-center hover:border-brand-red hover:text-brand-red
                        transition-colors shadow-sm"
                      aria-label="Next product"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <ProductCard
                  product={currentProduct}
                  discountPercent={discountPercent}
                  imageLoaded={imageLoaded[currentProduct.id]}
                  onImageLoad={() => handleImageLoad(currentProduct.id)}
                  onAddToCart={() => handleAddToCart(currentProduct)}
                />

                {products.length > 1 && (
                  <CarouselIndicators
                    total={products.length}
                    current={currentSlide}
                    onChange={(index) => {
                      setCurrentSlide(index);
                      setIsAutoPlaying(false);
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  discountPercent: number;
  imageLoaded: boolean;
  onImageLoad: () => void;
  onAddToCart: () => void;
}

function ProductCard({
  product,
  discountPercent,
  imageLoaded,
  onImageLoad,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="space-y-4">
      {/* Image container */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div
              className={`relative w-full h-full transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain p-4"
                onLoadingComplete={onImageLoad}
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountPercent}% OFF
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border text-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
            {product.category}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground text-lg truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-brand-red">
            ₦{(product.discountedPrice || product.price).toLocaleString()}
          </span>
          {product.discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₦{product.price.toLocaleString()}
            </span>
          )}
        </div>
        <span className="inline-block text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          ✓ In Stock
        </span>
      </div>

      {/* Add to cart */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold shadow-brand-red transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

function CarouselIndicators({
  total,
  current,
  onChange,
}: CarouselIndicatorsProps) {
  return (
    <div className="flex justify-center gap-1.5 mt-4">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onChange(idx)}
          className={`h-1.5 rounded-full transition-all ${
            idx === current
              ? "bg-brand-red w-6"
              : "bg-border w-1.5 hover:bg-muted-foreground"
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
}
