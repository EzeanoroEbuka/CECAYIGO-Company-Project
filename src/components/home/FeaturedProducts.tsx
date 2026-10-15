import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Heart,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { productService } from "@/services/productService";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  description: string;
  rating?: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  onAddToWishlist: (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  isInWishlist: (id: string) => boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
}) => {
  const discount = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    <motion.div
      className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative bg-card border border-border rounded-2xl overflow-hidden
        shadow-card-light dark:shadow-card-dark
        hover:shadow-brand-red/10 hover:border-brand-red/25
        transition-all duration-300 h-full flex flex-col group"
      >
        {/* Image */}
        <Link href={`/products/${product.id}`} className="relative block">
          <div className="relative w-full aspect-square bg-muted">
            <Image
              src={
                product.images?.[0] ||
                "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg"
              }
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              loading="lazy"
              quality={75}
              unoptimized
            />
          </div>

          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-md shadow-md z-10">
              -{discount}%
            </div>
          )}

          <motion.button
            onClick={(e) => onAddToWishlist(product, e)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add to wishlist"
            type="button"
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist(product.id) ? "text-brand-red fill-current" : "text-muted-foreground"}`}
            />
          </motion.button>
        </Link>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
              <span className="text-xs font-semibold text-foreground">
                {product.rating?.toFixed(1) || "4.5"}
              </span>
            </div>
            {product.inStock ? (
              <span className="text-xs font-medium text-green-400">
                In Stock
              </span>
            ) : (
              <span className="text-xs font-medium text-brand-red">Out</span>
            )}
          </div>

          <Link href={`/products/${product.id}`}>
            <h3
              className="font-semibold text-xs sm:text-sm text-foreground mb-2 line-clamp-2
              hover:text-brand-red transition-colors leading-tight min-h-[32px] sm:min-h-[40px]"
            >
              {product.name}
            </h3>
          </Link>

          <div className="mb-3 mt-auto">
            {product.discountedPrice ? (
              <div>
                <div className="text-base sm:text-lg font-bold text-brand-red">
                  ₦{product.discountedPrice.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground line-through">
                  ₦{product.price.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-base sm:text-lg font-bold text-foreground">
                ₦{product.price.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={(e) => onAddToCart(product, e)}
            disabled={!product.inStock}
            type="button"
            className={`w-full py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
              product.inStock
                ? "bg-brand-red hover:bg-brand-red-dark text-white shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </span>
            <span className="sm:hidden">{product.inStock ? "Add" : "Out"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [stepPx, setStepPx] = useState(0);

  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w < 640) return 2;
    if (w < 1024) return 3;
    return 4;
  }, []);

  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featuredProducts = await productService.getFeaturedProducts(8);
        setProducts(featuredProducts);
      } catch {
        // silently fail; empty state handled below
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    setVisibleCount(getVisibleCount());
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleCount]);

  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      setStepPx(containerRef.current.offsetWidth / Math.max(visibleCount, 1));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [visibleCount, products.length]);

  useEffect(() => {
    if (isAutoPlaying && products.length > visibleCount) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = products.length - visibleCount;
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 3000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, products.length, visibleCount]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev <= 0 ? products.length - visibleCount : prev - 1,
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = products.length - visibleCount;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handleAddToCart = (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("Out of stock");
      return;
    }
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: 1,
      imageUrl: product.images?.[0] || "",
    });
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = (
    product: Product,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      toast.info("Already in wishlist");
      return;
    }
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      imageUrl: product.images?.[0] || "",
    });
    toast.success("Added to wishlist!");
  };

  const maxIndex = Math.max(0, products.length - visibleCount);
  const clampedIndex = Math.min(currentIndex, maxIndex);

  useEffect(() => {
    if (products.length <= visibleCount) {
      setIsAutoPlaying(false);
      if (currentIndex !== 0) setCurrentIndex(0);
    }
  }, [products.length, visibleCount]); // eslint-disable-line

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full mx-auto animate-spin" />
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">No products available</p>
          <Link href="/products">
            <button className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-10 w-48 h-48 bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-10 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div className="inline-flex items-center gap-2 bg-brand-red text-white px-3 py-1.5 rounded-full font-semibold text-xs mb-3 shadow-brand-red">
            <Sparkles className="h-3.5 w-3.5" />
            Featured Products
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Best Selling Products
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Premium quality products trusted by thousands of customers
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {products.length > visibleCount && (
            <>
              <button
                onClick={handlePrevious}
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-20
                  w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-lg
                  flex items-center justify-center hover:border-brand-red hover:text-brand-red
                  transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-20
                  w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-lg
                  flex items-center justify-center hover:border-brand-red hover:text-brand-red
                  transition-all"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </>
          )}

          <div
            ref={containerRef}
            className="overflow-hidden px-5 sm:px-0"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={() => setIsAutoPlaying(false)}
          >
            <motion.div
              className="flex gap-3 sm:gap-4 md:gap-6"
              animate={{
                x: products.length > visibleCount ? -clampedIndex * stepPx : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={isInWishlist}
                />
              ))}
            </motion.div>
          </div>

          {products.length > visibleCount && maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-brand-red"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <Link href="/products">
            <motion.button
              type="button"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 sm:px-8 sm:py-3 md:py-3.5 rounded-full font-semibold text-sm md:text-base shadow-brand-red transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View All Products
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
