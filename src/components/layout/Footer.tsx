import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const PRODUCT_LINKS = [
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

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Video Guides", href: "/guides" },
  { label: "Feedback & Complaints", href: "/feedback" },
  { label: "Track My Order", href: "/order-tracking" },
  { label: "Contact & Showroom", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 md:py-14">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-border">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/">
              <Image
                src="/image/cec-logo.png"
                alt="CEC Ayigo and Sons Lightings"
                width={140}
                height={38}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              CAC-registered distributor of solar systems, LED lighting, and
              electrical accessories. Headquartered at Alaba International
              Market, Lagos.
            </p>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
              Products
            </p>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
              Contact
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  D442a Alaba International Market, Ojo, Lagos State, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+2348147254399"
                  className="hover:text-foreground transition-colors"
                >
                  +234 814 725 4399
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:support@cecayigo.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@cecayigo.com
                </a>
              </div>
              <a
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                <Phone className="h-3.5 w-3.5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CEC Ayigo and Sons Lightings. All
            rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/feedback"
              className="hover:text-foreground transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="/order-tracking"
              className="hover:text-foreground transition-colors"
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
