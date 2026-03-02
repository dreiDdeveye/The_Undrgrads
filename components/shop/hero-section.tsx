"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Official Merch
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
          Wear the
          <br />
          <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            culture.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Premium quality apparel designed for those who carry the legacy forward.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative z-10 mt-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
