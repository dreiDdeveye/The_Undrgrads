// Size options
export const BASE_SIZES = ["XS", "S", "M", "L", "XL", "2XL"]
export const EXTENDED_SIZES = ["3XL", "4XL", "5XL"]
export const ALL_SIZES = [...BASE_SIZES, ...EXTENDED_SIZES]

// Colors that support extended sizes (3XL-5XL)
export const EXTENDED_SIZE_COLORS = ["Black", "White"]

export const LOW_STOCK_THRESHOLD = 5

export function getAvailableSizes(color: string): string[] {
  const colorLower = color.toLowerCase()
  if (EXTENDED_SIZE_COLORS.some((c) => c.toLowerCase() === colorLower)) {
    return ALL_SIZES
  }
  return BASE_SIZES
}
