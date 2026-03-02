"use client"

import FunnelHero from "./funnel-hero"
import FunnelMarquee from "./funnel-marquee"
import FunnelCarousel from "./funnel-carousel"
import FunnelStats from "./funnel-stats"
import FunnelSplitFeature from "./funnel-split-feature"
import FunnelLookbook from "./funnel-lookbook"
import FunnelTestimonials from "./funnel-testimonials"
import FunnelCommunity from "./funnel-community"

export default function FunnelSection() {
  return (
    <>
      <FunnelHero />
      <FunnelMarquee />
      <FunnelCarousel />
      <FunnelStats />
      <FunnelSplitFeature />
      <FunnelLookbook />
      <FunnelTestimonials />
      <FunnelCommunity />
    </>
  )
}
