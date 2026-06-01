import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import { identityFor } from '@/lib/identity'
import { getFooter, type FooterColumn, type FooterLink, type FooterOffice } from '@/lib/queries'

type Props = { locale: Locale }

// Plain anchors: internal hrefs get the locale prefix (next-intl middleware
// resolves the localized path), external hrefs open in a new tab. Plain <a>
// (rather than next/link) sidesteps client-nav edge cases with the i18n
// pathname rewrites — fine for a footer.
function FooterLinkItem({ link, locale }: { link: FooterLink; locale: Locale }) {
  const label = link.label ?? ''
  const href = link.href ?? '#'
  const cls =
    'editorial-link text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors'
  if (link.external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls}>
        {label}
      </a>
    )
  }
  const internal = href.startsWith('/') ? `/${locale}${href}` : href
  return (
    <a href={internal} className={cls}>
      {label}
    </a>
  )
}

function phoneList(phones: string | string[] | null | undefined): string[] {
  if (!phones) return []
  return (Array.isArray(phones) ? phones : phones.split('\n')).map((p) => p.trim()).filter(Boolean)
}

export default async function SiteFooter({ locale }: Props) {
  const t = await getTranslations({ locale })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const id = identityFor(locale)
  const footer = await getFooter(locale)

  // Brand block — CMS value, else the built-in i18n defaults.
  const brandName = footer?.brandName || tSite('name')
  const brandTagline = footer?.brandTagline || tSite('tagline')
  const brandDescription = footer?.intro || t('footer.brandDescription')
  const copyright = footer?.copyrightLine || t('footer.copyright')

  // Link columns — CMS columns if present, else the built-in Sections/About/Ecosystem.
  const columns: FooterColumn[] =
    footer?.linkColumns && footer.linkColumns.length
      ? footer.linkColumns
      : [
          {
            heading: t('footer.sectionsHeading'),
            links: SECTIONS.map((s) => ({
              label: tNav(s.navKey as 'courtPractice'),
              href: s.hub[locale],
              external: false,
            })),
          },
          {
            heading: t('footer.aboutHeading'),
            links: [{ label: tNav('authors'), href: locale === 'en' ? '/authors' : '/tac-gia', external: false }],
          },
          {
            heading: t('footer.ecosystemHeading'),
            links: [
              { label: id.parentBrandLabel, href: id.parentBrandUrl, external: true },
              { label: 'luatsutructuyen.vn', href: 'https://luatsutructuyen.vn', external: true },
              { label: 'vothienhien.com', href: 'https://vothienhien.com', external: true },
              { label: 'law.org.vn', href: 'https://law.org.vn', external: true },
            ],
          },
        ]

  // Offices / address — CMS offices if present, else the canonical identity block.
  const offices: FooterOffice[] =
    footer?.offices && footer.offices.length
      ? footer.offices
      : [
          {
            label: locale === 'vi' ? 'Trụ sở chính' : 'Head Office',
            name: id.companyName,
            address: id.address,
            email: id.email,
            phones: id.phones.join('\n'),
          },
          {
            label: locale === 'vi' ? 'Chi nhánh' : 'Branch',
            name: id.branch.name,
            address: id.branch.address,
            email: '',
            phones: id.branch.phones.join('\n'),
          },
        ]

  return (
    <footer className="mt-32 bg-[var(--color-parchment)] border-t border-[var(--color-rule)]">
      {/* Ornate divider above the columns */}
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pt-20">
        <div className="editorial-divider" aria-hidden />
      </div>

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pb-14 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl text-[var(--color-burgundy)]">
            {brandName}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] italic text-lg text-[var(--color-charcoal)] leading-snug max-w-xs">
            {brandTagline}
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] max-w-xs">
            {brandDescription}
          </p>
        </div>

        {columns.map((col, ci) => (
          <div key={ci}>
            <h4 className="eyebrow text-[var(--color-burgundy)] mb-5">{col.heading}</h4>
            <ul className="space-y-3 text-sm font-[family-name:var(--font-lora)]">
              {(col.links ?? []).map((link, li) => (
                <li key={li}>
                  <FooterLinkItem link={link} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact / address block — locale-aware, CMS-editable (seeded from the
          canonical address.txt). */}
      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-8 grid gap-8 md:grid-cols-2 text-sm text-[var(--color-charcoal)] font-[family-name:var(--font-lora)]">
          {offices.map((office, oi) => {
            const phones = phoneList(office.phones)
            return (
              <div key={oi}>
                <p className="eyebrow text-[var(--color-burgundy)] mb-3">{office.label}</p>
                <p className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-ink)] mb-2">
                  {office.name}
                </p>
                <p className="text-[var(--color-ink-muted)] leading-relaxed">{office.address}</p>
                {office.email ? (
                  <p className="mt-2 text-[var(--color-ink-muted)]">
                    <a href={`mailto:${office.email}`} className="editorial-link hover:text-[var(--color-burgundy)]">
                      {office.email}
                    </a>
                  </p>
                ) : null}
                {phones.length ? (
                  <p className="mt-1 text-[var(--color-ink-muted)]">
                    {phones.map((p, i) => (
                      <span key={p}>
                        {i > 0 && <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>}
                        {p}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-6 text-xs text-[var(--color-ink-muted)] font-[family-name:var(--font-inter)]">
          <p className="uppercase tracking-[0.16em]">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
