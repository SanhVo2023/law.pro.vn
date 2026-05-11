import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import { identityFor } from '@/lib/identity'

type Props = { locale: Locale }

export default async function SiteFooter({ locale }: Props) {
  const t = await getTranslations({ locale })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const id = identityFor(locale)

  return (
    <footer className="mt-32 bg-[var(--color-parchment)] border-t border-[var(--color-rule)]">
      {/* Ornate divider above the columns */}
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pt-20">
        <div className="editorial-divider" aria-hidden />
      </div>

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pb-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-burgundy)]">
            {tSite('name')}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] italic text-lg text-[var(--color-charcoal)] leading-snug max-w-xs">
            {tSite('tagline')}
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] max-w-xs">
            {t('footer.brandDescription')}
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-[var(--color-burgundy)] mb-5">
            {t('footer.sectionsHeading')}
          </h4>
          <ul className="space-y-3 text-sm font-[family-name:var(--font-lora)]">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                <Link
                  // @ts-expect-error — pathnames keyed on VI slugs
                  href={s.hub.vi}
                  className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
                >
                  {tNav(s.navKey as 'courtPractice')}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-[var(--color-burgundy)] mb-5">
            {t('footer.aboutHeading')}
          </h4>
          <ul className="space-y-3 text-sm font-[family-name:var(--font-lora)]">
            <li>
              <Link href="/tac-gia" className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors">
                {tNav('authors')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-[var(--color-burgundy)] mb-5">
            {t('footer.ecosystemHeading')}
          </h4>
          <ul className="space-y-3 text-sm font-[family-name:var(--font-lora)]">
            {/* Parent-brand link — split per locale (Issue 13): VN → apolo.com.vn,
                EN → apololawyers.com. NEVER both. */}
            <li>
              <a
                href={id.parentBrandUrl}
                target="_blank"
                rel="noopener"
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                {id.parentBrandLabel}
              </a>
            </li>
            <li>
              <a
                href="https://luatsutructuyen.vn"
                target="_blank"
                rel="noopener"
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                luatsutructuyen.vn
              </a>
            </li>
            <li>
              <a
                href="https://vothienhien.com"
                target="_blank"
                rel="noopener"
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                vothienhien.com
              </a>
            </li>
            <li>
              <a
                href="https://law.org.vn"
                target="_blank"
                rel="noopener"
                className="editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                law.org.vn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Canonical contact block — head office, locale-aware. The address SSOT
          is workspace-root address.txt; the strings are exported by
          src/lib/identity.ts. Do NOT hand-edit. */}
      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-8 grid gap-8 md:grid-cols-2 text-sm text-[var(--color-charcoal)] font-[family-name:var(--font-lora)]">
          <div>
            <p className="eyebrow text-[var(--color-burgundy)] mb-3">
              {locale === 'vi' ? 'Trụ sở chính' : 'Head Office'}
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-ink)] mb-2">
              {id.companyName}
            </p>
            <p className="text-[var(--color-ink-muted)] leading-relaxed">{id.address}</p>
            <p className="mt-2 text-[var(--color-ink-muted)]">
              <a href={`mailto:${id.email}`} className="editorial-link hover:text-[var(--color-burgundy)]">
                {id.email}
              </a>
            </p>
            <p className="mt-1 text-[var(--color-ink-muted)]">
              {id.phones.map((p, i) => (
                <span key={p}>
                  {i > 0 && <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>}
                  {p}
                </span>
              ))}
              {'hotline' in id && id.hotline ? (
                <>
                  <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
                  <span>
                    {locale === 'en' ? 'Hotline ' : 'Hotline '}
                    {id.hotline}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          {/* East Saigon branch — EN locale only, per Mr Hien (Issue 11). */}
          {locale === 'en' && 'branch' in id && id.branch ? (
            <div>
              <p className="eyebrow text-[var(--color-burgundy)] mb-3">East Saigon Branch</p>
              <p className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-ink)] mb-2">
                {id.branch.name}
              </p>
              <p className="text-[var(--color-ink-muted)] leading-relaxed">{id.branch.address}</p>
              <p className="mt-2 text-[var(--color-ink-muted)]">
                {id.branch.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>}
                    {p}
                  </span>
                ))}
                <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
                <span>Hotline {id.branch.hotline}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-6 text-xs text-[var(--color-ink-muted)] font-[family-name:var(--font-inter)]">
          <p className="uppercase tracking-[0.16em]">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
