"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { FEATURED_ITEMS } from "@/lib/shop-utils"

export default function FunnelCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const totalSlides = FEATURED_ITEMS.length

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <section id="featured" className="relative py-16 sm:py-24">
      {/* Section header */}
      <div className="mb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Featured
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            The Collection
          </h2>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[
            Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
          ]}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {FEATURED_ITEMS.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-[80%] sm:basis-[45%] lg:basis-[30%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90" />

                    {/* Tag badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80">
                      {item.tag}
                    </span>

                    {/* Bottom overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-bold text-white">{item.label}</h3>
                      <p className="mt-2 text-sm text-white/60 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-center gap-1">
                        Shop now <ArrowRight className="h-3.5 w-3.5" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Nav arrows — hidden on mobile */}
          <CarouselPrevious className="hidden sm:flex left-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm" />
          <CarouselNext className="hidden sm:flex right-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm" />
        </Carousel>

        {/* Progress bar */}
        <div className="mt-8 flex justify-center">
          <div className="h-0.5 w-32 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              animate={{ width: `${((current + 1) / totalSlides) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
