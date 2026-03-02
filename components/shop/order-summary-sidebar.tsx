"use client"

import { useCartStore, type CartItem } from "@/store/cart-store"
import { formatCurrency, getColorHex } from "@/lib/shop-utils"
import { Separator } from "@/components/ui/separator"

export default function OrderSummarySidebar() {
  const items = useCartStore((s) => s.items)
  const getSubtotal = useCartStore((s) => s.getSubtotal)

  return (
    <div className="rounded-xl border border-border/30 bg-card p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Order Summary
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div
              className="h-8 w-8 flex-shrink-0 rounded-md border border-border/40"
              style={{ backgroundColor: getColorHex(item.color) }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.designName}</p>
              <p className="text-xs text-muted-foreground">
                {item.color} / {item.size} x{item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium flex-shrink-0">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-4 bg-border/30" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(getSubtotal())}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated later</span>
        </div>
      </div>

      <Separator className="my-4 bg-border/30" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold">{formatCurrency(getSubtotal())}</span>
      </div>
    </div>
  )
}
