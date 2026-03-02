"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Phone, Globe, MapPin } from "lucide-react"

interface Order {
  id?: number
  name: string
  phone?: string
  facebook?: string
  address?: string
  color: string
  size: string
  design: string
  price?: number
  total?: number
  quantity?: number
}

interface SummaryCardsProps {
  totalTShirts: number
  orders: Order[]
  onCardClick: (type: "total" | "designs" | "customers") => void
  onDownload: (type: "total" | "byDesign" | "orders") => void
}

export default function SummaryCards({ totalTShirts, orders, onCardClick }: SummaryCardsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedCustomers, setExpandedCustomers] = useState<Record<string, boolean>>({})

  // Fix grouping to use full customer info (not just name)
  const ordersPerCustomer = orders.reduce((acc, o) => {
    const key = `${o.name}|${o.phone || ""}|${o.facebook || ""}|${o.address || ""}`
    if (!acc[key]) acc[key] = []
    acc[key].push(o)
    return acc
  }, {} as Record<string, Order[]>)

  const uniqueCustomersCount = Object.keys(ordersPerCustomer).length
  const designsPerSizeColor = new Set(orders.map((o) => `${o.color}-${o.size}`)).size

  const cardClass =
    "p-6 sm:p-8 cursor-pointer transition-all hover:shadow-lg hover:scale-105 flex flex-col justify-center items-center text-center"

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total T-Shirts */}
        <Card
          className={`${cardClass} bg-card border-border hover:bg-muted/50`}
          onClick={() => onCardClick?.("total")}
        >
          <div className="text-sm text-muted-foreground mb-2">Total T-Shirts</div>
          <div className="text-3xl font-bold text-foreground">{totalTShirts}</div>
        </Card>

        {/* Designs per Size and Color */}
        <Card
          className={`${cardClass} bg-card border-border hover:bg-muted/50`}
          onClick={() => onCardClick?.("designs")}
        >
          <div className="text-sm text-muted-foreground mb-2">Designs Per Size/Color</div>
          <div className="text-3xl font-bold text-foreground">{designsPerSizeColor}</div>
        </Card>

        {/* Total Customers */}
        <Card
          className={`${cardClass} bg-card border-border hover:bg-muted/50`}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="text-sm text-muted-foreground mb-2">Total Customers</div>
          <div className="text-3xl font-bold text-foreground">{uniqueCustomersCount}</div>
          <div className="text-xs text-muted-foreground/70 mt-2">
            Orders per Customer (avg): {(orders.length / uniqueCustomersCount || 0).toFixed(1)}
          </div>
        </Card>
      </div>

      {/* Customer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Orders</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-2 max-h-[400px] overflow-y-auto">
            {Object.entries(ordersPerCustomer).map(([key, customerOrders]) => {
              const [name, phone, facebook, address] = key.split("|")
              const isExpanded = expandedCustomers[key]

              return (
                <div
                  key={key}
                  className="border border-border rounded bg-muted/50 hover:bg-muted transition"
                >
                  {/* Header */}
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() =>
                      setExpandedCustomers((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{name}</span>
                      <span>{isExpanded ? "-" : "+"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 bg-muted rounded-md p-2 space-y-0.5">
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {phone || "No phone"}
                      </p>
                      <p className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {facebook || "No Facebook"}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {address || "No address"}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Orders */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1">
                      {customerOrders.map((order, idx) => (
                        <div key={idx} className="flex justify-between border-b py-1">
                          <span>
                            {order.design} ({order.color}-{order.size})
                          </span>
                          <span>{order.quantity || 1} pcs</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
