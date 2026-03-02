"use client"

import Link from "next/link"
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency, getColorHex } from "@/lib/shop-utils"

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getSubtotal } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md border-border/40 bg-background">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-20" />
            <p className="text-sm">Your cart is empty</p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border border-border/40 p-3">
                    {/* Color indicator */}
                    <div
                      className="mt-1 h-10 w-10 flex-shrink-0 rounded-md border border-border/60"
                      style={{ backgroundColor: getColorHex(item.color) }}
                    />

                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.designName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.color} / {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-md border border-border/60">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatCurrency(getSubtotal())}</span>
              </div>
              <Link href="/shop/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-white text-black hover:bg-white/90 gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
