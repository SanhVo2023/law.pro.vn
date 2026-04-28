import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import LocaleSwitcher from './LocaleSwitcher'

type Props = { locale: Locale }

export default async function SiteHeader({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-parchment)]/95 backdrop-blur-sm">
      {/* Top utility bar — issue stamp + authors + locale */}
      <div className="border-b border-[var(--color-rule)]/70">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 h-9 flex items-center justify-between text-[10.5px] font-[family-name:var(--font-inter)] uppercase tracking-[0.24em] text-[var(--color-ink-muted)]">
          <p className="hidden sm:block">
            <span className="text-[var(--color-burgundy)]">Vol. I</span>
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            Issue 01
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            April&nbsp;2026
          </p>
          <p className="sm:hidden text-[var(--color-burgundy)]">Vol. I · Issue 01</p>
          <div className="flex items-center gap-5">
            <Link
              href="/tac-gia"
              className="hidden md:inline hover:text-[var(--color-burgundy)] transition-colors"
            >
              {tNav('authors')}
            </Link>
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>

      {/* Magazine masthead — centered wordmark, gold rule, italic tagline */}
      <div className="border-b border-[var(--color-gold)]/30">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-7 md:py-9 text-center">
          <Link href="/" className="inline-block group">
            <h1 className="font-[family-name:var(--font-cormorant)] uppercase text-[1.65rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl tracking-[0.16em] text-[var(--color-burgundy)] leading-[1.05] font-medium">
              {tSite('name')}
            </h1>
            <div
              aria-hidden
              className="mx-auto mt-3 h-px w-16 md:w-20 bg-[var(--color-gold)]"
            />
            <p className="mt-3 font-[family-name:var(--font-cormorant)] italic text-sm md:text-base lg:text-lg text-[var(--color-ink-muted)] tracking-wide group-hover:text-[var(--color-burgundy)]/80 transition-colors">
              {tSite('tagline')}
            </p>
          </Link>
        </div>
      </div>

      {/* Section nav — centered, scrollable on overflow */}
      <nav className="border-b border-[var(--color-rule)]/50">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-start lg:justify-center gap-x-7 lg:gap-x-10 xl:gap-x-12 px-6 lg:px-10 py-3.5 font-[family-name:var(--font-inter)] text-[11.5px] uppercase tracking-[0.18em] overflow-x-auto whitespace-nowrap scrollbar-hide">
            {SECTIONS.map((s) => (
              <Link
                key={s.key}
                // @ts-expect-error — pathnames keyed on VI slugs
                href={s.hub.vi}
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors flex-shrink-0"
              >
                {tNav(s.navKey as 'courtPractice')}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
