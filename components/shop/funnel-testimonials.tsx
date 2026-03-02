"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const REVIEWS = [
  {
    name: "Marcus D.",
    chapter: "UST Chapter",
    text: "The quality is insane for the price. I've washed mine 20+ times and the print still looks brand new.",
    rating: 5,
  },
  {
    name: "Anya R.",
    chapter: "PUP Chapter",
    text: "Finally, merch that actually fits well. The oversized cut is perfect. Already ordered my third one.",
    rating: 5,
  },
  {
    name: "JC Santos",
    chapter: "FEU Chapter",
    text: "Wore it to a campus event and got so many compliments. The design is clean and the fabric feels premium.",
    rating: 5,
  },
]

export default function FunnelTestimonials() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Reviews
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            What They Say
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border/30 bg-card/50 p-6 transition-colors hover:border-border/50 hover:bg-card/80"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-6 w-6 text-white/10" />

              {/* Stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-yellow-400/80 text-yellow-400/80" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.chapter}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
