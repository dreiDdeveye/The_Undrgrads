"use client"

import ShopHeader from "@/components/shop/shop-header"
import ShopFooter from "@/components/shop/shop-footer"
import CartDrawer from "@/components/shop/cart-drawer"
import { Toaster } from "@/components/ui/toaster"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ShopHeader />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <ShopFooter />
      <Toaster />
    </div>
  )
}
