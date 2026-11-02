import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Hero image — tries the real product photo first, falls back gracefully */
const HERO_IMG_CANDIDATES = [
  "/image/hero-products.png",
  "/image/cec.png",
  "/image/logo.png",
  "/image/cec-logo.png",
];

function HeroProductImage() {
  const [idx, setIdx] = React.useState(0);
  // If all candidates fail, render nothing rather than a broken image
  if (idx >= HERO_IMG_CANDIDATES.length) return null;
  return (
    <Image
      src={HERO_IMG_CANDIDATES[idx]}
      alt="CEC Lighting product range — batteries, inverter, solar panel, charge controller, LED floodlights and cables"
      width={700}
      height={480}
      className="w-full h-auto object-contain drop-shadow-xl"
      priority
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

export function HeroSection() {
  return (
    <section className="w-full" style={{ backgroundColor: "#F5EDD8" }}>
      <div className="container py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left: copy ── */}
          <div>
            <FadeUp delay={0}>
              <p className="text-cec-red text-xs font-bold uppercase tracking-widest mb-3">
                CEC Lighting — Lagos, Nigeria
              </p>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-cec-charcoal mb-5">
                Reliable Power &amp;
                <br />
                Brighter Living
              </h1>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="text-cec-gray-text text-base leading-relaxed max-w-lg mb-8">
                Nigeria's trusted distributor of solar systems, LED street
                lights, floodlights, smart inverters and energy storage —
                supplied from our Alaba International Market showroom to every
                state.
              </p>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-cec-navy hover:bg-cec-navy-mid text-white px-6 py-3 rounded-lg font-semibold text-sm active:scale-95 transition-all"
                >
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/2348147254399?text=Hello%20CEC%20Lighting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-cec-navy text-cec-navy bg-transparent hover:bg-cec-navy hover:text-white px-6 py-3 rounded-lg font-semibold text-sm active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </FadeUp>

            {/* Trust chips */}
            <FadeUp delay={0.24}>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 pt-6 border-t border-black/10">
                {[
                  "CAC Registered",
                  "Nationwide Delivery",
                  "2-Year Warranty",
                  "Alaba Int'l Market",
                ].map((t) => (
                  <span
                    key={t}
                    className="text-xs text-cec-gray-text font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cec-navy inline-block" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* ── Right: CEC product group photo ── */}
          <FadeUp delay={0.15} className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="relative w-full max-w-lg"
            >
              <HeroProductImage />
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
