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
