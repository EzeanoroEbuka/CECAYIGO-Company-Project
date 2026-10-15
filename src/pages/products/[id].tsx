import React, { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Check, 
  Truck, 
  ArrowLeft, 
  Plus, 
  Minus,
  Shield,
  RefreshCw,
  Award,
  MessageCircle,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Phone,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { productService, Product, ProductReview } from "@/services/productService";

// Memoized Related Product Card
const RelatedProductCard = React.memo(({ product }: { product: Product }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="group"
  >
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border border-border h-full rounded-2xl">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images?.[0] || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            quality={75}
          />
          {product.discountedPrice && (
            <Badge className="absolute top-2 right-2 bg-brand-red text-white text-xs shadow-sm font-bold">
              SALE
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm lg:text-base mb-2 text-foreground line-clamp-2 group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.discountedPrice ? (
              <>
                <span className="text-brand-red font-bold text-sm lg:text-base">
                  ₦{product.discountedPrice.toLocaleString()}
                </span>
                <span className="text-muted-foreground line-through text-xs lg:text-sm">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-brand-red font-bold text-sm lg:text-base">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
));

RelatedProductCard.displayName = 'RelatedProductCard';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    userName: "",
    userEmail: "",
    title: "",
    comment: ""
  });
  const [hoverRating, setHoverRating] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let mounted = true;
    
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await productService.getProductById(id as string);
        
        if (!mounted) return;
        
        if (!productData) {
          toast.error('Product not found');
          router.push('/products');
          return;
        }
        
        setProduct(productData);

        // Load reviews
        const revs = await productService.getProductReviews(id as string);
        if (mounted) setReviews(revs);
        
        if (productData.category) {
          const categoryProducts = await productService.getProductsByCategory(productData.category, 4);
          if (!mounted) return;
          
          const filtered = categoryProducts
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        if (mounted) toast.error('Failed to load product details');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProduct();
    
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      quantity: quantity,
      imageUrl: product.images?.[0] || ""
    });
    
    toast.success(`${product.name} added to cart`);
  }, [product, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push("/cart");
  }, [handleAddToCart, router]);
  
  const handleAddToWishlist = useCallback(() => {
    if (!product) return;
    
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      imageUrl: product.images?.[0] || ""
    });
    
    toast.success(`${product.name} added to wishlist`);
  }, [product, addToWishlist]);

  const handleShare = useCallback(async () => {
    if (!product) return;
    
    try {
      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare()) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
        toast.success("Shared successfully");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      toast.error("Failed to share");
    }
  }, [product]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName.trim() || !reviewForm.comment.trim()) {
      toast.error("Please provide your name and a written comment.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await productService.submitProductReview(product?.id || (id as string), {
        rating: reviewForm.rating,
        userName: reviewForm.userName,
        userEmail: reviewForm.userEmail,
        title: reviewForm.title || `${reviewForm.rating}-Star Review`,
        comment: reviewForm.comment
      });

      // Optimistic update
      const newRev: ProductReview = {
        id: `rev-${Date.now()}`,
        productId: product?.id || (id as string),
        rating: reviewForm.rating,
        userName: reviewForm.userName,
        userEmail: reviewForm.userEmail,
        title: reviewForm.title || `${reviewForm.rating}-Star Review`,
        comment: reviewForm.comment,
        verified: true,
        createdAt: "Just now"
      };
      setReviews(prev => [newRev, ...prev]);

      toast.success("Thank you! Your rating and review have been published.");
      setIsReviewModalOpen(false);
      setReviewForm({
        rating: 5,
        userName: "",
        userEmail: "",
        title: "",
        comment: ""
      });
    } catch (err) {
      toast.error("Could not post review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openBulkQuoteWhatsApp = () => {
    if (!product) return;
    const msg = `Hello CeC Ayigo, I would like to request bulk contractor pricing for: ${product.name} (SKU: ${product.id}). Current Listed Price: ₦${(product.discountedPrice || product.price).toLocaleString()}. Please send wholesale terms.`;
    window.open(`https://wa.me/2348147254399?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const productImages = useMemo(() => 
    product?.images?.length ? product.images : ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
    [product]
  );
  
  const productFeatures = useMemo(() => 
    product?.features || [
      "Engineered for Nigerian Grid Conditions",
      "Robust anti-surge internal driver protection",
      "High thermal dissipation housing",
      "Official CeC Ayigo Warranty Included"
    ],
    [product]
  );

  const productSpecifications = useMemo(() => 
    product?.specifications || {
      "Brand": "CeC Ayigo",
      "Voltage Rating": "220V - 240V AC",
      "Warranty": "2 Years CeC Support",
      "Showroom Testing": "Available at Alaba International Market, Lagos"
    },
    [product]
  );

  // Compute average rating from actual reviews
  const avgRating = useMemo(() => {
    if (!reviews.length) return product?.rating || 4.8;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium text-sm">Inspecting CeC Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.name} - Pricing, Specs & Guides | CeC Ayigo</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen bg-background py-6 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-xs md:text-sm text-gray-700 hover:text-brand-red font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToWishlist}
                className="h-8 px-3 border-border bg-card text-foreground/80 hover:text-brand-red rounded-full text-xs"
              >
                <Heart className={`h-3.5 w-3.5 mr-1 ${isInWishlist(product.id) ? "fill-brand-red text-brand-red" : ""}`} />
                Wishlist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-3 border-border bg-card text-foreground/80 hover:text-brand-red rounded-full text-xs"
              >
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Main Product Showcase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
            
            {/* Left: Product Images Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-6"
                />
                {product.discountedPrice && (
                  <Badge className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-3 py-1 shadow-sm">
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-muted transition-all ${
                        selectedImage === i ? "border-brand-red ring-2 ring-brand-red/20" : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Showroom Verification Note */}
              <div className="bg-muted border border-border rounded-xl p-3.5 flex items-center gap-3 text-xs text-gray-700">
                <Shield className="h-5 w-5 text-brand-red flex-shrink-0" />
                <span>
                  <strong>100% Authentic Product:</strong> Tested and verified by CeC Ayigo technicians at Alaba International Market, Lagos.
                </span>
              </div>
            </div>

            {/* Right: Pricing, Specs & Actions */}
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className="bg-brand-blue/15 text-brand-blue-dark border-none font-semibold text-xs">
                  {product.category || "Electrical"}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">{avgRating}</span>
                  <span>({reviews.length} customer ratings)</span>
                </div>
              </div>

              {/* Title & SKU */}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Product SKU: <span className="font-mono">{product.id}</span></p>
              </div>

              {/* Price Inspection Card */}
              <div className="bg-muted border border-border p-5 rounded-2xl space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-3xl md:text-4xl font-extrabold text-brand-red">
                        ₦{product.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-lg md:text-xl text-muted-foreground line-through">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs font-semibold">
                        Save ₦{(product.price - product.discountedPrice).toLocaleString()}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl md:text-4xl font-extrabold text-brand-red">
                      ₦{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes included. Instant delivery across Lagos & interstate shipping available.
                </p>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & Order Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-border rounded-xl bg-muted">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-muted-foreground hover:text-brand-red text-sm"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 py-1.5 font-bold text-sm text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1.5 text-muted-foreground hover:text-brand-red text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="outline"
                    className="w-full py-3 border-brand-red text-brand-red hover:bg-brand-red/5 font-semibold rounded-xl text-sm"
                  >
                    Buy Now & Checkout
                  </Button>
                </div>

                {/* Bulk / Contractor Inquiries */}
                <Button
                  onClick={openBulkQuoteWhatsApp}
                  variant="ghost"
                  className="w-full py-2.5 text-xs text-gray-700 hover:text-green-700 hover:bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 text-green-600" />
                  Request Wholesale / Contractor Bulk Pricing on WhatsApp
                </Button>
              </div>

              {/* Warranty & Logistics Per-product */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted border border-border">
                  <Truck className="h-4 w-4 text-brand-blue-dark flex-shrink-0" />
                  <span>Lagos Same-Day & Interstate Dispatch</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted border border-border">
                  <Award className="h-4 w-4 text-brand-red flex-shrink-0" />
                  <span>2 Years Official Warranty</span>
                </div>
              </div>

            </div>

          </div>

          {/* Deep Inspection Tabs: Features, Specifications, HOW TO USE (Videos & Do's/Don'ts), REVIEWS */}
          <div className="mt-12">
            <Card className="border border-border bg-card shadow-sm rounded-3xl overflow-hidden">
              <Tabs defaultValue="how-to-use" className="w-full">
                
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted h-auto p-0 overflow-x-auto">
                  <TabsTrigger 
                    value="how-to-use" 
                    className="rounded-none px-6 py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-brand-red data-[state=active]:bg-background data-[state=active]:text-brand-red"
                  >
                    <Play className="h-4 w-4 mr-1.5 fill-current" />
                    How to Use (Videos & Do's / Don'ts)
                  </TabsTrigger>

                  <TabsTrigger 
                    value="reviews" 
                    className="rounded-none px-6 py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-brand-red data-[state=active]:bg-background data-[state=active]:text-brand-red"
                  >
                    <Star className="h-4 w-4 mr-1.5" />
                    Customer Ratings & Reviews ({reviews.length})
                  </TabsTrigger>

                  <TabsTrigger 
                    value="specifications" 
                    className="rounded-none px-6 py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-brand-red data-[state=active]:bg-background data-[state=active]:text-brand-red"
                  >
                    <Award className="h-4 w-4 mr-1.5" />
                    Technical Specifications
                  </TabsTrigger>

                  <TabsTrigger 
                    value="features" 
                    className="rounded-none px-6 py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-brand-red data-[state=active]:bg-background data-[state=active]:text-brand-red"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Key Features
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: HOW TO USE & VIDEOS */}
                <TabsContent value="how-to-use" className="p-6 md:p-8 space-y-8">
                  
                  {/* Video Demonstration Section */}
                  <div className="bg-brand-dark text-white rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-full md:w-80 aspect-video rounded-xl overflow-hidden bg-black/60 flex items-center justify-center flex-shrink-0 border border-white/10 group">
                        <Image
                          src={productImages[0]}
                          alt="Video Preview"
                          fill
                          className="object-cover opacity-60 group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveVideoModal(product.guide?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                          className="relative z-10 w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          aria-label="Play Tutorial Video"
                        >
                          <Play className="h-6 w-6 fill-current ml-0.5" />
                        </button>
                      </div>

                      <div className="space-y-3 flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-red/20 text-brand-red text-xs font-bold">
                          <Play className="h-3 w-3 fill-current" /> Official Installation Video
                        </div>
                        <h3 className="text-xl font-bold">
                          {product.guide?.videoTitle || `Installation & Wiring Tutorial for ${product.name}`}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                          Watch our senior technician demonstrate proper mounting, wire strip lengths, earthing verification, and how to avoid circuit overloads.
                        </p>
                        <Button
                          onClick={() => setActiveVideoModal(product.guide?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                          size="sm"
                          className="bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-xs flex items-center gap-2"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Watch Video Tutorial
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* DO's and DON'Ts side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* DO's */}
                    <div className="rounded-2xl border-2 border-green-200 bg-green-50/50 p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-green-950">HOW TO USE (Approved Do's)</h4>
                          <span className="text-xs text-green-700">Recommended for safety and full warranty</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(product.guide?.dos || [
                          { title: "Ground the Yellow/Green Earth wire firmly", description: "Diverts high-voltage surges safely into the earth." },
                          { title: "Use properly rated IP68 waterproof boxes", description: "Protects exterior wiring against moisture and tropical rainstorms." },
                          { title: "Tighten screw clamps to manufacturer torque", description: "Prevents terminal micro-arcing and overheating under continuous current." }
                        ]).map((item, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-xl border border-green-100 flex items-start gap-3 shadow-2xs">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-foreground">{item.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DONT's */}
                    <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-6 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-red-200">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                          ✕
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-red-950">WHAT NOT TO DO (Dangerous Don'ts)</h4>
                          <span className="text-xs text-red-700">Avoid hazards and warranty forfeiture</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(product.guide?.donts || [
                          { title: "NEVER cut off the ground wire", description: "Disabling grounding creates severe electrocution risks in wet conditions." },
                          { title: "DO NOT submerge non-submersible units", description: "Submerging causes driver short circuits and water seepage." },
                          { title: "DO NOT connect to small generators without AVR", description: "Unregulated voltage spikes can destroy sensitive electronic drivers." }
                        ]).map((item, idx) => (
                          <div key={idx} className="bg-white p-3.5 rounded-xl border border-red-100 flex items-start gap-3 shadow-2xs">
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-foreground">{item.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </TabsContent>

                {/* TAB 2: RATINGS & REVIEWS */}
                <TabsContent value="reviews" className="p-6 md:p-8 space-y-8">
                  
                  {/* Reviews Summary & Write Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted p-6 rounded-2xl border border-border">
                    <div className="flex items-center gap-5">
                      <div className="text-center">
                        <div className="text-4xl font-extrabold text-foreground">{avgRating}</div>
                        <div className="flex items-center text-amber-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{reviews.length} total reviews</div>
                      </div>

                      <div className="hidden sm:block h-12 w-px bg-cream-300" />

                      <div className="hidden sm:block text-xs text-muted-foreground space-y-1">
                        <div>Verified buyer opinions are screened by CeC Quality Control.</div>
                        <div>Share your installation experience to guide other electricians.</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-xs sm:text-sm px-6 py-2.5 shadow-xs"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Rate & Review Product
                    </Button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border rounded-2xl">
                        <Star className="h-8 w-8 text-cream-300 mx-auto mb-2" />
                        <h4 className="font-bold text-gray-800">No reviews yet</h4>
                        <p className="text-xs text-muted-foreground mt-1">Be the first to rate this product!</p>
                      </div>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-5 rounded-2xl border border-border bg-white space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground">{rev.userName}</span>
                              {rev.verified && (
                                <Badge className="bg-green-100 text-green-800 text-[10px] border-green-200">
                                  Verified Buyer
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{rev.createdAt}</span>
                          </div>

                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>

                          <h5 className="font-bold text-sm text-foreground">{rev.title}</h5>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                </TabsContent>

                {/* TAB 3: SPECIFICATIONS */}
                <TabsContent value="specifications" className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-brand-red" />
                    Engineering Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(productSpecifications).map(([key, val], idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-muted rounded-xl border border-border text-xs sm:text-sm">
                        <span className="font-semibold text-muted-foreground">{key}</span>
                        <span className="font-bold text-foreground text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* TAB 4: FEATURES */}
                <TabsContent value="features" className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-brand-red" />
                    Design & Performance Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 bg-muted rounded-xl border border-border">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-800 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

              </Tabs>
            </Card>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                Related CeC Ayigo Products
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <RelatedProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Review Submission Modal Dialog */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md bg-white border border-border rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Rate & Review This Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Your feedback is displayed on the product page and shared with CeC quality control.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
            
            {/* Interactive 5-Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoverRating || reviewForm.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {hoverRating || reviewForm.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
              <Input
                required
                placeholder="e.g. Engr. Chukwudi"
                value={reviewForm.userName}
                onChange={e => setReviewForm(p => ({ ...p, userName: e.target.value }))}
                className="bg-muted/50 border-border focus:border-brand-red rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline</label>
              <Input
                placeholder="e.g. Excellent brightness and durable casing"
                value={reviewForm.title}
                onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                className="bg-muted/50 border-border focus:border-brand-red rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Written Comment & Experience *</label>
              <Textarea
                required
                rows={4}
                placeholder="Share details about installation, light output, durability, or performance under Nigerian weather..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                className="bg-muted/50 border-border focus:border-brand-red rounded-xl text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {isSubmittingReview ? "Submitting Review..." : "Publish Review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
              aria-label="Close video"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={activeVideoModal}
                title="Product Tutorial Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}