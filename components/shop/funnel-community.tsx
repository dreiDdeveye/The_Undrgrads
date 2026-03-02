"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FunnelCommunity() {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative py-20 sm:py-28">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-lg bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border/30 bg-white/5"
          >
            <img src="/logo1.png" alt="TheUndergrads" className="h-8 w-8 object-contain" />
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
            More than merch.
            <br />
            <span className="text-muted-foreground">It is a movement.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Every shirt you wear tells a story. Be part of a community that wears their pride on their sleeve — literally.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={scrollToCatalog}
              className="w-full sm:w-auto gap-2 bg-white text-black hover:bg-white/90 font-semibold px-8"
            >
              Shop the Collection
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Follow Us
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
