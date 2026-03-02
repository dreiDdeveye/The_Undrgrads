export default function ShopFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo1.png" alt="TheUndergrads" className="h-6 w-6 object-contain opacity-50" />
            <span className="text-sm text-muted-foreground">TheUndergrads</span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} TheUndergrads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
