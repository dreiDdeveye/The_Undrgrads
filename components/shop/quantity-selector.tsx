"use client"

import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  value: number
  max: number
  onChange: (val: number) => void
}

export default function QuantitySelector({ value, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border/40">
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex h-10 w-12 items-center justify-center text-sm font-medium border-x border-border/40">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
