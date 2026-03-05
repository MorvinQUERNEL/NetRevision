import { useRef } from 'react'
import { useInView } from 'framer-motion'

interface ScrollRevealOptions {
  once?: boolean
  margin?: string
  amount?: number
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { once = true, margin = '-60px' } = options
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: margin as any })

  return { ref, isInView }
}

// Common animation variants for consistency
export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}
