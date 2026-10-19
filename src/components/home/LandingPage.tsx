import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  Globe,
  Zap,
  Sun,
  Shield,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Fade-up wrapper — used by every section
   ───────────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
              CAC Registered · Lagos, Nigeria
            </p>
          </FadeUp>

          {/* Headline */}
          <FadeUp delay={0.05}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
              Nigeria's trusted<br />
              solar &amp; lighting<br />
              distributor
            </h1>
          </FadeUp>

          {/* Sub-copy */}
          <FadeUp delay={0.1}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              CEC Ayigo and Sons Lightings supplies commercial LED lighting,
              solar systems, smart inverters, and electrical accessories to
              contractors, businesses, and homeowners across Nigeria.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.15}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="btn-primary"
              >
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo,%20I%20have%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Phone className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </FadeUp>

          {/* Trust chips */}
          <FadeUp delay={0.2}>
            <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-border">
              {[
                "CAC Verified Business",
                "Alaba International Market",
                "Nationwide Delivery",
                "2-Year Warranty",
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   2. ABOUT — who we are
   ───────────────────────────────────────────── */
export function AboutSection() {
  const pillars = [
    {
      icon: Sun,
      title: "Solar Energy Systems",
      body: "From 0.5 KVA home backup to 100 KVA commercial installations — we supply and support complete hybrid solar solutions.",
    },
    {
      icon: Zap,
      title: "Commercial LED Lighting",
      body: "High-lumen, IP66-rated floodlights, street lights, and industrial bay fixtures engineered for Nigerian weather conditions.",
    },
    {
      icon: Shield,
      title: "Electrical Accessories",
      body: "Smart Wi-Fi breakers, surge protectors, pure-copper cables, and designer wall fittings — all CAC-verified.",
    },
  ];

  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-20">
        {/* Section label */}
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
            About CEC Ayigo
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 max-w-xl">
            Powering Nigeria with clean, reliable energy
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-12">
            Founded and based at Alaba International Market in Lagos — the
            largest electronics market in West Africa — CEC Ayigo and Sons
            Lightings has grown from a single showroom into a nationally
            recognised distributor of solar and electrical products. We combine
            deep technical expertise with hands-on customer support to help
            contractors, estates, businesses, and families achieve energy
            independence.
          </p>
        </FadeUp>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.08}>
              <div className="clean-card p-6 h-full">
                <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center mb-4">
                  <p.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   3. GROWTH JOURNEY — timeline
   ───────────────────────────────────────────── */
export function GrowthSection() {
  const milestones = [
    {
      year: "2005",
      title: "Founded in Alaba",
      body: "Started as a small electrical accessories stall at Alaba International Market, Lagos.",
    },
    {
      year: "2010",
      title: "Solar Product Line",
      body: "Expanded into solar panels and battery storage, serving early adopters across Lagos State.",
    },
    {
      year: "2015",
      title: "Commercial Contracts",
      body: "Secured first large-scale contracts supplying LED street lights to state government road projects.",
    },
    {
      year: "2019",
      title: "CAC Incorporation",
      body: "Formally incorporated as CEC Ayigo and Sons Lightings Ltd under the Corporate Affairs Commission.",
    },
    {
      year: "2022",
      title: "Nationwide Distribution",
      body: "Expanded delivery network to cover all 36 states, partnering with logistics firms for interstate orders.",
    },
    {
      year: "2024",
      title: "Digital Platform Launch",
      body: "Launched this official company platform for live pricing, order tracking, and technical guides.",
    },
  ];

  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-20">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
            Our Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 max-w-xl">
            Nearly two decades of growth
          </h2>
        </FadeUp>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div className="hidden md:block absolute left-[3.25rem] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <FadeUp key={m.year} delay={i * 0.06}>
                <div className="flex gap-6 md:gap-8 pb-8 last:pb-0">
                  {/* Year badge */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-16 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{m.year}</span>
                    </div>
                    {/* Dot on timeline */}
                    <div className="hidden md:block mt-1 w-2 h-2 rounded-full bg-primary mt-2" />
                  </div>
                  {/* Content */}
                  <div className="pt-0.5 pb-4 border-b border-border last:border-0 flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4. STATS
   ───────────────────────────────────────────── */
export function StatsSection() {
  const stats = [
    { icon: Calendar,   value: "19+",    label: "Years in business" },
    { icon: Users,      value: "5,000+", label: "Customers served" },
    { icon: Globe,      value: "36",     label: "States reached" },
    { icon: TrendingUp, value: "₦2B+",   label: "Products distributed" },
  ];

  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-20">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
            Our Reach
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 max-w-xl">
            Numbers that reflect our presence
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.06}>
              <div className="bg-background p-6 md:p-8 flex flex-col gap-2">
                <s.icon className="h-5 w-5 text-primary" />
                <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5. PRESENCE / REACH
   ───────────────────────────────────────────── */
export function PresenceSection() {
  const regions = [
    { name: "Lagos (HQ)", note: "Alaba International Market showroom" },
    { name: "South-West",  note: "Oyo, Ogun, Osun, Ondo, Ekiti" },
    { name: "South-South", note: "Rivers, Delta, Edo, Akwa Ibom, Cross River, Bayelsa" },
    { name: "South-East",  note: "Anambra, Imo, Enugu, Abia, Ebonyi" },
    { name: "North-West",  note: "Kano, Kaduna, Sokoto, Katsina, Kebbi, Zamfara, Jigawa" },
    { name: "North-Central", note: "Abuja (FCT), Niger, Kwara, Plateau, Benue, Kogi, Nasarawa" },
    { name: "North-East",  note: "Borno, Adamawa, Gombe, Bauchi, Taraba, Yobe" },
  ];

  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <FadeUp>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
                Where We Operate
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Nationwide presence,<br />Lagos headquarters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our showroom and service desk are located at Alaba International
                Market — the hub of electronics trade in West Africa. From there
                we ship to every corner of Nigeria, typically within 24–72 hours
                depending on the destination.
              </p>
            </FadeUp>

            {/* Showroom card */}
            <FadeUp delay={0.05}>
              <div className="clean-card p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Showroom Address</p>
                    <p className="text-sm text-muted-foreground">
                      D442a Alaba International Market,<br />
                      Ojo, Lagos State, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-border pt-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Call or WhatsApp</p>
                    <a
                      href="tel:+2348147254399"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +234 814 725 4399 &nbsp;/&nbsp; +234 907 340 6000
                    </a>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right — region list */}
          <div>
            <FadeUp delay={0.05}>
              <p className="text-sm font-semibold text-foreground mb-4">
                Regions we serve
              </p>
            </FadeUp>
            <div className="space-y-0">
              {regions.map((r, i) => (
                <FadeUp key={r.name} delay={0.04 + i * 0.04}>
                  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6. CLOSING CTA STRIP
   ───────────────────────────────────────────── */
export function CtaSection() {
  return (
    <section>
      <div className="container py-16 md:py-20">
        <FadeUp>
          <div className="clean-card p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                Browse our full product catalogue with live pricing, or reach
                our Lagos showroom team directly on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/products" className="btn-primary">
                View Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/2348147254399?text=Hello%20CeC%20Ayigo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Phone className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
