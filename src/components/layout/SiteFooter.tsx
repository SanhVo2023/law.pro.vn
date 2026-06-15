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

// Small gold line-icons for the contact block (matches the site's inline-SVG
// convention — no icon library). Decorative, so aria-hidden.
const ICON = 'shrink-0 text-[var(--color-gold)]'
function PinIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`${ICON} mt-[3px]`}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.1" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
      <rect x="3" y="5" width="18" height="14" rx="1.6" />
      <path d="m3.6 6.7 8.4 6 8.4-6" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={ICON}>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
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
    <footer className="mt-32 bg-[var(--color-parchment)] border-t border-[var(--color-rule)] text-[var(--color-charcoal)]">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
        {/* Ornate divider */}
        <div className="pt-14">
          <div className="editorial-divider" aria-hidden />
        </div>

        {/* Brand + link columns */}
        <div className="pt-12 pb-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="font-[family-name:var(--font-cormorant)] text-3xl leading-none text-[var(--color-burgundy)]">
              {brandName}
            </p>
            <p className="font-[family-name:var(--font-cormorant)] italic text-lg leading-snug text-[var(--color-charcoal)] max-w-xs">
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
      </div>

      {/* Contact / address block — locale-aware, CMS-editable (seeded from the
          canonical address.txt). Gold line-icons cue each detail. */}
      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {offices.map((office, oi) => {
            const phones = phoneList(office.phones)
            return (
              <div key={oi}>
                <h4 className="eyebrow text-[var(--color-burgundy)] mb-2.5">{office.label}</h4>
                <p className="font-[family-name:var(--font-cormorant)] text-xl leading-tight text-[var(--color-ink)] mb-4">
                  {office.name}
                </p>
                <ul className="space-y-2.5 text-sm font-[family-name:var(--font-lora)] text-[var(--color-ink-muted)]">
                  {office.address ? (
                    <li className="flex items-start gap-2.5">
                      <PinIcon />
                      <span className="leading-relaxed">{office.address}</span>
                    </li>
                  ) : null}
                  {office.email ? (
                    <li className="flex items-center gap-2.5">
                      <MailIcon />
                      <a href={`mailto:${office.email}`} className="editorial-link hover:text-[var(--color-burgundy)]">
                        {office.email}
                      </a>
                    </li>
                  ) : null}
                  {phones.length ? (
                    <li className="flex items-center gap-2.5">
                      <PhoneIcon />
                      <span>
                        {phones.map((p, i) => (
                          <span key={p}>
                            {i > 0 && <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>}
                            {p}
                          </span>
                        ))}
                      </span>
                    </li>
                  ) : null}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-ink-muted)] font-[family-name:var(--font-inter)]">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
