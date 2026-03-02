"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { supabase } from "@/lib/supabase"
import { X, Palette, Ruler, ShoppingBag, Phone, MapPin, Award, Trophy, Medal } from "lucide-react"

const SEPARATOR = "|||"

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#B983FF",
  "#FF9B85",
  "#FFCD56",
  "#36A2EB",
  "#FF6384",
  "#9966FF",
]

export default function DesignDistributionChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [designDetails, setDesignDetails] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])

  // Fetch all orders grouped by design
  const fetchChartData = async () => {
    const { data, error } = await supabase.from("orders").select("*")
    if (error) {
      console.error("Error fetching chart data:", error.message)
      return
    }

    // Group by design for pie chart
    const grouped: Record<string, any[]> = {}
    data?.forEach((order) => {
      const design = order.design || "Unknown"
      if (!grouped[design]) grouped[design] = []
      grouped[design].push(order)
    })

    const formatted = Object.entries(grouped).map(([design, orders]) => ({
      name: design,
      value: orders.length,
      orders,
    }))
    setChartData(formatted)

    // Compute Top Customers (unique per name + phone + address)
    const customerTotals: Record<string, number> = {}
    data?.forEach((order) => {
      const key = `${order.name}${SEPARATOR}${order.phone || ""}${SEPARATOR}${order.address || ""}`
      if (!customerTotals[key]) customerTotals[key] = 0
      customerTotals[key]++
    })

    const topList = Object.entries(customerTotals)
      .map(([key, count]) => {
        const parts = key.split(SEPARATOR)
        return { name: parts[0], phone: parts[1], address: parts[2], count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
    setTopCustomers(topList)
  }

  // Handle click on pie slice
  const handleDesignClick = (design: string | null) => {
    if (selectedDesign === design) {
      setSelectedDesign(null)
      setDesignDetails([])
      return
    }

    const selected = chartData.find((d) => d.name === design)
    if (selected) {
      const customerSummary: Record<string, any> = {}
      selected.orders.forEach((order: any) => {
        const key = `${order.name}-${order.color}-${order.size}`
        if (!customerSummary[key]) {
          customerSummary[key] = {
            name: order.name,
            color: order.color,
            size: order.size,
            count: 0,
          }
        }
        customerSummary[key].count += 1
      })
      setDesignDetails(Object.values(customerSummary))
      setSelectedDesign(design)
    }
  }

  useEffect(() => {
    fetchChartData()

    // Real-time updates
    const channel = supabase
      .channel("chart-orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchChartData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getMedalIcon = (idx: number) => {
    if (idx === 0) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (idx === 1) return <Award className="w-5 h-5 text-gray-400" />
    return <Medal className="w-5 h-5 text-amber-600" />
  }

  return (
    <div className="mt-8 flex flex-col gap-12">
      {/* PIE CHART + DETAILS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-col md:flex-row gap-6"
      >
        <Card className="flex-1 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Design Distribution (by Orders)
          </h2>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(data) => handleDesignClick(data.name)}
                  isAnimationActive
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={selectedDesign === entry.name ? "#000" : "#fff"}
                      strokeWidth={selectedDesign === entry.name ? 3 : 1}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ color: "var(--color-foreground)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* DETAILS CARD */}
        <AnimatePresence>
          {selectedDesign && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.4 }}
              className="w-full md:w-[40%]"
            >
              <Card className="p-5 h-[400px] overflow-y-auto shadow-md border border-border">
                <h3 className="text-lg font-bold mb-3 text-foreground flex justify-between items-center">
                  <span>{selectedDesign}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setSelectedDesign(null)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </h3>

                {designDetails.length > 0 ? (
                  <div className="space-y-2">
                    {designDetails.map((cust, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: false }}
                        className="p-3 border border-border rounded-lg bg-muted/50 hover:bg-muted"
                      >
                        <p className="font-semibold text-foreground">{cust.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Palette className="w-3 h-3" /> {cust.color} -- <Ruler className="w-3 h-3" /> {cust.size}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> {cust.count} order(s)
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic mt-2">
                    No customer data for this design.
                  </p>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* TOP CUSTOMERS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, amount: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-center text-lg md:text-xl font-bold text-foreground mb-6 tracking-wide flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Top 3 Customers
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {topCustomers.slice(0, 3).map((cust, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
                },
              }}
              whileHover={{
                scale: 1.05,
                y: -6,
                boxShadow: "0 12px 25px rgba(255, 200, 0, 0.35)",
                transition: { type: "spring", stiffness: 200, damping: 12 },
              }}
              className="relative overflow-hidden p-5 bg-gradient-to-br from-yellow-950/60 to-amber-950/60 border border-yellow-800 rounded-2xl shadow transition-all duration-300"
            >
              {/* Medal icons */}
              <div className="absolute top-3 right-3">
                {getMedalIcon(idx)}
              </div>

              <p className="text-lg font-semibold text-yellow-200 mb-1">{cust.name}</p>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {cust.phone || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground truncate mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {cust.address || "N/A"}
              </p>
              <p className="mt-2 text-sm font-medium text-yellow-300 bg-yellow-900/40 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> {cust.count} total orders
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
