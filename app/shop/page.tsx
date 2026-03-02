"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import FunnelSection from "@/components/shop/funnel-section"
import ProductCard from "@/components/shop/product-card"
import ProductFilters from "@/components/shop/product-filters"

interface Design {
  name: string
  price: number
  description: string
  image_url: string
}

export default function ShopPage() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("name-asc")

  useEffect(() => {
    async function load() {
      try {
        // Try fetching with shop columns first, fallback to basic query
        let designResult = await supabase
          .from("designs")
          .select("name, price, description, image_url")
          .order("name", { ascending: true })

        // If the query fails (columns don't exist yet), fallback to all designs
        if (designResult.error) {
          const { data } = await supabase
            .from("designs")
            .select("name")
            .order("name", { ascending: true })
          designResult = {
            data: (data || []).map((d) => ({ name: d.name, price: 0, description: "", image_url: "" })),
            error: null,
          } as any
        }

        const { data: colorData } = await supabase
          .from("colors")
          .select("name")
          .order("name", { ascending: true })

        setDesigns(designResult.data || [])
        setColors(colorData?.map((c) => c.name) || [])
      } catch (err) {
        console.error("Shop load error:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let result = designs.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    )

    switch (sort) {
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      default:
        result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [designs, search, sort])

  return (
    <>
      <FunnelSection />

      <section id="catalog" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          resultCount={filtered.length}
        />

        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            <p className="text-sm text-muted-foreground">Loading designs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No designs found.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {filtered.map((design, i) => (
              <ProductCard
                key={design.name}
                name={design.name}
                price={design.price || 0}
                imageUrl={design.image_url || ""}
                colors={colors}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
