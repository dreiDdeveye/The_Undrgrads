"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark"
    const viewTransitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void
    }

    if (!viewTransitionDocument.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    viewTransitionDocument.startViewTransition(() => {
      setTheme(nextTheme)
    })
  }

  return (
    <button
      type="button"
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-8 w-[4.25rem] shrink-0 items-center rounded-full border border-border/70 bg-muted/70 p-1",
        "shadow-sm backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:border-ring/70 hover:shadow-[0_0_22px_hsl(var(--theme-glow)/0.28)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          "absolute inset-y-1 left-1 w-7 rounded-full bg-background shadow-lg shadow-black/10 ring-1 ring-border/80",
          "transition-transform duration-300 ease-out group-hover:shadow-[0_0_18px_hsl(var(--theme-glow)/0.35)]",
          mounted && isDark && "translate-x-8"
        )}
      />
      <span
        className={cn(
          "relative z-10 flex h-6 w-7 items-center justify-center rounded-full transition-colors duration-300",
          mounted && !isDark ? "text-amber-500" : "text-muted-foreground"
        )}
      >
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span
        className={cn(
          "relative z-10 flex h-6 w-7 items-center justify-center rounded-full transition-colors duration-300",
          mounted && isDark ? "text-sky-300" : "text-muted-foreground"
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
