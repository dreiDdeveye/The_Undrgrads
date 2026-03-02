"use client"

import { motion } from "framer-motion"
import { Shield, Droplets, Ruler } from "lucide-react"
import { PRODUCT_IMAGES } from "@/lib/shop-utils"

const FEATURES = [
  {
    icon: Shield,
    title: "Built to Last",
    description: "Heavy-weight 220GSM cotton that holds its shape wash after wash.",
  },
  {
    icon: Droplets,
    title: "Premium Prints",
    description: "DTF and silk-screen prints that won't crack, peel, or fade over time.",
  },
  {
    icon: Ruler,
    title: "True to Size",
    description: "Relaxed streetwear fit from XS to 5XL. No surprises, just comfort.",
  },
]

export default function FunnelSplitFeature() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={PRODUCT_IMAGES[6]}
                alt="Premium quality apparel"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-4 -right-4 sm:bottom-8 sm:right-8 rounded-xl border border-border/30 bg-card/90 backdrop-blur-xl p-4 shadow-2xl"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Quality</p>
              <p className="mt-1 text-2xl font-bold">220 GSM</p>
              <p className="text-xs text-muted-foreground">Premium Cotton</p>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Why Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
              Crafted with
              <br />
              <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                intention.
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
              Every piece is designed to represent more than just a shirt. It is a statement of identity, culture, and belonging.
            </p>

            <div className="mt-10 space-y-6">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <feature.icon className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
