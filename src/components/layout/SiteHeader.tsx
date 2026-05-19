import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import LocaleSwitcher from './LocaleSwitcher'
import StickyNavBar from './StickyNavBar'

type Props = { locale: Locale }

export default async function SiteHeader({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  // Issue stamp keeps pace with the current month so the masthead never
  // looks stale. We bump Issue No. once a year (12 issues = 12 months).
  const now = new Date()
  const monthVi = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'][now.getMonth()]
  const monthEn = now.toLocaleString('en-US', { month: 'long' })
  const issueMonth = locale === 'vi' ? `${monthVi} ${now.getFullYear()}` : `${monthEn} ${now.getFullYear()}`
  const issueNo = String(now.getMonth() + 1).padStart(2, '0')

  // Items consumed by the slim sticky bar (client component).
  const stickyItems = SECTIONS.map((s) => ({
    hubVi: s.hub.vi,
    label: tNav(s.navKey as 'courtPractice'),
  }))

  return (
    <>
      <header className="relative z-40 bg-[var(--color-parchment)]">
        {/* Top utility bar — issue stamp + authors + locale */}
      <div className="border-b border-[var(--color-rule)]/70">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 h-9 flex items-center justify-between text-[10.5px] font-[family-name:var(--font-inter)] uppercase tracking-[0.24em] text-[var(--color-ink-muted)]">
          <p className="hidden sm:block">
            <span className="text-[var(--color-burgundy)]">Vol. I</span>
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            Issue {issueNo}
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            <span className="whitespace-nowrap">{issueMonth}</span>
          </p>
          <p className="sm:hidden text-[var(--color-burgundy)]">Vol. I · Issue {issueNo}</p>
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
            {/* Wordmark is a logo, not a page heading. Demoted from <h1> per
                the 2026-05-18 UI audit (CX-2): page bodies own the single h1. */}
            <p className="font-[family-name:var(--font-cormorant)] uppercase text-[1.65rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl tracking-[0.16em] text-[var(--color-burgundy)] leading-[1.05] font-medium m-0">
              {tSite('name')}
            </p>
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

      {/* Sentinel — sits immediately under the full masthead. The slim sticky
          nav-bar watches this element via IntersectionObserver; once it goes
          above the viewport (= user scrolled past), the slim bar slides in. */}
      <div id="site-header-sentinel" aria-hidden className="h-0" />

      <StickyNavBar
        brand={tSite('name')}
        authorsLabel={tNav('authors')}
        items={stickyItems}
        locale={locale}
      />
    </>
  )
}
