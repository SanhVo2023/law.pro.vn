import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
        ),
      },
    })

    for (const s of SECTIONS) {
      entries.push({
        url: `${SITE_URL}/${locale}${locale === 'vi' ? s.hub.vi : s.hub.en}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            vi: `${SITE_URL}/vi${s.hub.vi}`,
            en: `${SITE_URL}/en${s.hub.en}`,
          },
        },
      })
    }

    entries.push({
      url: `${SITE_URL}/${locale}${locale === 'vi' ? '/tac-gia' : '/authors'}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: { vi: `${SITE_URL}/vi/tac-gia`, en: `${SITE_URL}/en/authors` },
      },
    })
  }

  return entries
}
