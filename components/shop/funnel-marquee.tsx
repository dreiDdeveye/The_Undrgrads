"use client"

import { motion } from "framer-motion"

const WORDS = [
  "Premium Quality",
  "Streetwear",
  "TheUndergrads",
  "Limited Drops",
  "Campus Culture",
  "Made to Last",
  "Statement Pieces",
  "Exclusive Merch",
  "Bold Identity",
  "Wear the Legacy",
]

export default function FunnelMarquee() {
  const repeated = [...WORDS, ...WORDS]

  return (
    <section className="relative overflow-hidden border-y border-border/20 bg-muted/10 py-5">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {repeated.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground/50"
          >
            {word}
            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/30" />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
