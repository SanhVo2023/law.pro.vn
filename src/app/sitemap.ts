import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import { listAllArticleSlugs, listAuthors } from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

// Map category slug (== sectionKey-like VI slug) → SECTIONS entry so we
// can build the right hub prefix per locale.
const CATEGORY_TO_SECTION: Record<string, (typeof SECTIONS)[number]> = Object.fromEntries(
  SECTIONS.map((s) => [s.hub.vi.replace(/^\//, ''), s]),
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // 1. Home + 6 hubs + authors-index — per locale
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

  // 2. Articles — one entry per (locale, article).
  try {
    const articles = await listAllArticleSlugs()
    for (const a of articles) {
      const slug = (a as { slug?: string }).slug
      const updated = (a as { updatedAt?: string }).updatedAt
      const catId = (a as { category?: number | { slug?: string } }).category
      const catSlug =
        typeof catId === 'object' ? catId?.slug : undefined
      // category in `depth=0` returns the id; we don't have the slug here.
      // Fall back to scanning each section.
      const section = catSlug
        ? CATEGORY_TO_SECTION[catSlug]
        : SECTIONS.find((s) =>
            s.hub.vi.replace(/^\//, '') === (a as { categorySlug?: string }).categorySlug,
          )
      if (!slug || !section) continue
      for (const locale of routing.locales) {
        entries.push({
          url: `${SITE_URL}/${locale}${locale === 'vi' ? section.hub.vi : section.hub.en}/${slug}`,
          lastModified: updated ? new Date(updated) : now,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              vi: `${SITE_URL}/vi${section.hub.vi}/${slug}`,
              en: `${SITE_URL}/en${section.hub.en}/${slug}`,
            },
          },
        })
      }
    }
  } catch {
    // Sitemap should still ship the static routes even if DB read fails.
  }

  // 3. Authors — per author × locale.
  try {
    const authors = await listAuthors('vi')
    for (const author of authors) {
      const slug = (author as { slug?: string }).slug
      if (!slug) continue
      for (const locale of routing.locales) {
        entries.push({
          url: `${SITE_URL}/${locale}${locale === 'vi' ? '/tac-gia' : '/authors'}/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: {
            languages: {
              vi: `${SITE_URL}/vi/tac-gia/${slug}`,
              en: `${SITE_URL}/en/authors/${slug}`,
            },
          },
        })
      }
    }
  } catch {
    // ignore
  }

  return entries
}
