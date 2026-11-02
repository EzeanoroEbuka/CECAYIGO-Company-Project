import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Truck,
  Headphones,
  Award,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const REASONS = [
  {
    icon: Shield,
    title: "Quality Assured",
    body: "Every product we supply is tested and verified — genuine components backed by manufacturer warranties.",
  },
  {
    icon: Award,
    title: "Smart Brands",
    body: "We partner with leading global solar and electrical brands trusted by engineers and contractors Nigeria-wide.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    body: "Same-day dispatch from our Alaba International Market showroom. Nationwide delivery in 24–72 hours.",
  },
  {
    icon: Headphones,
    title: "Tech Support",
    body: "Our in-house technical team provides pre-sale advice, installation guidance, and after-sales support.",
  },
];

const QUICK_LINKS = [
  { label: "Solar Panels", href: "/products?category=Solar+panels" },
  { label: "Hybrid Inverters", href: "/products?category=Hybrid+inverters" },
  { label: "Lithium Batteries", href: "/products?category=Lithium+battery" },
  {
    label: "Solar Street Lights",
    href: "/products?category=Solar+streetlights",
  },
  { label: "Solar Floodlights", href: "/products?category=Solar+Floodlights" },
  { label: "Solar Cameras", href: "/products?category=Solar+cameras" },
];

export function WhyChooseUs() {
  return (
    <>
      {/* ── Why Choose Section ── */}
      <section className="bg-cec-page-bg py-14 md:py-20">
        <div className="container">
          <div className="mb-10">
            <p className="label-red">Why Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cec-charcoal">
              Why Choose CEC LIGHTING?
            </h2>
            <p className="text-cec-gray-text text-sm mt-1 max-w-xl">
              From product quality to after-sale support, here's what sets us
              apart.
            </p>
          </div>

          {/* 4-column benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white border border-cec-gray-bd rounded-xl p-6 shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-cec-navy/10 flex items-center justify-center mb-4">
                  <r.icon className="h-5 w-5 text-cec-navy" />
                </div>
                <h3 className="font-semibold text-cec-charcoal mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-cec-gray-text leading-relaxed">
                  {r.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* View all button */}
          <div className="flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-cec-navy text-cec-navy bg-transparent px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-cec-navy hover:text-white active:scale-95 transition-all"
            >
              Learn More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dark navy CTA banner ── */}
      <section
        style={{ backgroundColor: "#0F2440" }}
        className="py-14 md:py-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-cec-red text-xs font-bold uppercase tracking-widest mb-3">
                Get In Touch
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Not Sure What You Need?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
                Our Lagos-based technical team can help you choose the right
                solar system, inverter, or lighting solution for your home,
                business, or construction project. Reach us via WhatsApp or
                visit the showroom.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-cec-red hover:bg-cec-red-dark text-white px-6 py-3 rounded-lg text-sm font-semibold active:scale-95 transition-all"
                >
                  Explore Our Catalogue <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/2348147254399?text=Hello%20CEC%20Lighting%2C%20I%20need%20help%20choosing%20a%20product."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>

            {/* Right: quick-link list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
                Product Categories
              </p>
              <div className="space-y-0">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between py-3 border-b border-white/10 group last:border-0"
                  >
                    <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                      {l.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyChooseUs;
