"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, RotateCcw, AlertCircle, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DefectiveItemsDialog({
  open,
  onOpenChange,
  defectiveOrders,
  onRetrieveDefective,
  onDeleteDefectivePermanently,
  onDeleteAllDefectivePermanently,
  onEditDefectiveNote,
}: any) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [noteInput, setNoteInput] = useState("")

  const handleOpenNote = (order: any) => {
    setSelectedOrder(order)
    setNoteInput(order.defective_note || "")
  }

  const handleSaveNote = () => {
    if (selectedOrder && onEditDefectiveNote) {
      onEditDefectiveNote(selectedOrder.id, noteInput)
    }
    setSelectedOrder(null)
    setNoteInput("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1300px] rounded-xl bg-background shadow-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span>Pending Items</span>
              <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                {defectiveOrders.length}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {defectiveOrders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-lg font-medium">No pending items found</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border border-border rounded-lg">
            <table className="w-auto min-w-full border-collapse text-sm">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="p-3 text-left whitespace-nowrap">Customer</th>
                  <th className="p-3 text-left whitespace-nowrap">Design</th>
                  <th className="p-3 text-left whitespace-nowrap">Color</th>
                  <th className="p-3 text-center whitespace-nowrap">Size</th>
                  <th className="p-3 text-center whitespace-nowrap">Note</th>
                  <th className="p-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody>
                {defectiveOrders.map((o: any, index: number) => (
                  <tr
                    key={o.id}
                    className={`transition-colors ${
                      index % 2 === 0 ? "bg-card" : "bg-muted/30"
                    } hover:bg-muted`}
                  >
                    <td className="p-3 border-t align-top text-foreground font-medium whitespace-nowrap">
                      {o.name || "--"}
                    </td>
                    <td className="p-3 border-t align-top whitespace-nowrap">
                      {o.design || "--"}
                    </td>
                    <td className="p-3 border-t align-top whitespace-nowrap">
                      {o.color || "--"}
                    </td>
                    <td className="p-3 border-t text-center align-top whitespace-nowrap">
                      {o.size || "--"}
                    </td>

                    {/* Note Button */}
                    <td className="p-3 border-t text-center align-top whitespace-nowrap">
                      <Button
                        size="sm"
                        variant={o.defective_note ? "destructive" : "outline"}
                        className={`h-8 w-8 p-0 flex items-center justify-center ${
                          o.defective_note
                            ? "bg-red-900/40 hover:bg-red-900/60 text-red-400"
                            : "bg-muted hover:bg-muted/70 text-muted-foreground"
                        }`}
                        onClick={() => handleOpenNote(o)}
                        title={o.defective_note ? "View or edit note" : "Add note"}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 border-t text-center align-top whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                          onClick={() => onRetrieveDefective(o.id)}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Retrieve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-3 text-xs flex items-center gap-1"
                          onClick={() => onDeleteDefectivePermanently(o.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {defectiveOrders.length > 0 && (
          <div className="flex justify-end mt-5">
            <Button
              variant="destructive"
              className="flex items-center gap-2 font-medium px-5 py-2.5"
              onClick={onDeleteAllDefectivePermanently}
            >
              <Trash2 className="w-4 h-4" />
              Delete All Permanently
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Note Popup Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-sm rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Defective Note
              </DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              <Input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter note (optional)"
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOrder(null)
                  setNoteInput("")
                }}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveNote}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
