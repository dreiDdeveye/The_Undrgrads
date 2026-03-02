"use client"

import { Wallet, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentMethodSelectorProps {
  value: "gcash" | "cod"
  onChange: (val: "gcash" | "cod") => void
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const options = [
    {
      id: "gcash" as const,
      label: "GCash / Bank Transfer",
      desc: "Send payment via GCash or bank transfer",
      icon: Wallet,
    },
    {
      id: "cod" as const,
      label: "Cash on Delivery",
      desc: "Pay when your order arrives",
      icon: Truck,
    },
  ]

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const Icon = opt.icon
        const selected = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
              selected
                ? "border-white/30 bg-white/5"
                : "border-border/30 hover:border-border/60"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                selected ? "bg-white/10" : "bg-muted/30"
              )}
            >
              <Icon className={cn("h-5 w-5", selected ? "text-white" : "text-muted-foreground")} />
            </div>
            <div className="flex-1">
              <p className={cn("text-sm font-medium", selected ? "text-foreground" : "text-muted-foreground")}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground/60">{opt.desc}</p>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                selected ? "border-white" : "border-border/40"
              )}
            >
              {selected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </button>
        )
      })}

      {value === "gcash" && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 mt-3">
          <p className="text-sm font-medium text-blue-400 mb-2">GCash Payment Instructions</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Send your payment via GCash and include your order reference number. You will receive the GCash details and order reference after placing your order.
          </p>
        </div>
      )}

      {value === "cod" && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 mt-3">
          <p className="text-sm font-medium text-green-400 mb-2">Cash on Delivery</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please prepare the exact amount upon delivery. Our courier will collect the payment when your order arrives.
          </p>
        </div>
      )}
    </div>
  )
}
