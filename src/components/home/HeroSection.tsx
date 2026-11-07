import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

/* Staggered fade-up */
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

// const HERO_IMG_CANDIDATES = [
//   "/image/hero-products.png",
//   "/image/cec.png",
//   "/image/logo.png",
//   "/image/cec-logo.png",
// ];


/* Product images shown in the hero — solar-related */
const HERO_IMAGES = [
  {
    src: "/image/figma/hero-products.png",
    alt: "Solar panel system",
    },
  // {
  //   src: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&q=80",
  //   alt: "Solar inverter",
  //   className:
  //     "w-32 h-24 sm:w-40 sm:h-28 object-cover rounded-xl shadow-card-lg",
  // },
  // {
  //   src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
  //   alt: "Solar street light",
  //   className:
  //     "w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl shadow-card-lg",
  // },
  // {
  //   src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
  //   alt: "LED floodlight",
  //   className:
  //     "w-32 h-24 sm:w-40 sm:h-28 object-cover rounded-xl shadow-card-lg",
  // },
];

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

          <FadeUp
            delay={0.1}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              
                <Image
                  src={HERO_IMAGES[0].src}
                  alt={HERO_IMAGES[0].alt}
                  width={700}
                  height={480}
                  className="w-full h-auto object-contain drop-shadow-xl"
                  priority
                />
            </div>
          </FadeUp>

          <div className="lg:hidden">
            <Image
              src={HERO_IMAGES[0].src}
              alt="Solar products"
              width={600}
              height={320}
              className="w-full h-52 object-cover rounded-2xl shadow-card-lg"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
