"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import ColorSwatch from "./color-swatch"
import { formatCurrency } from "@/lib/shop-utils"

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  colors: string[]
  index: number
}

export default function ProductCard({ name, price, imageUrl, colors, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link href={`/shop/product/${encodeURIComponent(name)}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border/30 bg-card transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-white/[0.02]">
          {/* Image area */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-16 w-16 rounded-xl bg-muted/50 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30">
                      <path d="M20.38 3.46 16 2 12 5.5 8 2l-4.38 1.46a1 1 0 0 0-.67.78L2 12l1 8.5a1 1 0 0 0 .86.9L8 22l4-3 4 3 4.14-.6a1 1 0 0 0 .86-.9L22 12l-.95-7.76a1 1 0 0 0-.67-.78Z" />
                      <path d="M12 5.5V22" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground/30 font-medium">{name}</p>
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight">{name}</h3>
              <p className="text-sm font-bold text-foreground/80 flex-shrink-0">
                {formatCurrency(price)}
              </p>
            </div>

            {colors.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5">
                {colors.slice(0, 6).map((c) => (
                  <ColorSwatch key={c} color={c} size="sm" />
                ))}
                {colors.length > 6 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{colors.length - 6}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
