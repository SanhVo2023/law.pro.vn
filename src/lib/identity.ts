/**
 * Canonical Apolo Lawyers identity strings.
 *
 * Source of truth: workspace-root `address.txt` (Mr Hien, 2026-05-11
 * post-2025 administrative-merger official text). Anything user-facing
 * — footer, contact page, Organization JSON-LD, OG metadata — must read
 * from here rather than hand-writing the address inline. No abbreviation
 * drift (e.g., do NOT shorten "TP. Hồ Chí Minh" to "TP.HCM").
 *
 * Parent-brand rule (Mr Hien, Phase 1 ecosystem Issue 13):
 *   - VN locale content → apolo.com.vn
 *   - EN locale content → apololawyers.com
 *   - The two parent-brand sites MUST NOT cross-link.
 *
 * East Saigon branch is EN-only per Hien — branch surfaced on EN locale
 * only.
 */
import type { Locale } from '@/i18n/routing'

export const APOLO_IDENTITY = {
  vi: {
    companyName: 'Công ty Luật Apolo Lawyers',
    companyNameFull:
      'Công ty Luật Apolo Lawyers, thuộc Đoàn Luật sư TP. Hồ Chí Minh, trực thuộc Liên đoàn Luật sư Việt Nam',
    address: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, TP. Hồ Chí Minh',
    phones: ['(028) 66.701.709', '0908.043.086'],
    callCenter: '0903.419.479',
    email: 'contact@apolo.com.vn',
    parentBrandUrl: 'https://www.apolo.com.vn',
    parentBrandLabel: 'apolo.com.vn',
  },
  en: {
    companyName: 'APOLO LAWYERS - Solicitors & Litigators',
    companyNameFull:
      'APOLO LAWYERS - Solicitors & Litigators, a law practice organization belonging to the Ho Chi Minh City Bar Association, under the Vietnam Bar Federation',
    address: '108 Tran Dinh Xu Street, Cau Ong Lanh Ward, Ho Chi Minh City, Vietnam',
    phones: ['(+8428) 66.701.709', '(+84) 908.043.086'],
    hotline: '(+84) 903.600.347',
    callCenter: '(+84) 903.419.479',
    email: 'contact@apolo.com.vn',
    parentBrandUrl: 'https://www.apololawyers.com',
    parentBrandLabel: 'apololawyers.com',
    branch: {
      name: 'EAST SAI GON BRANCH - APOLO LAWYERS LAWFIRM',
      address:
        '9th/F, Tower K&M Building, 33 Ung Van Khiem Street, Thanh My Tay Ward, Ho Chi Minh City, Vietnam',
      phones: ['(+8428) 35.059.349', '(+84) 908.097.068'],
      hotline: '(+84) 979.48.98.79',
    },
  },
} as const

export function identityFor(locale: Locale): typeof APOLO_IDENTITY.vi | typeof APOLO_IDENTITY.en {
  return locale === 'en' ? APOLO_IDENTITY.en : APOLO_IDENTITY.vi
}

/** Schema.org Organization fragment for the firm, locale-aware. */
export function organizationSchema(locale: Locale) {
  const id = identityFor(locale)
  return {
    '@type': 'Organization' as const,
    name: id.companyName,
    legalName: id.companyNameFull,
    url: id.parentBrandUrl,
    email: id.email,
    telephone: id.phones[0],
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: id.address.split(',')[0]?.trim(),
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
  }
}
