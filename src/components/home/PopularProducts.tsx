import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, ArrowRight, Sparkles } from "lucide-react";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  rating?: number;
  inStock: boolean;
}

const TABS = [
  { label: "All Products",   value: "" },
  { label: "Solar Panels",   value: "Solar+panels" },
  { label: "Street Lights",  value: "Solar+streetlights" },
  { label: "Inverters",      value: "Hybrid+inverters" },
  { label: "Batteries",      value: "Lithium+battery" },
];

export function PopularProducts() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setLoading(true);
    productService.getFeaturedProducts(8)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab
    ? products.filter(p => p.category?.toLowerCase().includes(decodeURIComponent(activeTab).toLowerCase().replace(/\+/g, " ")))
    : products;

  const handleCart = (p: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!p.inStock) { toast.error("Out of stock"); return; }
    addToCart({ id: Math.random().toString(36).slice(2), productId: p.id, name: p.name, price: p.price, discountedPrice: p.discountedPrice, quantity: 1, imageUrl: p.images?.[0] ?? "" });
    toast.success("Added to cart!");
  };

  const handleWishlist = (p: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isInWishlist(p.id)) { toast.info("Already in wishlist"); return; }
    addToWishlist({ id: p.id, name: p.name, price: p.price, discountedPrice: p.discountedPrice, imageUrl: p.images?.[0] ?? "" });
    toast.success("Added to wishlist!");
  };

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="label-red">Our Selection</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cec-charcoal">Popular Products</h2>
            <p className="text-cec-gray-text text-sm mt-1">Top-rated items trusted by thousands of customers</p>
          </div>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-semibold text-cec-navy hover:underline flex-shrink-0">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTab === tab.value
                  ? "bg-cec-navy text-white border-cec-navy"
                  : "bg-white text-cec-gray-text border-cec-gray-bd hover:border-cec-navy hover:text-cec-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-cec-gray-lt animate-pulse rounded-xl h-72" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cec-gray-text mb-4">No products found in this category.</p>
            <Link href="/products" className="btn-navy">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.slice(0, 8).map((product, i) => {
              const discount = product.discountedPrice
                ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
                : 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={`/products/${product.id}`} className="group block">
                    <div className="bg-white border border-cec-gray-bd rounded-xl overflow-hidden shadow-card hover:shadow-card-md transition-shadow duration-200 flex flex-col">

                      {/* Image */}
                      <div className="relative w-full aspect-square bg-cec-gray-lt overflow-hidden">
                        <Image
                          src={product.images?.[0] ?? "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=75"}
                          alt={product.name} fill sizes="(max-width:640px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-cec-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            -{discount}%
                          </span>
                        )}
                        {/* Wishlist */}
                        <button
                          onClick={e => handleWishlist(product, e)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Add to wishlist"
                        >
                          <Heart className={`h-3.5 w-3.5 ${isInWishlist(product.id) ? "fill-cec-red text-cec-red" : "text-cec-gray-text"}`} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-3 flex flex-col flex-grow">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating ?? 4.5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          ))}
                          <span className="text-[11px] text-cec-gray-text ml-0.5">{(product.rating ?? 4.5).toFixed(1)}</span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-cec-charcoal line-clamp-2 mb-2 leading-snug flex-grow">
                          {product.name}
                        </p>

                        {/* Price */}
                        <div className="mb-3">
                          {product.discountedPrice ? (
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-sm sm:text-base text-cec-navy">₦{product.discountedPrice.toLocaleString()}</span>
                              <span className="text-xs text-cec-gray-text line-through">₦{product.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-sm sm:text-base text-cec-navy">₦{product.price.toLocaleString()}</span>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={e => handleCart(product, e)}
                            disabled={!product.inStock}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                              product.inStock
                                ? "bg-cec-navy text-white hover:bg-cec-navy-mid"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                            <span className="sm:hidden">{product.inStock ? "Add" : "Out"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularProducts;
