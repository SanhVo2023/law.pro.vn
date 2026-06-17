'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Stagger offset in seconds — pass index * 0.06 for grids. */
  delay?: number
  /** Travel distance in px before settling. */
  y?: number
}

/**
 * Subtle, authoritative scroll reveal. Fades + lifts content into place the
 * first time it scrolls into view. Honours prefers-reduced-motion (renders
 * statically, no transform) and only animates once, so it never distracts on
 * re-scroll. Use on below-the-fold bands and grid items — NOT on the LCP hero.
 */
export default function Reveal({ children, className, delay = 0, y = 16 }: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
