"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { formatCurrency, getColorHex } from "@/lib/shop-utils"
import Link from "next/link"

interface OrderItem {
  design_name: string
  color: string
  size: string
  quantity: number
  unit_price: number
}

interface ShopOrder {
  order_ref: string
  customer_name: string
  payment_method: string
  total_amount: number
  created_at: string
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  )
}

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderRef = searchParams.get("ref") || ""

  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderRef) {
      setLoading(false)
      return
    }

    async function load() {
      const { data: orderData } = await supabase
        .from("shop_orders")
        .select("*")
        .eq("order_ref", orderRef)
        .single()

      if (orderData) {
        setOrder(orderData)
        const { data: itemData } = await supabase
          .from("shop_order_items")
          .select("*")
          .eq("shop_order_id", orderData.id)

        setItems(itemData || [])
      }
      setLoading(false)
    }
    load()
  }, [orderRef])

  const handleCopy = () => {
    navigator.clipboard.writeText(orderRef)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/shop">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Order Placed</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you, {order.customer_name}. Your order has been received.
        </p>
      </motion.div>

      {/* Order ref */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl border border-border/30 bg-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Order Reference
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-lg font-bold font-mono tracking-wider">{order.order_ref}</p>

        <Separator className="my-4 bg-border/20" />

        {/* Items */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="h-8 w-8 flex-shrink-0 rounded-md border border-border/40"
                style={{ backgroundColor: getColorHex(item.color) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.design_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.color} / {item.size} x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium flex-shrink-0">
                {formatCurrency(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-border/20" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="text-sm font-medium capitalize">{order.payment_method === "gcash" ? "GCash / Bank Transfer" : "Cash on Delivery"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{formatCurrency(order.total_amount)}</p>
          </div>
        </div>

        {order.payment_method === "gcash" && (
          <>
            <Separator className="my-4 bg-border/20" />
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-xs font-medium text-blue-400 mb-1">Next Step</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Please send your payment via GCash and include your order reference <strong className="text-foreground">{order.order_ref}</strong> as the message. Send proof of payment to our Facebook page.
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Continue shopping */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-8 text-center"
      >
        <Link href="/shop">
          <Button variant="outline" className="gap-2">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
