'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import LocaleSwitcher from './LocaleSwitcher'

type NavItem = { hubVi: string; label: string }

type Props = {
  brand: string
  items: NavItem[]
  authorsLabel: string
  locale: Locale
}

/**
 * Modern Authority header: ONE slim sticky bar.
 * Wordmark left · section nav inline (desktop) · Authors + VI|EN right ·
 * hamburger panel on mobile. Replaces the old 3-tier masthead + separate
 * StickyNavBar — the brand "weight" now lives in the homepage hero, freeing
 * vertical space and reading as contemporary rather than ceremonial.
 */
export default function SiteNav({ brand, items, authorsLabel, locale }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div aria-hidden className="h-[3px] bg-[var(--color-gold)]" />
      <div className="bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 flex items-center justify-between gap-6 h-16">
          {/* Wordmark — a logo, not a page heading (page bodies own the h1). */}
          <Link href="/" onClick={() => setOpen(false)} className="flex-shrink-0">
            <span className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl font-semibold tracking-[0.01em] text-[var(--color-burgundy)]">
              {brand}
            </span>
          </Link>

          {/* Desktop section nav — shown at xl+, where six Vietnamese labels fit
              on one row; below that the hamburger panel takes over. */}
          <nav className="hidden xl:flex items-center gap-x-4 2xl:gap-x-6">
            {items.map((i) => (
              <Link
                key={i.hubVi}
                // @ts-expect-error — pathnames keyed on VI slugs
                href={i.hubVi}
                className="editorial-link font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.1em] text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors whitespace-nowrap"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          {/* Desktop utilities */}
          <div className="hidden xl:flex items-center gap-5 flex-shrink-0">
            <Link
              href="/tac-gia"
              className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] transition-colors"
            >
              {authorsLabel}
            </Link>
            <span aria-hidden className="h-4 w-px bg-[var(--color-line)]" />
            <LocaleSwitcher currentLocale={locale} />
          </div>

          {/* Mobile / tablet controls */}
          <div className="flex xl:hidden items-center gap-4">
            <LocaleSwitcher currentLocale={locale} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="p-1 text-[var(--color-burgundy)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                {open ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile / tablet panel */}
        {open ? (
          <nav className="xl:hidden border-t border-[var(--color-line)] bg-[var(--color-paper)]">
            <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10 py-3 flex flex-col">
              {items.map((i) => (
                <Link
                  key={i.hubVi}
                  // @ts-expect-error — pathnames keyed on VI slugs
                  href={i.hubVi}
                  onClick={() => setOpen(false)}
                  className="py-3 border-b border-[var(--color-line)]/70 font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-ink)] hover:text-[var(--color-burgundy)] transition-colors"
                >
                  {i.label}
                </Link>
              ))}
              <Link
                href="/tac-gia"
                onClick={() => setOpen(false)}
                className="pt-4 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                {authorsLabel}
              </Link>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
