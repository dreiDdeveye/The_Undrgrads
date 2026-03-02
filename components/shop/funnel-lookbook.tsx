"use client"

import { motion } from "framer-motion"
import { PRODUCT_IMAGES } from "@/lib/shop-utils"

const GRID_ITEMS = [
  { image: PRODUCT_IMAGES[7], span: "col-span-2 row-span-2", label: "Street Ready" },
  { image: PRODUCT_IMAGES[8], span: "col-span-1 row-span-1", label: "Campus Fit" },
  { image: PRODUCT_IMAGES[9], span: "col-span-1 row-span-1", label: "Night Out" },
  { image: PRODUCT_IMAGES[10], span: "col-span-1 row-span-2", label: "Bold Moves" },
  { image: PRODUCT_IMAGES[11], span: "col-span-1 row-span-1", label: "Everyday" },
  { image: PRODUCT_IMAGES[0], span: "col-span-1 row-span-1", label: "Classic" },
]

export default function FunnelLookbook() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Lookbook
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Styled for Every Moment
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[260px]">
          {GRID_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-xl ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">{item.label}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
