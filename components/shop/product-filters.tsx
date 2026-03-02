"use client"

import { Search } from "lucide-react"

interface ProductFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  sort: string
  onSortChange: (val: string) => void
  resultCount: number
}

export default function ProductFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "design" : "designs"}
      </p>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 rounded-lg border border-border/40 bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-border"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-lg border border-border/40 bg-background px-3 text-sm outline-none transition-colors focus:border-border"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}
