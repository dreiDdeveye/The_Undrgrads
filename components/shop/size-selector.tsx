"use client"

import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: string[]
  selected: string
  onSelect: (size: string) => void
  getStock: (size: string) => number
}

export default function SizeSelector({ sizes, selected, onSelect, getStock }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const stock = getStock(size)
        const isOut = stock === 0
        const isSelected = selected === size

        return (
          <button
            key={size}
            type="button"
            disabled={isOut}
            onClick={() => onSelect(size)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              isOut && "cursor-not-allowed border-border/20 text-muted-foreground/30 line-through",
              !isOut && !isSelected && "border-border/40 text-muted-foreground hover:border-border hover:text-foreground",
              isSelected && !isOut && "border-white bg-white text-black",
            )}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
