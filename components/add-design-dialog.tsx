"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface AddDesignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDesign: (design: string) => void
  onDeleteDesign: (design: string) => void
  existingDesigns: string[]
}

export default function AddDesignDialog({
  open,
  onOpenChange,
  onAddDesign,
  onDeleteDesign,
  existingDesigns,
}: AddDesignDialogProps) {
  const [newDesign, setNewDesign] = useState("")
  const [loading, setLoading] = useState(false)

  // Add new design
  const handleAddDesign = async () => {
    if (!newDesign) return
    setLoading(true)

    try {
      const { error } = await supabase.from("designs").insert([{ name: newDesign }])
      if (error) throw error

      onAddDesign(newDesign)
      setNewDesign("")
      toast({ title: "Design added successfully!" })
    } catch (err: any) {
      console.error("Error adding design:", err.message)
      toast({ title: "Failed to add design.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Delete design
  const handleDelete = async (design: string) => {
    if (!confirm(`Delete design "${design}"?`)) return
    setLoading(true)

    try {
      const { error } = await supabase.from("designs").delete().eq("name", design)
      if (error) throw error

      onDeleteDesign(design)
      toast({ title: "Design deleted successfully!" })
    } catch (err: any) {
      console.error("Error deleting design:", err.message)
      toast({ title: "Failed to delete design.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Sort designs alphabetically
  const sortedDesigns = [...existingDesigns].sort((a, b) => a.localeCompare(b))

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-card text-card-foreground rounded-lg p-6 max-w-md w-full shadow-lg max-h-[80vh] overflow-y-auto border border-border">
        <h2 className="text-xl font-bold mb-4">Manage Designs</h2>

        {/* Add New Design */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Add New Design</label>
          <div className="flex gap-2">
            <Input
              value={newDesign}
              onChange={(e) => setNewDesign(e.target.value)}
              placeholder="Enter design name"
              disabled={loading}
            />
            <Button
              onClick={handleAddDesign}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add"}
            </Button>
          </div>
        </div>

        {/* Existing Designs (sorted alphabetically) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Existing Designs</label>
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
            {(!sortedDesigns || sortedDesigns.length === 0) && (
              <p className="text-xs text-muted-foreground">No designs yet.</p>
            )}
            {sortedDesigns.map((design) => (
              <div
                key={design}
                className="flex justify-between items-center p-2 bg-muted rounded"
              >
                <span>{design}</span>
                <Button
                  onClick={() => handleDelete(design)}
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Close
        </Button>
      </div>
    </div>
  )
}
