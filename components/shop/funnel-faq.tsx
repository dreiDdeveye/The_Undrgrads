"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our collection, select your preferred design, color, and size, then add it to your cart. When you're ready, proceed to checkout, fill in your details, and choose your payment method (GCash or Cash on Delivery).",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept GCash / bank transfer and Cash on Delivery (COD). For GCash payments, you'll receive payment instructions after placing your order. Simply send your payment and include your order reference number as the message.",
  },
  {
    question: "What sizes are available?",
    answer:
      "We offer sizes from XS to 2XL for all colors. For Black and White shirts, we also carry extended sizes up to 5XL. Check the size selector on each product page for real-time stock availability.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically processed within 1-3 business days. Delivery times vary by location but usually take 3-7 business days within Metro Manila and 5-14 business days for provincial areas.",
  },
  {
    question: "What is the quality of the shirts?",
    answer:
      "All our shirts are made from premium 220GSM cotton fabric. Prints are done using high-quality DTF and silk-screen methods that are resistant to cracking, peeling, and fading even after multiple washes.",
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "We accept returns and exchanges for defective items within 7 days of delivery. Please contact us through our Facebook page with your order reference number and photos of the issue. Note that returns for change of mind are not accepted.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After placing your order, you'll receive an order reference number. You can use this to inquire about your order status through our Facebook page. We'll keep you updated on your order's progress.",
  },
  {
    question: "Do you offer bulk or group orders?",
    answer:
      "Yes! We offer special pricing for bulk and chapter orders. Contact us through our Facebook page with your requirements and we'll work out a custom quote for your group.",
  },
]

export default function FunnelFAQ() {
  return (
    <section className="relative py-16 sm:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Got Questions?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to know before you order.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border/30 bg-card/30 px-6"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/20">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-5 [&[data-state=open]]:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
