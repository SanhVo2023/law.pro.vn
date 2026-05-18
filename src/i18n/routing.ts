import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    // /tim-kiem (search) and /chu-de (topics) were declared but never
    // implemented — removed from routing so misuse fails at build time.
    '/tac-gia': { vi: '/tac-gia', en: '/authors' },
    '/tac-gia/[slug]': { vi: '/tac-gia/[slug]', en: '/authors/[slug]' },
    '/thuc-tien-xet-xu': {
      vi: '/thuc-tien-xet-xu',
      en: '/court-practice-vietnam',
    },
    '/thuc-tien-xet-xu/[slug]': {
      vi: '/thuc-tien-xet-xu/[slug]',
      en: '/court-practice-vietnam/[slug]',
    },
    '/chien-luoc-ho-so': {
      vi: '/chien-luoc-ho-so',
      en: '/litigation-strategy-vietnam',
    },
    '/chien-luoc-ho-so/[slug]': {
      vi: '/chien-luoc-ho-so/[slug]',
      en: '/litigation-strategy-vietnam/[slug]',
    },
    '/danh-gia-chung-cu': {
      vi: '/danh-gia-chung-cu',
      en: '/evidence-assessment-vietnam',
    },
    '/danh-gia-chung-cu/[slug]': {
      vi: '/danh-gia-chung-cu/[slug]',
      en: '/evidence-assessment-vietnam/[slug]',
    },
    '/ky-nang-tranh-tung': {
      vi: '/ky-nang-tranh-tung',
      en: '/procedural-practice-vietnam',
    },
    '/ky-nang-tranh-tung/[slug]': {
      vi: '/ky-nang-tranh-tung/[slug]',
      en: '/procedural-practice-vietnam/[slug]',
    },
    '/goc-nhin-nghe-luat': {
      vi: '/goc-nhin-nghe-luat',
      en: '/professional-perspective',
    },
    '/goc-nhin-nghe-luat/[slug]': {
      vi: '/goc-nhin-nghe-luat/[slug]',
      en: '/professional-perspective/[slug]',
    },
    '/binh-luan-ban-an': {
      vi: '/binh-luan-ban-an',
      en: '/case-commentary-vietnam',
    },
    '/binh-luan-ban-an/[slug]': {
      vi: '/binh-luan-ban-an/[slug]',
      en: '/case-commentary-vietnam/[slug]',
    },
  },
})

export type Locale = (typeof routing.locales)[number]

export const SECTION_KEYS = [
  'thuc-tien-xet-xu',
  'chien-luoc-ho-so',
  'danh-gia-chung-cu',
  'ky-nang-tranh-tung',
  'goc-nhin-nghe-luat',
  'binh-luan-ban-an',
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]
