export const COLOR_MAP: Record<string, string> = {
  Black: "#0a0a0a",
  White: "#fafafa",
  Red: "#dc2626",
  Blue: "#2563eb",
  "Navy Blue": "#1e3a5f",
  Navy: "#1e3a5f",
  "Royal Blue": "#4169e1",
  Green: "#16a34a",
  "Forest Green": "#228b22",
  Yellow: "#eab308",
  Orange: "#ea580c",
  Purple: "#7c3aed",
  Pink: "#ec4899",
  Maroon: "#7f1d1d",
  Gray: "#6b7280",
  Grey: "#6b7280",
  Brown: "#92400e",
  Teal: "#0d9488",
  Coral: "#f87171",
  Beige: "#d4c5a9",
}

export function getColorHex(colorName: string): string {
  return COLOR_MAP[colorName] || colorName.toLowerCase()
}

export function formatCurrency(amount: number): string {
  return `P${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function generateOrderRef(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `UG-${ts}-${rand}`
}

// Unsplash t-shirt / apparel product images for placeholders
export const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600&h=750&fit=crop",
]

export function getProductImage(index: number, imageUrl?: string): string {
  if (imageUrl) return imageUrl
  return PRODUCT_IMAGES[index % PRODUCT_IMAGES.length]
}

export const FEATURED_ITEMS = [
  { image: PRODUCT_IMAGES[0], label: "Classic White Tee", tag: "Bestseller" },
  { image: PRODUCT_IMAGES[1], label: "Graphic Statement", tag: "New Drop" },
  { image: PRODUCT_IMAGES[2], label: "Vintage Wash", tag: "Limited" },
  { image: PRODUCT_IMAGES[3], label: "Essential Black", tag: "Staple" },
  { image: PRODUCT_IMAGES[4], label: "Oversized Fit", tag: "Trending" },
  { image: PRODUCT_IMAGES[5], label: "Streetwear Edit", tag: "Featured" },
]
