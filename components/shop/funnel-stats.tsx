"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Package, Palette, Users, Star } from "lucide-react"

const STATS = [
  { icon: Package, value: 1200, suffix: "+", label: "Orders Fulfilled" },
  { icon: Palette, value: 25, suffix: "+", label: "Unique Designs" },
  { icon: Users, value: 500, suffix: "+", label: "Happy Customers" },
  { icon: Star, value: 4.9, suffix: "", label: "Average Rating", decimals: 1 },
]

function AnimatedNumber({ target, decimals = 0, suffix }: { target: number; decimals?: number; suffix: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
      {suffix}
    </span>
  )
}

export default function FunnelStats() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                <AnimatedNumber target={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
