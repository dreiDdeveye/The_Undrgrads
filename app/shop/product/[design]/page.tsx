"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ShoppingBag, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency, getProductImage } from "@/lib/shop-utils"
import { getAvailableSizes } from "@/lib/constants"
import ColorSwatch from "@/components/shop/color-swatch"
import SizeSelector from "@/components/shop/size-selector"
import QuantitySelector from "@/components/shop/quantity-selector"
import { toast } from "@/components/ui/use-toast"

interface Design {
  name: string
  price: number
  description: string
  image_url: string
}

interface StockRow {
  color: string
  size: string
  quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const designSlug = decodeURIComponent(params.design as string)

  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useCartStore((s) => s.setIsOpen)

  const [design, setDesign] = useState<Design | null>(null)
  const [colors, setColors] = useState<string[]>([])
  const [stocks, setStocks] = useState<StockRow[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function load() {
      // Try with shop columns, fallback to basic
      let designResult = await supabase
        .from("designs")
        .select("name, price, description, image_url")
        .eq("name", designSlug)
        .single()

      if (designResult.error) {
        const { data } = await supabase
          .from("designs")
          .select("name")
          .eq("name", designSlug)
          .single()
        if (data) {
          designResult = { data: { ...data, price: 0, description: "", image_url: "" }, error: null } as any
        }
      }

      const [{ data: colorData }, { data: stockData }] = await Promise.all([
        supabase.from("colors").select("name").order("name", { ascending: true }),
        supabase.from("stocks").select("color, size, quantity"),
      ])

      if (designResult.data) setDesign(designResult.data)
      const colorNames = colorData?.map((c) => c.name) || []
      setColors(colorNames)
      setStocks(stockData || [])

      if (colorNames.length > 0) setSelectedColor(colorNames[0])
      setLoading(false)
    }
    load()
  }, [designSlug])

  // Stock lookup
  const stockMap = useMemo(() => {
    const map = new Map<string, number>()
    stocks.forEach((s) => map.set(`${s.color}|${s.size}`, s.quantity))
    return map
  }, [stocks])

  const getStock = (color: string, size: string) => stockMap.get(`${color}|${size}`) || 0

  // Available sizes for selected color
  const availableSizes = useMemo(() => getAvailableSizes(selectedColor), [selectedColor])

  // Reset size when color changes
  useEffect(() => {
    if (!selectedColor) return
    const sizes = getAvailableSizes(selectedColor)
    if (!sizes.includes(selectedSize)) {
      // Pick first in-stock size, or first size
      const firstInStock = sizes.find((s) => getStock(selectedColor, s) > 0)
      setSelectedSize(firstInStock || sizes[0])
    }
    setQuantity(1)
  }, [selectedColor])

  const currentStock = selectedColor && selectedSize ? getStock(selectedColor, selectedSize) : 0
  const isOutOfStock = currentStock === 0

  const handleAddToCart = () => {
    if (!design || !selectedColor || !selectedSize || isOutOfStock) return

    addItem({
      designName: design.name,
      color: selectedColor,
      size: selectedSize,
      unitPrice: design.price || 0,
      quantity,
      maxStock: currentStock,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setCartOpen(true)
    toast({ title: `${design.name} added to cart` })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!design) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Design not found.</p>
        <Button variant="outline" onClick={() => router.push("/shop")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      {/* Back link */}
      <button
        onClick={() => router.push("/shop")}
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-[4/5] overflow-hidden rounded-2xl border border-border/30 bg-muted/20"
        >
          <img
            src={getProductImage(0, design.image_url || undefined)}
            alt={design.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Right: Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{design.name}</h1>

          {design.description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">{design.description}</p>
          )}

          <p className="mt-4 text-2xl font-bold">{formatCurrency(design.price || 0)}</p>

          <Separator className="my-6 bg-border/30" />

          {/* Color selector */}
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Color — <span className="text-foreground">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  size="md"
                  selected={selectedColor === c}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Size — <span className="text-foreground">{selectedSize}</span>
            </p>
            <SizeSelector
              sizes={availableSizes}
              selected={selectedSize}
              onSelect={(s) => {
                setSelectedSize(s)
                setQuantity(1)
              }}
              getStock={(size) => getStock(selectedColor, size)}
            />
          </div>

          {/* Stock info */}
          <div className="mt-4">
            {isOutOfStock ? (
              <p className="flex items-center gap-1.5 text-sm text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /> Out of stock
              </p>
            ) : currentStock <= 5 ? (
              <p className="text-sm text-yellow-400">
                Only {currentStock} left in stock
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {currentStock} in stock
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Quantity</p>
            <QuantitySelector
              value={quantity}
              max={currentStock}
              onChange={setQuantity}
            />
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <Button
              size="lg"
              disabled={isOutOfStock || !selectedColor || !selectedSize}
              onClick={handleAddToCart}
              className="w-full gap-2 bg-white text-black hover:bg-white/90 disabled:bg-muted disabled:text-muted-foreground h-12 text-sm font-semibold"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Cart — {formatCurrency((design.price || 0) * quantity)}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
