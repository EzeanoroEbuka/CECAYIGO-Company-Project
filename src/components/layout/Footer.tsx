import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  Youtube,
} from "lucide-react";

const CATEGORIES = [
  { name: "LED Floodlights & High Bay", href: "/products?category=lighting" },
  { name: "Smart WiFi Circuit Breakers", href: "/products?category=breakers" },
  { name: "Hybrid Solar Inverters", href: "/products?category=solar" },
  {
    name: "Designer Wall Sockets & Switches",
    href: "/products?category=accessories",
  },
  { name: "Pure Copper Wiring & Cables", href: "/products?category=wiring" },
];

const PLATFORM_LINKS = [
  { name: "Products & Price List", href: "/products" },
  { name: "Video Guides & Tutorials", href: "/guides" },
  { name: "File Complaint / Feedback", href: "/feedback" },
  { name: "Track Order Status", href: "/order-tracking" },
  { name: "About CeC Ayigo", href: "/about" },
  { name: "Contact & Showroom", href: "/contact" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "#",
    hoverColor: "hover:bg-blue-600",
  },
  {
    name: "Twitter / X",
    icon: Twitter,
    href: "#",
    hoverColor: "hover:bg-sky-500",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
    hoverColor: "hover:bg-pink-600",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "#",
    hoverColor: "hover:bg-brand-red",
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-cream-100 relative overflow-hidden border-t border-brand-dark-border">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-blue to-brand-red" />

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <Link href="/" className="inline-block">
              <div className="bg-white p-2.5 rounded-xl border border-white/20 shadow-sm hover:shadow-brand-blue/10 transition-shadow">
                <Image
                  src="/image/cec-logo.png"
                  alt="CeC Ayigo Logo"
                  width={160}
                  height={45}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-cream-300/70 text-xs md:text-sm leading-relaxed">
              Official platform for{" "}
              <strong className="text-cream-200">
                CeC Ayigo and Sons Lightings
              </strong>
              . CAC verified distributor of commercial LED lighting, pure sine
              inverters, smart breakers, and electrical accessories in Nigeria.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-cream-200 ${social.hoverColor} transition-all hover:scale-110`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold mb-4 text-cream-200 uppercase tracking-widest">
              Company Platform
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream-300/70 hover:text-brand-blue transition-colors flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold mb-4 text-cream-200 uppercase tracking-widest">
              Electrical Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-cream-300/70 hover:text-brand-red transition-colors flex items-center gap-1 group"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-red" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Showroom & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-3.5 text-xs sm:text-sm text-cream-300/70"
          >
            <h3 className="text-xs font-bold mb-4 text-cream-200 uppercase tracking-widest">
              Showroom & Service
            </h3>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-brand-red flex-shrink-0 mt-0.5" />
              <span>
                D442a Alaba International Market, Ojo, Lagos State, Nigeria
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
              <a
                href="tel:+2348147254399"
                className="hover:text-cream-100 transition-colors"
              >
                +234 814 725 4399 / +234 907 340 6000
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand-blue flex-shrink-0" />
              <a
                href="mailto:support@cecayigo.com"
                className="hover:text-cream-100 transition-colors"
              >
                support@cecayigo.com
              </a>
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 px-3 py-2 rounded-xl transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-300/50">
          <p>
            © {new Date().getFullYear()} CeC Ayigo and Sons Lightings. All
            rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            {[
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Safety Videos", href: "/guides" },
              { label: "Resolution Desk", href: "/feedback" },
              { label: "Order Tracking", href: "/order-tracking" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-cream-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
