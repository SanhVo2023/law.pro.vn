'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const docEl = document.documentElement
        const max = docEl.scrollHeight - docEl.clientHeight
        const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / max) * 100))
        setProgress(pct)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed top-0 inset-x-0 z-50 h-[3px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-[var(--color-burgundy)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
