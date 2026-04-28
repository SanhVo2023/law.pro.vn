import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import LocaleSwitcher from './LocaleSwitcher'

type Props = { locale: Locale }

export default async function SiteHeader({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-parchment)]/92 backdrop-blur-sm">
      {/* Top utility bar — issue stamp + locale switcher */}
      <div className="border-b border-[var(--color-rule)]/70">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 h-9 flex items-center justify-between text-[10.5px] uppercase tracking-[0.24em] text-[var(--color-ink-muted)]">
          <p className="font-[family-name:var(--font-inter)]">
            <span className="text-[var(--color-burgundy)]">Vol. I</span>
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            Issue 01
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            <span className="hidden sm:inline">April&nbsp;2026</span>
            <span className="sm:hidden">2026</span>
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/tac-gia"
              className="hidden md:inline font-[family-name:var(--font-inter)] hover:text-[var(--color-burgundy)] transition-colors"
            >
              {t('authors')}
            </Link>
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>

      {/* Main masthead row */}
      <div className="border-b border-[var(--color-gold)]/30">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-5 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-baseline gap-4">
            <span className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl tracking-tight text-[var(--color-burgundy)]">
              {tSite('name')}
            </span>
            <span className="hidden md:inline-block font-[family-name:var(--font-cormorant)] italic text-base text-[var(--color-ink-muted)]">
              {tSite('tagline')}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-x-8 font-[family-name:var(--font-inter)] text-[12.5px] uppercase tracking-[0.14em]">
            {SECTIONS.map((s) => (
              <Link
                key={s.key}
                // @ts-expect-error — pathnames keyed on VI slugs
                href={s.hub.vi}
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                {t(s.navKey as 'courtPractice')}
              </Link>
            ))}
          </nav>

          <Link
            href="/tim-kiem"
            className="lg:hidden font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.16em] text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)]"
          >
            {t('search')}
          </Link>
        </div>
      </div>
    </header>
  )
}
