import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  CheckCircle2, 
  XCircle,
  Zap, 
  ArrowRight, 
  BookOpen,
  Loader2,
  VideoIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guideService, AdminGuideItem } from "@/services/guideService";

export default function GuidesAndVideosPage() {
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  useEffect(() => {
    guideService.getAllGuides().then((data) => {
      setGuides(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "All Guides" },
    { id: "lighting", label: "LED & Floodlights" },
    { id: "breakers", label: "Smart Breakers & DB" },
    { id: "solar", label: "Solar Inverters" },
    { id: "wiring", label: "Wiring & Cables" },
    { id: "general", label: "General Safety" },
  ];

  const filteredGuides = selectedCategory === "all" 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Product Usage Guides, Videos & Safety Hub | CeC Ayigo</title>
        <meta 
          name="description" 
          content="Watch official CeC Ayigo video guides, learn installation procedures, and review visual Do's and Don'ts to operate electrical products safely and effectively." 
        />
      </Head>

      <div className="min-h-screen bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/15 text-brand-blue-dark text-brand-blue text-xs md:text-sm font-bold mb-3 border border-brand-blue/30">
              <BookOpen className="h-4 w-4" />
              CeC Technical Knowledge & Video Hub
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              How to Use & Not Use Our Products
            </h1>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              Electrical safety and optimal product longevity start with proper installation. Watch step-by-step video demonstrations and review our certified <strong>Do&apos;s &amp; Don&apos;ts</strong> to avoid common installation hazards.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-5 text-xs sm:text-sm transition-all ${
                  selectedCategory === cat.id 
                    ? "bg-brand-red hover:bg-brand-red-dark text-white shadow-xs" 
                    : "bg-card border-border text-foreground/80 hover:bg-cream-50"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 text-brand-red animate-spin" />
              <p className="text-muted-foreground text-sm">Loading video guides...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredGuides.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-cream-200  flex items-center justify-center">
                <VideoIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground/80">No guides available yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {selectedCategory !== "all" 
                  ? "No guides found for this category. Try another filter."
                  : "The admin has not added any video guides yet. Check back soon."}
              </p>
              {selectedCategory !== "all" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="rounded-full text-xs"
                >
                  View All Guides
                </Button>
              )}
            </div>
          )}

          {/* Guide Articles Grid */}
          {!loading && filteredGuides.length > 0 && (
            <div className="space-y-12">
              {filteredGuides.map((guide) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-border bg-card rounded-2xl shadow-md overflow-hidden">
                    
                    {/* Guide Top Header */}
                    <CardHeader className="bg-cream-50  border-b border-border p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-brand-blue/20 text-brand-blue-dark text-brand-blue hover:bg-brand-blue/30 border-none font-semibold text-xs">
                              {guide.category.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                              <Zap className="h-3.5 w-3.5 text-brand-red" /> Verified Engineering Guide
                            </span>
                          </div>
                          <CardTitle className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                            {guide.title}
                          </CardTitle>
                          {guide.productName && (
                            <CardDescription className="text-muted-foreground text-sm mt-1">
                              Companion guidance for: <strong className="text-foreground">{guide.productName}</strong>
                            </CardDescription>
                          )}
                          {guide.summary && (
                            <p className="text-xs text-muted-foreground mt-2 max-w-2xl">{guide.summary}</p>
                          )}
                        </div>

                        {guide.productId && (
                          <div className="flex items-center gap-3">
                            <Link href={`/products/${guide.productId}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold"
                              >
                                Inspect Product & Pricing
                                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8 space-y-8">
                      
                      {/* Video Walkthrough Player Card */}
                      <div className="bg-brand-dark text-white rounded-2xl p-5 md:p-6 shadow-sm overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          
                          {/* Video Thumbnail */}
                          <div className="relative w-full md:w-80 aspect-video rounded-xl overflow-hidden bg-black/60 flex items-center justify-center flex-shrink-0 border border-white/10 group">
                            {guide.dos[0]?.imgUrl ? (
                              <Image
                                src={guide.dos[0].imgUrl}
                                alt={guide.videoTitle}
                                fill
                                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-gray-900" />
                            )}
                            <button
                              type="button"
                              onClick={() => setActiveVideoModal(guide.videoEmbedUrl)}
                              className="relative z-10 w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                              aria-label="Play Tutorial Video"
                            >
                              <Play className="h-6 w-6 fill-current ml-0.5" />
                            </button>
                            {guide.duration && (
                              <span className="absolute bottom-2 right-2 bg-black/80 text-[11px] font-mono font-semibold px-2 py-0.5 rounded text-white">
                                {guide.duration}
                              </span>
                            )}
                          </div>

                          {/* Video Description */}
                          <div className="space-y-3 flex-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-red/20 text-brand-red text-xs font-bold">
                              <Play className="h-3 w-3 fill-current" /> Official Video Demonstration
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-white">
                              {guide.videoTitle}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                              Watch this video tutorial showing real-world connection points, proper technique, and how to verify safety before energizing.
                            </p>
                            <Button
                              onClick={() => setActiveVideoModal(guide.videoEmbedUrl)}
                              size="sm"
                              className="bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-xs flex items-center gap-2"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              Watch Video Tutorial Now
                            </Button>
                          </div>

                        </div>
                      </div>

                      {/* Side-by-Side: HOW TO USE (Do's) vs HOW NOT TO USE (Don'ts) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* DO's */}
                        {guide.dos && guide.dos.length > 0 && (
                          <div className="rounded-2xl border-2 border-green-200 border-green-900/30 bg-green-50/50  p-5 md:p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-green-200 border-green-900/30">
                              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                                ✓
                              </div>
                              <div>
                                <h3 className="text-base md:text-lg font-bold text-green-950 text-green-100">
                                  HOW TO USE (Approved Do&apos;s)
                                </h3>
                                <span className="text-xs text-green-800 text-green-300">Follow these practices for full warranty coverage</span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {guide.dos.map((d, i) => (
                                <div key={i} className="flex items-start gap-3 bg-card p-3.5 rounded-xl border border-green-100 border-green-900/30">
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <h4 className="text-xs sm:text-sm font-bold text-foreground">{d.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* DONT's */}
                        {guide.donts && guide.donts.length > 0 && (
                          <div className="rounded-2xl border-2 border-red-200 border-red-900/30 bg-red-50/50  p-5 md:p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-red-200 border-red-900/30">
                              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                                ✕
                              </div>
                              <div>
                                <h3 className="text-base md:text-lg font-bold text-red-950 text-red-100">
                                  WHAT NOT TO DO (Dangerous Don&apos;ts)
                                </h3>
                                <span className="text-xs text-red-800 text-red-300">Avoid these hazards to prevent shock, fires &amp; damage</span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {guide.donts.map((d, i) => (
                                <div key={i} className="flex items-start gap-3 bg-card p-3.5 rounded-xl border border-red-100 border-red-900/30">
                                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs sm:text-sm font-bold text-foreground">{d.title}</h4>
                                      {d.hazard === "critical" && (
                                        <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-[10px] font-bold border-red-200 dark:border-red-800">
                                          Hazardous
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom Help Callout */}
          <div className="mt-12 bg-card rounded-2xl p-6 md:p-8 border border-border text-center shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-2">Unsure about your installation?</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-5">
              Don&apos;t guess with high-voltage electrical circuits. Contact our certified in-house technical team or report any issues directly on our feedback portal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/feedback">
                <Button className="bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-semibold px-5">
                  File Feedback / Request Engineering Call
                </Button>
              </Link>
              <a 
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo,%20I%20have%20an%20electrical%20installation%20question."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-5">
                  Ask an Engineer on WhatsApp
                </Button>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideoModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
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
                  title="Product Tutorial"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
