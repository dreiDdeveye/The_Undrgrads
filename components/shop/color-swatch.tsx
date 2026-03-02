"use client"

import { cn } from "@/lib/utils"
import { getColorHex } from "@/lib/shop-utils"
import { Check } from "lucide-react"

interface ColorSwatchProps {
  color: string
  selected?: boolean
  onClick?: () => void
  size?: "sm" | "md"
}

export default function ColorSwatch({ color, selected, onClick, size = "sm" }: ColorSwatchProps) {
  const hex = getColorHex(color)
  const isLight = ["White", "Beige", "Yellow"].includes(color)
  const dims = size === "sm" ? "h-5 w-5" : "h-8 w-8"

  return (
    <button
      type="button"
      title={color}
      onClick={onClick}
      className={cn(
        "rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0",
        dims,
        selected
          ? "border-white ring-2 ring-white/20 scale-110"
          : "border-border/40 hover:border-border hover:scale-105",
      )}
      style={{ backgroundColor: hex }}
    >
      {selected && (
        <Check className={cn("h-3 w-3", isLight ? "text-black" : "text-white")} strokeWidth={3} />
      )}
    </button>
  )
}
