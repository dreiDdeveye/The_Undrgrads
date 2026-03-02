import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  designName: string
  color: string
  size: string
  unitPrice: number
  quantity: number
  maxStock: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (open: boolean) => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const id = `${newItem.designName}-${newItem.color}-${newItem.size}`
        set((state) => {
          const existing = state.items.find((item) => item.id === id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxStock) }
                  : item
              ),
            }
          }
          return { items: [...state.items, { ...newItem, id }] }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
      setIsOpen: (open) => set({ isOpen: open }),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    }),
    {
      name: "undergrads-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
