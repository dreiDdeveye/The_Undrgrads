"use client"

import { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Minus, Package, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import {
  BASE_SIZES,
  ALL_SIZES,
  EXTENDED_SIZE_COLORS,
  LOW_STOCK_THRESHOLD,
  getAvailableSizes,
} from "@/lib/constants"

export interface StockItem {
  id: number
  color: string
  size: string
  quantity: number
  created_at: string
  updated_at: string
}

interface StockManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  colors: string[]
  stocks: StockItem[]
  onStockUpdate: () => void
}

export default function StockManagementDialog({
  open,
  onOpenChange,
  colors,
  stocks,
  onStockUpdate,
}: StockManagementDialogProps) {
  const [addColor, setAddColor] = useState("")
  const [addSize, setAddSize] = useState("")
  const [addQty, setAddQty] = useState("")
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [updatingCells, setUpdatingCells] = useState<Set<string>>(new Set())
  const updatingCellsRef = useRef(new Set<string>())

  // Build a lookup map: "color|size" -> quantity
  const stockMap = useMemo(() => {
    const map = new Map<string, number>()
    stocks.forEach((s) => map.set(`${s.color}|${s.size}`, s.quantity))
    return map
  }, [stocks])

  const getStockQty = (color: string, size: string): number => {
    return stockMap.get(`${color}|${size}`) || 0
  }

  const getLatestStockQty = async (color: string, size: string): Promise<number> => {
    const { data, error } = await supabase
      .from("stocks")
      .select("quantity")
      .eq("color", color)
      .eq("size", size)
      .maybeSingle()

    if (error) {
      toast({ title: "Error reading stock", description: error.message, variant: "destructive" })
      return getStockQty(color, size)
    }

    return data?.quantity || 0
  }

  const runCellUpdate = async (color: string, size: string, update: () => Promise<void>) => {
    const key = `${color}|${size}`
    if (updatingCellsRef.current.has(key)) return

    updatingCellsRef.current.add(key)
    setUpdatingCells(new Set(updatingCellsRef.current))

    try {
      await update()
    } finally {
      updatingCellsRef.current.delete(key)
      setUpdatingCells(new Set(updatingCellsRef.current))
    }
  }

  const handleUpsertStock = async (color: string, size: string, quantity: number) => {
    if (quantity < 0) quantity = 0

    const { error } = await supabase
      .from("stocks")
      .upsert({ color, size, quantity }, { onConflict: "color,size" })

    if (error) {
      toast({ title: "Error updating stock", description: error.message, variant: "destructive" })
      return
    }

    onStockUpdate()
  }

  const handleIncrement = async (color: string, size: string) => {
    await runCellUpdate(color, size, async () => {
      const currentQty = await getLatestStockQty(color, size)
      await handleUpsertStock(color, size, currentQty + 1)
    })
  }

  const handleDecrement = async (color: string, size: string) => {
    await runCellUpdate(color, size, async () => {
      const currentQty = await getLatestStockQty(color, size)
      if (currentQty <= 0) return
      await handleUpsertStock(color, size, currentQty - 1)
    })
  }

  const handleCellClick = (color: string, size: string) => {
    const key = `${color}|${size}`
    setEditingCell(key)
    setEditValue(getStockQty(color, size).toString())
  }

  const handleCellSave = async (color: string, size: string) => {
    const qty = parseInt(editValue) || 0
    await handleUpsertStock(color, size, qty)
    setEditingCell(null)
    setEditValue("")
  }

  const handleAddStock = async () => {
    if (!addColor || !addSize) {
      toast({ title: "Please select a color and size", variant: "destructive" })
      return
    }
    const qty = parseInt(addQty) || 0
    if (qty <= 0) {
      toast({ title: "Please enter a valid quantity", variant: "destructive" })
      return
    }

    const currentQty = await getLatestStockQty(addColor, addSize)
    await handleUpsertStock(addColor, addSize, currentQty + qty)

    toast({ title: `Added ${qty} to ${addColor} - ${addSize}` })
    setAddQty("")
  }

  // Summary stats
  const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0)
  const outOfStockCount = colors.reduce((count, color) => {
    const sizes = getAvailableSizes(color)
    return count + sizes.filter((size) => getStockQty(color, size) === 0).length
  }, 0)
  const lowStockCount = colors.reduce((count, color) => {
    const sizes = getAvailableSizes(color)
    return (
      count +
      sizes.filter((size) => {
        const qty = getStockQty(color, size)
        return qty > 0 && qty <= LOW_STOCK_THRESHOLD
      }).length
    )
  }, 0)

  // Available sizes for the add-stock form
  const addFormSizes = addColor ? getAvailableSizes(addColor) : ALL_SIZES

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card text-card-foreground rounded-lg p-4 sm:p-6 max-w-5xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5" /> Stock Management
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Add Stock Form */}
        <div className="bg-blue-950/40 border border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-300 mb-3">Add Stock</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-end">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium mb-1">Color</label>
              <select
                value={addColor}
                onChange={(e) => {
                  setAddColor(e.target.value)
                  setAddSize("")
                }}
                className="w-full px-2 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
              >
                <option value="">Select color</option>
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-medium mb-1">Size</label>
              <select
                value={addSize}
                onChange={(e) => setAddSize(e.target.value)}
                className="w-full px-2 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
              >
                <option value="">Select size</option>
                {addFormSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-medium mb-1">Quantity</label>
              <Input
                type="number"
                min="1"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                placeholder="Qty"
                className="text-xs sm:text-sm"
              />
            </div>
            <Button
              onClick={handleAddStock}
              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Stock Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-border font-semibold text-muted-foreground sticky left-0 bg-card min-w-[100px]">
                  Color
                </th>
                {ALL_SIZES.map((size) => (
                  <th
                    key={size}
                    className="p-2 border-b border-border font-semibold text-muted-foreground text-center min-w-[70px]"
                  >
                    {size}
                  </th>
                ))}
                <th className="p-2 border-b border-border font-semibold text-muted-foreground text-center min-w-[70px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => {
                const availSizes = getAvailableSizes(color)
                const colorTotal = availSizes.reduce(
                  (sum, size) => sum + getStockQty(color, size),
                  0
                )

                return (
                  <tr key={color} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-2 font-medium sticky left-0 bg-card">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-border"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "white"
                                ? "#ffffff"
                                : color.toLowerCase(),
                          }}
                        />
                        {color}
                      </div>
                    </td>
                    {ALL_SIZES.map((size) => {
                      const isAvailable = availSizes.includes(size)
                      if (!isAvailable) {
                        return (
                          <td key={size} className="p-1 text-center">
                            <div className="p-2 rounded bg-muted/20 text-muted-foreground/30">
                              —
                            </div>
                          </td>
                        )
                      }

                      const qty = getStockQty(color, size)
                      const cellKey = `${color}|${size}`
                      const isEditing = editingCell === cellKey
                      const isUpdating = updatingCells.has(cellKey)

                      let cellClass = "bg-green-900/30 border-green-800 text-green-400"
                      if (qty === 0)
                        cellClass = "bg-red-900/30 border-red-800 text-red-400"
                      else if (qty <= LOW_STOCK_THRESHOLD)
                        cellClass = "bg-yellow-900/30 border-yellow-800 text-yellow-400"

                      return (
                        <td key={size} className="p-1 text-center">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min="0"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleCellSave(color, size)
                                  if (e.key === "Escape") setEditingCell(null)
                                }}
                                onBlur={() => handleCellSave(color, size)}
                                className="w-16 h-8 text-xs text-center p-1"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div
                              className={`p-2 rounded border cursor-pointer transition-colors ${cellClass}`}
                              onClick={() => handleCellClick(color, size)}
                              title="Click to edit"
                            >
                              <div className="text-base font-bold">{qty}</div>
                              <div className="flex gap-1 justify-center mt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDecrement(color, size)
                                  }}
                                  disabled={isUpdating}
                                  className="w-5 h-5 rounded bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Minus size={10} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleIncrement(color, size)
                                  }}
                                  disabled={isUpdating}
                                  className="w-5 h-5 rounded bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="p-2 text-center font-bold">{colorTotal}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-muted-foreground">Total Stock:</span>
            <span className="font-bold">{totalStock}</span>
          </div>
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 bg-red-900/30 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400">Out of Stock:</span>
              <span className="font-bold text-red-400">{outOfStockCount}</span>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 bg-yellow-900/30 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Low Stock:</span>
              <span className="font-bold text-yellow-400">{lowStockCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
