import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const PRODUCTS = [
  { label: "Solar Cameras", href: "/products?category=Solar+cameras" },
  {
    label: "Solar Street Lights",
    href: "/products?category=Solar+streetlights",
  },
  { label: "Solar Floodlights", href: "/products?category=Solar+Floodlights" },
  {
    label: "Energy Storage",
    href: "/products?category=Lithium+battery%2C+lithium+tubular+battery",
  },
  {
    label: "Solar Indoor Lights",
    href: "/products?category=Solar+ceiling+lamps",
  },
  { label: "Solar Fans", href: "/products?category=Solar+fans" },
  {
    label: "Batteries & Inverters",
    href: "/products?category=Hybrid+inverters",
  },
];

const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Video Guides", href: "/guides" },
  { label: "Feedback", href: "/feedback" },
  { label: "Order Tracking", href: "/order-tracking" },
  { label: "Contact", href: "/contact" },
];

const SUPPORT = [
  { label: "FAQs", href: "/guides" },
  { label: "Warranty Policy", href: "/feedback" },
  { label: "Installation Guides", href: "/guides" },
  { label: "File a Complaint", href: "/feedback" },
  { label: "Track My Order", href: "/order-tracking" },
];

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F2440" }} className="text-white/80">
      {/* Main grid */}
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            {/* Logo on white pill */}
            <Link href="/" className="inline-block bg-white p-2 rounded-lg">
              <Image
                src="/image/cec-logo.png"
                alt="CEC Lighting"
                width={130}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-sm leading-relaxed text-white/65 max-w-xs">
              CEC Ayigo and Sons Lightings — CAC-registered distributor of solar
              systems, LED lighting, inverters and electrical accessories.
              Headquartered at Alaba International Market, Lagos.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <s.icon className="h-3.5 w-3.5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
              Products
            </p>
            <ul className="space-y-2.5">
              {PRODUCTS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
              Company
            </p>
            <ul className="space-y-2.5">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-white text-sm font-bold mb-4 uppercase tracking-wider mt-8">
              Support
            </p>
            <ul className="space-y-2.5">
              {SUPPORT.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
              Contact
            </p>
            <div className="space-y-4 text-sm text-white/65">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-cec-red flex-shrink-0 mt-0.5" />
                <span>
                  D442a Alaba International Market,
                  <br />
                  Ojo, Lagos State, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-cec-red flex-shrink-0" />
                <a
                  href="tel:+2348147254399"
                  className="hover:text-white transition-colors"
                >
                  +234 814 725 4399
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-cec-red flex-shrink-0" />
                <a
                  href="tel:+2349073406000"
                  className="hover:text-white transition-colors"
                >
                  +234 907 340 6000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cec-red flex-shrink-0" />
                <a
                  href="mailto:support@cecayigo.com"
                  className="hover:text-white transition-colors"
                >
                  support@cecayigo.com
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2348147254399"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors active:scale-95"
            >
              <Phone className="h-3.5 w-3.5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} CEC Ayigo and Sons Lightings. All
            rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <Link
              href="/feedback"
              className="hover:text-white transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="/order-tracking"
              className="hover:text-white transition-colors"
            >
              Order Tracking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
