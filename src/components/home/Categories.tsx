import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Lightbulb,
  Battery,
  Zap,
  Camera,
  Wind,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  lightGradient: string;
  darkGradient: string;
  count: number;
}

const CATEGORIES: Category[] = [
  {
    id: "solar",
    name: "Solar Systems",
    icon: <Sun className="h-7 w-7 text-white" />,
    lightGradient: "from-orange-500 to-yellow-500",
    darkGradient: "from-orange-600 to-yellow-600",
    count: 85,
  },
  {
    id: "batteries",
    name: "Batteries",
    icon: <Battery className="h-7 w-7 text-white" />,
    lightGradient: "from-green-500 to-emerald-500",
    darkGradient: "from-green-600 to-emerald-600",
    count: 124,
  },
  {
    id: "inverters",
    name: "Inverters",
    icon: <Zap className="h-7 w-7 text-white" />,
    lightGradient: "from-brand-blue to-sky-600",
    darkGradient: "from-brand-blue to-sky-500",
    count: 67,
  },
  {
    id: "lights",
    name: "Street Lights",
    icon: <Lightbulb className="h-7 w-7 text-white" />,
    lightGradient: "from-amber-500 to-orange-500",
    darkGradient: "from-amber-500 to-orange-600",
    count: 98,
  },
  {
    id: "cameras",
    name: "Solar Cameras",
    icon: <Camera className="h-7 w-7 text-white" />,
    lightGradient: "from-brand-red to-rose-600",
    darkGradient: "from-brand-red to-rose-500",
    count: 56,
  },
  {
    id: "fans",
    name: "Solar Fans",
    icon: <Wind className="h-7 w-7 text-white" />,
    lightGradient: "from-violet-500 to-purple-600",
    darkGradient: "from-violet-600 to-purple-700",
    count: 42,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-14 md:py-20 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-blue/5 dark:bg-brand-blue/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-brand-red/5 dark:bg-brand-red/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.div className="inline-flex items-center gap-2 bg-brand-red text-white px-4 py-1.5 rounded-full font-semibold text-sm mb-4 shadow-brand-red">
            <Sparkles className="h-4 w-4" />
            Explore Categories
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Our Solar Solutions
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            From complete solar systems to cameras and fans — everything you
            need for clean, reliable energy.
          </p>
        </motion.div>

        {/* ── Category Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group"
            >
              <Link href={`/products?category=${category.id}`}>
                <div
                  className="relative bg-card border border-border rounded-2xl p-4 sm:p-5 md:p-7
                  shadow-card-light dark:shadow-card-dark
                  hover:border-brand-red/40 dark:hover:border-brand-red/30
                  hover:shadow-brand-red/10 dark:hover:shadow-brand-red/20
                  transition-all duration-300 cursor-pointer overflow-hidden h-full"
                >
                  {/* Hover overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.darkGradient} opacity-0 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <motion.div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.darkGradient} flex items-center justify-center mb-3 md:mb-4 shadow-lg`}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  >
                    {category.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="relative">
                    <h3
                      className="font-bold text-sm md:text-base lg:text-lg text-foreground mb-1.5
                      group-hover:text-brand-red transition-colors duration-300"
                    >
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category.count}+ products
                      </span>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 4 }}
                      >
                        <ArrowRight className="h-4 w-4 text-brand-red" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/products">
            <motion.button
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 rounded-full font-semibold text-sm md:text-base shadow-brand-red transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesSection;
