"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Folder, FolderOpen, Trash2, X, Plus, Package, Inbox, User } from "lucide-react"

interface Order {
  id: number
  name: string
  phone?: string
  facebook?: string
  chapter?: string
  address?: string
  batch?: string
  batch_folder?: string
  color: string
  size: string
  design: string
  payment_status: string
  price: number
  created_at?: string
}

interface BatchOrdersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orders: Order[]
  onRefresh: () => void
}

export default function BatchOrdersDialog({
  open,
  onOpenChange,
  orders,
  onRefresh,
}: BatchOrdersDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showAddFolderForm, setShowAddFolderForm] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [folders, setFolders] = useState<string[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showCustomerOrders, setShowCustomerOrders] = useState(false)

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)

  // Fetch folders from database
  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("batch_folders")
        .select("name")
        .order("name", { ascending: true })

      if (!error && data && data.length > 0) {
        setFolders(data.map((b) => b.name))
      } else {
        const uniqueFolders = Array.from(
          new Set(orders.filter((o) => o.batch_folder).map((o) => o.batch_folder))
        ).sort() as string[]
        setFolders(uniqueFolders)
      }
    } catch (err) {
      console.error("Error fetching folders:", err)
      const uniqueFolders = Array.from(
        new Set(orders.filter((o) => o.batch_folder).map((o) => o.batch_folder))
      ).sort() as string[]
      setFolders(uniqueFolders)
    }
  }, [orders])

  useEffect(() => {
    if (open) {
      fetchFolders()
    }
  }, [open, fetchFolders])

  // Get orders in a specific folder
  const getOrdersInFolder = (folder: string) => {
    return orders.filter((o) => o.batch_folder === folder)
  }

  // Get orders without a folder
  const getOrdersWithoutFolder = () => {
    return orders.filter((o) => !o.batch_folder)
  }

  // Get all orders for a specific customer
  const getCustomerOrders = (customerName: string) => {
    return orders.filter((o) => o.name === customerName)
  }

  // Check if customer has multiple orders
  const hasMultipleOrders = (customerName: string) => {
    return orders.filter((o) => o.name === customerName).length > 1
  }

  // Handle customer name click
  const handleCustomerClick = (customerName: string) => {
    if (hasMultipleOrders(customerName)) {
      setSelectedCustomer(customerName)
      setShowCustomerOrders(true)
    }
  }

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Please enter a folder name", variant: "destructive" })
      return
    }

    if (folders.includes(newFolderName.trim())) {
      toast({ title: "Folder already exists!", variant: "destructive" })
      return
    }

    try {
      const { error } = await supabase
        .from("batch_folders")
        .insert([{ name: newFolderName.trim() }])

      if (error) {
        console.log("batch_folders table may not exist, adding locally")
      }

      toast({ title: `Folder "${newFolderName.trim()}" created successfully` })
      const newFolder = newFolderName.trim()
      setFolders((prev) => [...prev, newFolder].sort())
      setNewFolderName("")
      setShowAddFolderForm(false)
      setSelectedFolder(newFolder)
      fetchFolders()
    } catch (err: any) {
      console.error("Error creating folder:", err.message)
      const newFolder = newFolderName.trim()
      setFolders((prev) => [...prev, newFolder].sort())
      setSelectedFolder(newFolder)
      setNewFolderName("")
      setShowAddFolderForm(false)
      toast({ title: `Folder "${newFolder}" created successfully` })
    }
  }

  // Show delete confirmation
  const handleDeleteClick = (folder: string) => {
    setFolderToDelete(folder)
    setShowDeleteConfirm(true)
  }

  // Delete folder (confirmed)
  const handleDeleteFolder = async () => {
    if (!folderToDelete) return

    try {
      // Remove folder from all orders
      await supabase
        .from("orders")
        .update({ batch_folder: null })
        .eq("batch_folder", folderToDelete)

      // Try to delete from batch_folders table
      await supabase.from("batch_folders").delete().eq("name", folderToDelete)

      toast({ title: `Folder "${folderToDelete}" deleted successfully` })
      setSelectedFolder(null)
      setShowDeleteConfirm(false)
      setFolderToDelete(null)
      fetchFolders()
      onRefresh()
    } catch (err: any) {
      console.error("Error deleting folder:", err.message)
      toast({
        title: "Error deleting folder",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Add all orders for a customer to folder
  const handleAddOrderToFolder = async (orderId: number, folder: string, customerName?: string) => {
    try {
      if (customerName) {
        // Move all orders for this customer that are unassigned
        const customerOrders = orders.filter((o) => o.name === customerName && !o.batch_folder)
        const ids = customerOrders.map((o) => o.id)
        if (ids.length === 0) return

        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: folder })
          .in("id", ids)

        if (error) throw error
        toast({ title: `${ids.length} order(s) added to ${folder} successfully` })
      } else {
        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: folder })
          .eq("id", orderId)

        if (error) throw error
        toast({ title: `Order added to ${folder} successfully` })
      }
      onRefresh()
    } catch (err: any) {
      console.error("Error adding order to folder:", err.message)
      toast({
        title: "Error adding order",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Remove all orders for a customer from folder
  const handleRemoveOrderFromFolder = async (orderId: number, customerName?: string, folder?: string) => {
    try {
      if (customerName && folder) {
        // Remove all orders for this customer in this folder
        const customerOrders = orders.filter((o) => o.name === customerName && o.batch_folder === folder)
        const ids = customerOrders.map((o) => o.id)
        if (ids.length === 0) return

        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: null })
          .in("id", ids)

        if (error) throw error
        toast({ title: `${ids.length} order(s) removed from folder successfully` })
      } else {
        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: null })
          .eq("id", orderId)

        if (error) throw error
        toast({ title: "Order removed from folder successfully" })
      }
      onRefresh()
    } catch (err: any) {
      console.error("Error removing order:", err.message)
      toast({
        title: "Error removing order",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Move all orders for a customer to different folder
  const handleMoveOrder = async (orderId: number, newFolder: string, customerName?: string, currentFolder?: string) => {
    try {
      if (customerName && currentFolder) {
        // Move all orders for this customer from current folder
        const customerOrders = orders.filter((o) => o.name === customerName && o.batch_folder === currentFolder)
        const ids = customerOrders.map((o) => o.id)
        if (ids.length === 0) return

        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: newFolder })
          .in("id", ids)

        if (error) throw error
        toast({ title: `${ids.length} order(s) moved to ${newFolder} successfully` })
      } else {
        const { error } = await supabase
          .from("orders")
          .update({ batch_folder: newFolder })
          .eq("id", orderId)

        if (error) throw error
        toast({ title: `Order moved to ${newFolder} successfully` })
      }
      onRefresh()
    } catch (err: any) {
      console.error("Error moving order:", err.message)
    }
  }

  if (!open) return null

  // Get order count for folder being deleted
  const deleteFolderOrderCount = folderToDelete ? getOrdersInFolder(folderToDelete).length : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-foreground" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Batch Folders</h2>
                <p className="text-muted-foreground text-sm">Organize orders into folders</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Sidebar - Folders */}
          <div className="w-72 flex-shrink-0 border-r border-border bg-muted/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Folders
              </h3>
              <Button
                size="sm"
                className="h-7 px-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowAddFolderForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>

            {/* Add Folder Form */}
            <AnimatePresence>
              {showAddFolderForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-card rounded-lg border border-border"
                >
                  <Input
                    placeholder="Folder name (e.g. Batch 1)"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="mb-2 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                      onClick={handleCreateFolder}
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8"
                      onClick={() => {
                        setShowAddFolderForm(false)
                        setNewFolderName("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unassigned Orders */}
            <button
              onClick={() => setSelectedFolder("__unassigned__")}
              className={`w-full text-left p-3 rounded-lg transition-all mb-2 ${
                selectedFolder === "__unassigned__"
                  ? "bg-gray-600 text-white shadow-lg"
                  : "bg-card hover:bg-accent text-card-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">Unassigned</div>
                  <div className={`text-xs ${selectedFolder === "__unassigned__" ? "text-gray-300" : "text-muted-foreground"}`}>
                    {getOrdersWithoutFolder().length} orders
                  </div>
                </div>
              </div>
            </button>

            <div className="border-t border-border my-3"></div>

            {/* Folder List */}
            <div className="space-y-2">
              {folders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No folders yet. Create one!
                </p>
              ) : (
                folders.map((folder) => {
                  const folderOrders = getOrdersInFolder(folder)
                  return (
                    <button
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedFolder === folder
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-card hover:bg-accent text-card-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{folder}</div>
                          <div className={`text-xs ${selectedFolder === folder ? "text-indigo-200" : "text-muted-foreground"}`}>
                            {folderOrders.length} orders
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Main Content - Orders in Folder */}
          <div className="flex-1 p-6 overflow-y-auto min-w-0">
            {selectedFolder ? (
              <>
                {/* Folder Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="min-w-0 flex items-center gap-3">
                    {selectedFolder === "__unassigned__" ? (
                      <Inbox className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <FolderOpen className="w-6 h-6 text-indigo-600" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold break-words">
                        {selectedFolder === "__unassigned__" ? "Unassigned Orders" : selectedFolder}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {selectedFolder === "__unassigned__"
                          ? `${getOrdersWithoutFolder().length} orders without folder`
                          : `${getOrdersInFolder(selectedFolder).length} orders in this folder`}
                      </p>
                    </div>
                  </div>
                  {selectedFolder !== "__unassigned__" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(selectedFolder)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Folder
                    </Button>
                  )}
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {(selectedFolder === "__unassigned__"
                    ? getOrdersWithoutFolder()
                    : getOrdersInFolder(selectedFolder)
                  ).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {selectedFolder === "__unassigned__" ? (
                        <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      ) : (
                        <Inbox className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      )}
                      <p className="font-medium">
                        {selectedFolder === "__unassigned__"
                          ? "All orders are assigned to folders!"
                          : "No orders in this folder yet."}
                      </p>
                      {selectedFolder !== "__unassigned__" && (
                        <p className="text-sm mt-1">
                          Go to &quot;Unassigned&quot; to add orders to this folder.
                        </p>
                      )}
                    </div>
                  ) : (
                    (() => {
                      // Group orders by customer name and show only first order
                      const currentOrders = selectedFolder === "__unassigned__"
                        ? getOrdersWithoutFolder()
                        : getOrdersInFolder(selectedFolder)

                      const groupedByCustomer = currentOrders.reduce((acc, order) => {
                        if (!acc[order.name]) {
                          acc[order.name] = []
                        }
                        acc[order.name].push(order)
                        return acc
                      }, {} as Record<string, Order[]>)

                      return Object.entries(groupedByCustomer).map(([customerName, customerOrders]) => {
                        const firstOrder = customerOrders[0]
                        return (
                          <div
                            key={customerName}
                            className="p-4 bg-card rounded-lg border border-border hover:border-indigo-400 transition-colors overflow-hidden"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              {/* Order Info */}
                              <div className="flex-1 min-w-0 overflow-hidden">
                                {/* Customer Name */}
                                <div className="mb-2">
                                  <button
                                    onClick={() => handleCustomerClick(customerName)}
                                    className={`font-bold text-lg ${
                                      hasMultipleOrders(customerName)
                                        ? "text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                                        : "cursor-default"
                                    }`}
                                  >
                                    {customerName}
                                    {customerOrders.length > 1 && (
                                      <span className="ml-1 text-xs text-indigo-500">
                                        ({customerOrders.length} orders in this folder)
                                      </span>
                                    )}
                                  </button>
                                </div>

                                {/* Order details below name */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Payment status badge */}
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                      firstOrder.payment_status === "fully paid"
                                        ? "bg-green-900/40 text-green-400"
                                        : firstOrder.payment_status === "partially paid"
                                        ? "bg-yellow-900/40 text-yellow-400"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {firstOrder.payment_status}
                                  </span>

                                  {/* Order details pills */}
                                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-indigo-900/40 text-indigo-400 rounded-full font-medium truncate max-w-[150px]">
                                    {firstOrder.design}
                                  </span>
                                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-purple-900/40 text-purple-400 rounded-full truncate max-w-[100px]">
                                    {firstOrder.color}
                                  </span>
                                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full">
                                    {firstOrder.size}
                                  </span>
                                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-green-900/40 text-green-400 rounded-full">
                                    P{firstOrder.price}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-row gap-2 flex-shrink-0">
                                {selectedFolder === "__unassigned__" ? (
                                  <select
                                    className="text-sm border border-input rounded px-2 py-1 bg-background min-w-[140px]"
                                    defaultValue=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddOrderToFolder(firstOrder.id, e.target.value, customerName)
                                        e.target.value = ""
                                      }
                                    }}
                                  >
                                    <option value="">Add to folder...</option>
                                    {folders.map((f) => (
                                      <option key={f} value={f}>
                                        {f}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <>
                                    <select
                                      className="text-sm border border-input rounded px-2 py-1 bg-background min-w-[120px]"
                                      defaultValue=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleMoveOrder(firstOrder.id, e.target.value, customerName, selectedFolder)
                                          e.target.value = ""
                                        }
                                      }}
                                    >
                                      <option value="">Move to...</option>
                                      {folders
                                        .filter((f) => f !== selectedFolder)
                                        .map((f) => (
                                          <option key={f} value={f}>
                                            {f}
                                          </option>
                                        ))}
                                    </select>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-400 hover:bg-red-900/30 h-8 text-xs"
                                      onClick={() => handleRemoveOrderFromFolder(firstOrder.id, customerName, selectedFolder)}
                                    >
                                      Remove
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    })()
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Folder className="w-20 h-20 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Select a Folder</h3>
                <p className="text-center max-w-sm">
                  Choose a folder from the sidebar to view and manage orders, or create a new folder to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            Total: {orders.length} orders - {folders.length} folders
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        {/* Delete Folder Confirmation Popup */}
        <AnimatePresence>
          {showDeleteConfirm && folderToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
              onClick={() => {
                setShowDeleteConfirm(false)
                setFolderToDelete(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Delete Folder</h3>
                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-300">
                    Are you sure you want to delete the folder <strong>&quot;{folderToDelete}&quot;</strong>?
                  </p>
                  {deleteFolderOrderCount > 0 && (
                    <p className="text-sm text-red-400 mt-2 font-medium">
                      {deleteFolderOrderCount} order{deleteFolderOrderCount > 1 ? 's' : ''} will be moved to Unassigned.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setFolderToDelete(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteFolder}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Folder
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customer Orders Modal */}
        <AnimatePresence>
          {showCustomerOrders && selectedCustomer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
              onClick={() => {
                setShowCustomerOrders(false)
                setSelectedCustomer(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl max-w-3xl w-full mx-4 border border-border max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/40 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedCustomer}&apos;s Orders</h3>
                      <p className="text-sm text-muted-foreground">
                        {getCustomerOrders(selectedCustomer).length} total orders
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCustomerOrders(false)
                      setSelectedCustomer(null)
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {getCustomerOrders(selectedCustomer).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Order Details */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              order.payment_status === "fully paid"
                                ? "bg-green-900/40 text-green-400"
                                : order.payment_status === "partially paid"
                                ? "bg-yellow-900/40 text-yellow-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                          {order.batch_folder && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-400">
                              Folder: {order.batch_folder}
                            </span>
                          )}
                          {!order.batch_folder && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Unassigned
                            </span>
                          )}
                        </div>

                        {/* Product Details and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm px-3 py-1 bg-indigo-900/40 text-indigo-400 rounded-full font-medium">
                              {order.design}
                            </span>
                            <span className="text-sm px-3 py-1 bg-purple-900/40 text-purple-400 rounded-full">
                              {order.color}
                            </span>
                            <span className="text-sm px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full">
                              {order.size}
                            </span>
                            <span className="text-sm px-3 py-1 bg-green-900/40 text-green-400 rounded-full font-semibold">
                              P{order.price}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-row gap-2 flex-shrink-0">
                            {!order.batch_folder ? (
                              <select
                                className="text-sm border border-input rounded px-2 py-1 bg-background min-w-[140px]"
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAddOrderToFolder(order.id, e.target.value)
                                    e.target.value = ""
                                  }
                                }}
                              >
                                <option value="">Add to folder...</option>
                                {folders.map((f) => (
                                  <option key={f} value={f}>
                                    {f}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <>
                                <select
                                  className="text-sm border border-input rounded px-2 py-1 bg-background min-w-[120px]"
                                  defaultValue=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleMoveOrder(order.id, e.target.value)
                                      e.target.value = ""
                                    }
                                  }}
                                >
                                  <option value="">Move to...</option>
                                  {folders
                                    .filter((f) => f !== order.batch_folder)
                                    .map((f) => (
                                      <option key={f} value={f}>
                                        {f}
                                      </option>
                                    ))}
                                </select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 h-8 text-xs"
                                  onClick={() => handleRemoveOrderFromFolder(order.id)}
                                >
                                  Remove
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
