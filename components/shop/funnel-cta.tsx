"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FunnelCTA() {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative py-16 sm:py-24">
      {/* Gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-md bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-lg px-4 text-center"
      >
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Join 500+ students wearing the culture.
          <br className="hidden sm:block" />
          {" "}Find your statement piece.
        </p>

        <Button
          onClick={scrollToCatalog}
          className="mt-8 gap-2 bg-white text-black hover:bg-white/90 font-semibold"
        >
          Browse All Designs
          <ArrowDown className="h-4 w-4" />
        </Button>
      </motion.div>
    </section>
  )
}
