"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function FunnelHero() {
  const scrollToCarousel = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-24 overflow-hidden sm:min-h-screen">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
        >
          Official Merch
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          Wear the
          <br />
          <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            culture.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
        >
          Premium quality apparel designed for those who carry the legacy forward.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={scrollToCarousel}
        className="relative z-10 mt-16 flex flex-col items-center gap-2 text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </section>
  )
}
