import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "solar-systems",
    name: "All Systems",
    count: "85+ Products",
    href: "/products?category=Solar+generators+and+solar+kits",
    img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80",
  },
  {
    id: "inverters",
    name: "Inverters",
    count: "67+ Products",
    href: "/products?category=Hybrid+inverters",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaaZXaQgKoorEknAtfj_StvZJabcfELpI-8A02De__RCuD43Z86BQA7Fr7&s=10",
  },
  {
    id: "batteries",
    name: "Batteries",
    count: "124+ Products",
    href: "/products?category=Lithium+battery%2C+lithium+tubular+battery",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8oz7Y9BPrcDD7Vylv3ZfoGlHzcss5VwssTxN1cbF4OjDTvSUS3Uf-H3g&s=10",
  },
  {
    id: "street-lights",
    name: "Street Lights",
    count: "98+ Products",
    href: "/products?category=Solar+streetlights",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzRvEIQb0Ap5-Z2CIi0L6h8rIR4OBARZ9Ccp-eoYdmA&s=10",
  },
  {
    id: "solar-cameras",
    name: "Solar Cameras",
    count: "56+ Products",
    href: "/products?category=Solar+cameras",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsqOnm2c9rFmUJrW-OsieAvJzi2XJu8E1whQuwUMgpog&s=10",
  },
  {
    id: "solar-fans",
    name: "Solar Fans",
    count: "42+ Products",
    href: "/products?category=Solar+fans",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQrjJIkmDqwVFDf2YMRoKlQG4QhzdjRfXTvI85ObWi-hrAASMKpwKL36-WP18BV084uSIWo7yQj601dn0Ws04VG112W4hcNi2pXL8vYUnzvSdBdhQn23antTQ&usqp=CAc",
  }
];

export function ShopByCategory() {
  return (
    <section className="bg-cec-page-bg py-14 md:py-20">
      <div className="container">

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="label-red">Our Products</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cec-charcoal">Shop by Category</h2>
              <p className="text-cec-gray-text text-sm mt-1">Browse our full range of solar and electrical products</p>
            </div>
            <Link href="/products"
              className="flex items-center gap-1.5 text-sm font-semibold text-cec-navy hover:underline flex-shrink-0"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 3 × 2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link href={cat.href} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-cec-gray-bd shadow-card hover:shadow-card-md transition-shadow duration-200">
                  {/* Photo */}
                  <div className="relative w-full aspect-[1/1] overflow-hidden">
                    <Image
                      src={cat.img} alt={cat.name}
                      fill sizes="(max-width:640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Info row */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-cec-charcoal">{cat.name}</p>
                      <p className="text-xs text-cec-gray-text">{cat.count}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-cec-navy opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
