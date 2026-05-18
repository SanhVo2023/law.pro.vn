'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import LocaleSwitcher from './LocaleSwitcher'
import type { Locale } from '@/i18n/routing'

type NavItem = { hubVi: string; label: string }

type Props = {
  brand: string
  authorsLabel: string
  items: NavItem[]
  locale: Locale
}

/**
 * Intelligent slim sticky nav. Hidden by default (translate-y -100%).
 * Watches `#site-header-sentinel` (placed by SiteHeader at the bottom of the
 * full masthead). When the sentinel is above the viewport — i.e. the user
 * has scrolled past the full masthead — the slim bar slides in. When the
 * sentinel is in or below the viewport, the slim bar slides out so the full
 * editorial masthead owns the visual real-estate at the top of the page.
 */
export default function StickyNavBar({ brand, authorsLabel, items, locale }: Props) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sentinel = document.querySelector<HTMLElement>('#site-header-sentinel')
    if (!sentinel) return
    const io = new IntersectionObserver(
      ([entry]) => {
        // Show only when sentinel is ABOVE the viewport top.
        setVisible(entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref as never}
      aria-hidden={!visible}
      className={
        'fixed top-0 left-0 right-0 z-50 bg-[var(--color-parchment)]/95 backdrop-blur-md border-b border-[var(--color-gold)]/30 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out ' +
        (visible ? 'translate-y-0' : '-translate-y-full pointer-events-none')
      }
      role="navigation"
      aria-label="Compact site navigation"
    >
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 h-12 md:h-14 flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] uppercase text-[13px] md:text-base lg:text-lg tracking-[0.14em] text-[var(--color-burgundy)] whitespace-nowrap flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          {brand}
        </Link>

        <nav className="flex-1 flex items-center justify-end lg:justify-center gap-x-5 lg:gap-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide text-[10.5px] md:text-[11px] uppercase tracking-[0.16em] font-[family-name:var(--font-inter)]">
          {items.map((i) => (
            <Link
              key={i.hubVi}
              // @ts-expect-error — pathnames keyed on VI slugs
              href={i.hubVi}
              className="text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors flex-shrink-0"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <Link
            href="/tac-gia"
            className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] transition-colors"
          >
            {authorsLabel}
          </Link>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      </div>
    </div>
  )
}
