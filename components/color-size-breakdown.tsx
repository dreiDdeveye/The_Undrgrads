"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Order {
  id?: number
  name: string
  color: string
  size: string
  design: string
}

interface ColorSizeBreakdownProps {
  orders: Order[]
}

export default function ColorSizeBreakdown({ orders }: ColorSizeBreakdownProps) {
  const [expandedColor, setExpandedColor] = useState<string | null>(null)

  // Group orders by color and size
  const colorSizeMap = new Map<string, Map<string, number>>()

  orders.forEach((order) => {
    if (!colorSizeMap.has(order.color)) {
      colorSizeMap.set(order.color, new Map())
    }
    const sizeMap = colorSizeMap.get(order.color)!
    sizeMap.set(order.size, (sizeMap.get(order.size) || 0) + 1)
  })

  const colors = Array.from(colorSizeMap.keys()).sort()

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 bg-muted border-b border-border">
        <h3 className="font-semibold text-lg">Designs Needed Per Color & Size</h3>
      </div>
      <div className="divide-y divide-border">
        {colors.map((color) => {
          const sizeMap = colorSizeMap.get(color)!
          const sizes = Array.from(sizeMap.keys()).sort()
          const isExpanded = expandedColor === color

          return (
            <div key={color}>
              <button
                onClick={() => setExpandedColor(isExpanded ? null : color)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border-2 border-border"
                    style={{
                      backgroundColor: color.toLowerCase(),
                    }}
                  />
                  <span className="font-medium">{color}</span>
                  <span className="text-sm text-muted-foreground">
                    ({sizes.reduce((sum, size) => sum + sizeMap.get(size)!, 0)} total)
                  </span>
                </div>
                <ChevronDown size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {isExpanded && (
                <div className="bg-muted/30 px-4 py-3 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <div key={size} className="p-2 bg-card border border-border rounded text-center">
                        <div className="text-sm font-medium">{size}</div>
                        <div className="text-lg font-bold text-blue-600">{sizeMap.get(size)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
