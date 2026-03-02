"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { placeShopOrder } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import PaymentMethodSelector from "@/components/shop/payment-method-selector"
import OrderSummarySidebar from "@/components/shop/order-summary-sidebar"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getSubtotal } = useCartStore()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [facebook, setFacebook] = useState("")
  const [chapter, setChapter] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "cod">("gcash")
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = name.trim() && phone.trim() && address.trim() && items.length > 0

  const handlePlaceOrder = async () => {
    if (!canSubmit) return
    setSubmitting(true)

    try {
      const result = await placeShopOrder(
        {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          facebook: facebook.trim() || undefined,
          chapter: chapter.trim() || undefined,
        },
        items.map((item) => ({
          designName: item.designName,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        paymentMethod
      )

      if (result.success && result.orderRef) {
        clearCart()
        router.push(`/shop/order-confirmed?ref=${result.orderRef}`)
      } else {
        toast({ title: "Failed to place order", description: result.error, variant: "destructive" })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Something went wrong", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-8">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
        {/* Left: Form (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Customer Info */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name <span className="text-red-400">*</span></label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-background border-border/40 focus:border-border"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone Number <span className="text-red-400">*</span></label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="bg-background border-border/40 focus:border-border"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Delivery Address <span className="text-red-400">*</span></label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Barangay, City, Province"
                  rows={3}
                  className="w-full rounded-md border border-border/40 bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-border resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Facebook Name</label>
                  <Input
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Optional"
                    className="bg-background border-border/40 focus:border-border"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Chapter</label>
                  <Input
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Optional"
                    className="bg-background border-border/40 focus:border-border"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/20" />

          {/* Payment Method */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Payment Method
            </h2>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>

          {/* Place Order — mobile */}
          <div className="lg:hidden">
            <OrderSummarySidebar />
            <Button
              className="mt-4 w-full gap-2 bg-white text-black hover:bg-white/90 h-12 text-sm font-semibold"
              disabled={!canSubmit || submitting}
              onClick={handlePlaceOrder}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order...</>
              ) : (
                <><Lock className="h-4 w-4" /> Place Order</>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Summary (2 cols) — desktop */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <OrderSummarySidebar />
            <Button
              className="w-full gap-2 bg-white text-black hover:bg-white/90 h-12 text-sm font-semibold"
              disabled={!canSubmit || submitting}
              onClick={handlePlaceOrder}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order...</>
              ) : (
                <><Lock className="h-4 w-4" /> Place Order</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground/50">
              Your order information is secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
