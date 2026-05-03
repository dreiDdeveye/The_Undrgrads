"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, FolderPlus, Folder, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { StockItem } from "@/components/stock-management-dialog"
import {
  BASE_SIZES,
  EXTENDED_SIZES,
  ALL_SIZES,
  EXTENDED_SIZE_COLORS,
  LOW_STOCK_THRESHOLD,
  getAvailableSizes,
} from "@/lib/constants"

interface AddOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddOrder: (order: any) => void
  colors?: string[]
  designs?: string[]
  stocks?: StockItem[]
  onStockUpdate?: () => void
}

export default function AddOrderDialog({
  open,
  onOpenChange,
  onAddOrder,
  colors = [],
  designs = [],
  stocks = [],
  onStockUpdate,
}: AddOrderDialogProps) {
  const [supabaseDesigns, setSupabaseDesigns] = useState<string[]>([])
  const availableDesigns = supabaseDesigns.length > 0 ? supabaseDesigns : designs
  const sortedColors = [...colors].sort((a, b) => a.localeCompare(b))

  // Batch Folder states
  const [batchFolders, setBatchFolders] = useState<string[]>([])
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    facebook: "",
    chapter: "",
    address: "",
    batch: "",
    batchFolder: "",
    design: availableDesigns[0] || "",
    color: sortedColors[0] || "",
    size: "M",
    paymentStatus: "pending",
    price: "",
  })

  const [ordersToAdd, setOrdersToAdd] = useState<any[]>([])

  const availableSizes = getAvailableSizes(formData.color)

  // Stock lookup
  const stockMap = new Map<string, number>()
  stocks.forEach((s) => stockMap.set(`${s.color}|${s.size}`, s.quantity))
  const getStockQty = (color: string, size: string): number => {
    return stockMap.get(`${color}|${size}`) || 0
  }
  const getQueuedQty = (color: string, size: string): number => {
    return ordersToAdd.filter((order) => order.color === color && order.size === size).length
  }
  const getAvailableStockQty = (color: string, size: string): number => {
    return Math.max(0, getStockQty(color, size) - getQueuedQty(color, size))
  }

  // Fetch batch folders from database
  const fetchBatchFolders = async () => {
    try {
      // Try to fetch from batch_folders table first
      const { data: folderData, error: folderError } = await supabase
        .from("batch_folders")
        .select("name")
        .order("name", { ascending: true })

      if (!folderError && folderData && folderData.length > 0) {
        setBatchFolders(folderData.map((b) => b.name))
      } else {
        // Fallback: get unique batch_folder from orders table
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("batch_folder")
          .not("batch_folder", "is", null)
          .not("batch_folder", "eq", "")

        if (!orderError && orderData) {
          const uniqueFolders = Array.from(
            new Set(orderData.map((o) => o.batch_folder).filter(Boolean))
          ).sort() as string[]
          setBatchFolders(uniqueFolders)
        }
      }
    } catch (err) {
      console.error("Error fetching batch folders:", err)
    }
  }

  // Fetch latest designs from Supabase
  useEffect(() => {
    const fetchDesigns = async () => {
      const { data, error } = await supabase
        .from("designs")
        .select("name")
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching designs:", error.message)
      } else if (data) {
        setSupabaseDesigns(data.map((d) => d.name))
      }
    }

    if (open) {
      fetchDesigns()
      fetchBatchFolders()
    }
  }, [open])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Reset all form data when dialog opens
      setFormData({
        name: "",
        phone: "",
        facebook: "",
        chapter: "",
        address: "",
        batch: "",
        batchFolder: "",
        design: availableDesigns[0] || designs[0] || "",
        color: sortedColors[0] || "",
        size: "M",
        paymentStatus: "pending",
        price: "",
      })
      setOrdersToAdd([])
      setShowNewFolderInput(false)
      setNewFolderName("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Keep formData updated if colors or designs change while dialog is open
  useEffect(() => {
    if (open && availableDesigns.length > 0) {
      setFormData((prev) => ({
        ...prev,
        color: prev.color || sortedColors[0] || "",
        design: prev.design || availableDesigns[0] || "",
      }))
    }
  }, [colors, availableDesigns, open])

  // Reset size if current size is not available for the selected color
  useEffect(() => {
    const sizes = getAvailableSizes(formData.color)
    if (!sizes.includes(formData.size)) {
      setFormData((prev) => ({ ...prev, size: "M" }))
    }
  }, [formData.color])

  // Create new batch folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Please enter a folder name", variant: "destructive" })
      return
    }

    if (batchFolders.includes(newFolderName.trim())) {
      toast({ title: "Folder already exists!", variant: "destructive" })
      return
    }

    try {
      // Try to insert into batch_folders table
      const { error } = await supabase
        .from("batch_folders")
        .insert([{ name: newFolderName.trim() }])

      if (error) {
        console.log("batch_folders table may not exist, adding locally")
      }

      // Update local state
      const newFolder = newFolderName.trim()
      setBatchFolders((prev) => [...prev, newFolder].sort())
      setFormData((prev) => ({ ...prev, batchFolder: newFolder }))
      setNewFolderName("")
      setShowNewFolderInput(false)
      toast({ title: `Folder "${newFolder}" created!` })
    } catch (err) {
      console.error("Error creating folder:", err)
      const newFolder = newFolderName.trim()
      setBatchFolders((prev) => [...prev, newFolder].sort())
      setFormData((prev) => ({ ...prev, batchFolder: newFolder }))
      setNewFolderName("")
      setShowNewFolderInput(false)
    }
  }

  const isCurrentOutOfStock = formData.color && formData.size && getAvailableStockQty(formData.color, formData.size) === 0

  const handleAddMoreOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.design || !formData.color || !formData.size) {
      alert("Please fill in all required fields")
      return
    }

    if (getAvailableStockQty(formData.color, formData.size) === 0) {
      toast({ title: `${formData.color} - ${formData.size} is out of stock`, variant: "destructive" })
      return
    }

    setOrdersToAdd([
      ...ordersToAdd,
      { ...formData, price: formData.price ? parseFloat(formData.price) : undefined },
    ])

    // Reset only order-specific fields
    setFormData({
      ...formData,
      design: availableDesigns[0] || "",
      color: sortedColors[0] || "",
      size: "M",
      paymentStatus: "pending",
      price: "",
    })
  }

  const handleSubmitAll = async () => {
    if (ordersToAdd.length === 0) {
      alert("Please add at least one order")
      return
    }

    try {
      const formattedOrders = ordersToAdd.map((order) => ({
        name: formData.name,
        phone: formData.phone,
        facebook: formData.facebook,
        chapter: formData.chapter,
        address: formData.address,
        batch: formData.batch || null,
        batch_folder: formData.batchFolder || null,
        design: order.design,
        color: order.color,
        size: order.size,
        note: "",
        payment_status: order.paymentStatus || "pending",
        price: order.price || 0,
        created_at: new Date(),
      }))

      const { data, error } = await supabase.from("orders").insert(formattedOrders).select()
      if (error) {
        console.error("Error saving orders:", error.message)
        alert("Failed to save orders.")
        return
      }

      console.log("Saved to Supabase:", data)

      const stockDeductions = new Map<string, { color: string; size: string; quantity: number }>()
      formattedOrders.forEach((order) => {
        const key = `${order.color}|${order.size}`
        const existing = stockDeductions.get(key)
        stockDeductions.set(key, {
          color: order.color,
          size: order.size,
          quantity: (existing?.quantity || 0) + 1,
        })
      })

      for (const deduction of stockDeductions.values()) {
        const { data: latestStock } = await supabase
          .from("stocks")
          .select("quantity")
          .eq("color", deduction.color)
          .eq("size", deduction.size)
          .maybeSingle()

        await supabase
          .from("stocks")
          .upsert(
            {
              color: deduction.color,
              size: deduction.size,
              quantity: Math.max(0, (latestStock?.quantity || 0) - deduction.quantity),
            },
            { onConflict: "color,size" }
          )
      }
      onStockUpdate?.()

      toast({ title: "Orders successfully saved!" })

      if (data && Array.isArray(data)) {
        data.forEach((order) => onAddOrder(order))
      }

      // Reset after saving
      setFormData({
        name: "",
        phone: "",
        facebook: "",
        chapter: "",
        address: "",
        batch: "",
        batchFolder: "",
        design: availableDesigns[0] || "",
        color: sortedColors[0] || "White",
        size: "M",
        paymentStatus: "pending",
        price: "",
      })
      setOrdersToAdd([])
      onOpenChange(false)
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("Something went wrong while saving.")
    }
  }

  const handleRemoveOrder = (index: number) => {
    setOrdersToAdd((prevOrders) => prevOrders.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card text-card-foreground rounded-lg p-4 sm:p-6 max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Add New Order</h2>
        <form onSubmit={handleAddMoreOrder} className="space-y-4 sm:space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-muted-foreground">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Customer Name *", value: "name" },
                { label: "Phone", value: "phone" },
                { label: "Facebook Name", value: "facebook" },
                { label: "Chapter", value: "chapter" },
              ].map((field) => (
                <div key={field.value}>
                  <label className="block text-xs sm:text-sm font-medium mb-1">{field.label}</label>
                  <Input
                    value={formData[field.value as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.value]: e.target.value })
                    }
                    placeholder={`Enter ${field.label.toLowerCase().replace(" *", "")}`}
                    className="text-xs sm:text-sm"
                  />
                </div>
              ))}

              {/* Batch No. (text input) */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Batch No.
                </label>
                <Input
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  placeholder="e.g. 22B, 23A"
                  className="text-xs sm:text-sm"
                />
              </div>

              {/* Batch Folder (dropdown + create) */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Batch Folder
                </label>
                {showNewFolderInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="New folder name..."
                      className="text-xs sm:text-sm flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleCreateFolder()
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 px-2"
                      onClick={handleCreateFolder}
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="px-2"
                      onClick={() => {
                        setShowNewFolderInput(false)
                        setNewFolderName("")
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={formData.batchFolder}
                      onChange={(e) => setFormData({ ...formData, batchFolder: e.target.value })}
                      className="flex-1 px-2 sm:px-3 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
                    >
                      <option value="">No Folder (Unassigned)</option>
                      {batchFolders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="px-2 gap-1"
                      onClick={() => setShowNewFolderInput(true)}
                      title="Create new folder"
                    >
                      <FolderPlus size={16} />
                    </Button>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium mb-1">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border"></div>

          {/* Order Details */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-muted-foreground">
              Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Design First */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Design *</label>
                <select
                  value={formData.design}
                  onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
                >
                  {availableDesigns.map((d, i) => (
                    <option key={`${d}-${i}`} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Second */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Color *</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
                >
                  {sortedColors.map((c, i) => (
                    <option key={`${c}-${i}`} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Third */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Size *</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
                >
                  {availableSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {!EXTENDED_SIZE_COLORS.some(
                  (c) => c.toLowerCase() === formData.color.toLowerCase()
                ) && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    3XL-5XL available on Black & White only
                  </p>
                )}
                {/* Stock indicator */}
                {formData.color && formData.size && (() => {
                  const qty = getAvailableStockQty(formData.color, formData.size)
                  if (qty === 0) return (
                    <p className="text-[10px] sm:text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle size={10} /> Out of stock
                    </p>
                  )
                  if (qty <= LOW_STOCK_THRESHOLD) return (
                    <p className="text-[10px] sm:text-xs text-yellow-400 mt-1">
                      Low stock: {qty} remaining
                    </p>
                  )
                  return (
                    <p className="text-[10px] sm:text-xs text-green-400 mt-1">
                      In stock: {qty}
                    </p>
                  )
                })()}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Payment Status *</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentStatus: e.target.value })
                  }
                  className="w-full px-2 sm:px-3 py-2 border border-input bg-background rounded-md text-xs sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="partially paid">Partially Paid</option>
                  <option value="fully paid">Fully Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Selected Batch/Folder Display */}
          {(formData.batch || formData.batchFolder) && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-3">
              <div className="flex gap-4 flex-wrap">
                {formData.batch && (
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-indigo-600">Batch No.</p>
                      <p className="text-sm font-bold text-indigo-800">{formData.batch}</p>
                    </div>
                  </div>
                )}
                {formData.batchFolder && (
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-xs text-indigo-600">Folder</p>
                      <p className="text-sm font-bold text-indigo-800">{formData.batchFolder}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders To Add */}
          {ordersToAdd.length > 0 && (
            <div className="border-t border-border pt-3 sm:pt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-muted-foreground">
                Orders to Add ({ordersToAdd.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {ordersToAdd.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 sm:p-3 rounded-md text-xs sm:text-sm"
                  >
                    <span>
                      {order.design} - {order.color} - {order.size} - {order.paymentStatus}
                      {order.price && ` - ₱${order.price}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOrder(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button
              type="submit"
              disabled={!!isCurrentOutOfStock}
              className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCurrentOutOfStock ? "Out of Stock" : "Add More Order"}
            </Button>
            {ordersToAdd.length > 0 && (
              <Button
                type="button"
                onClick={handleSubmitAll}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
              >
                Submit All ({ordersToAdd.length})
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent text-xs sm:text-sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
