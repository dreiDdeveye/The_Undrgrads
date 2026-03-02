"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart-store"

export default function ShopHeader() {
  const itemCount = useCartStore((s) => s.getItemCount())
  const setIsOpen = useCartStore((s) => s.setIsOpen)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="flex items-center gap-3">
          <img src="/logo1.png" alt="TheUndergrads" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold tracking-tight">TheUndergrads</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          <Link
            href="/shop"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Shop
          </Link>
        </nav>

        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
