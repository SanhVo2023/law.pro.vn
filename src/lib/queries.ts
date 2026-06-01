import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/routing'

export async function getArticleBySlug(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    locale,
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function listArticlesByCategorySlug(
  categorySlug: string,
  locale: Locale,
  limit = 12,
) {
  const payload = await getPayloadClient()
  const cat = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale,
    depth: 0,
    limit: 1,
  })
  const category = cat.docs[0]
  if (!category) return { category: null, articles: [] as Awaited<ReturnType<typeof payload.find>>['docs'] }

  const articles = await payload.find({
    collection: 'articles',
    where: { category: { equals: category.id } },
    locale,
    depth: 1,
    limit,
    sort: '-publishedDate',
  })
  return { category, articles: articles.docs }
}

export async function listLatestArticles(locale: Locale, limit = 6) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    locale,
    depth: 1,
    limit,
    sort: '-publishedDate',
  })
  return res.docs
}

export async function listRelatedArticles(
  excludeId: number,
  categoryId: number,
  locale: Locale,
  limit = 3,
) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { id: { not_equals: excludeId } },
        { category: { equals: categoryId } },
      ],
    },
    locale,
    depth: 1,
    limit,
    sort: '-publishedDate',
  })
  return res.docs
}

export async function getMediaByFilenamePrefix(prefix: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'media',
    where: { filename: { like: prefix } },
    depth: 0,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function getHubHeroMedia(sectionKey: string) {
  return getMediaByFilenamePrefix(`hero-${sectionKey}`)
}

export async function getHomeHeroMedia() {
  return getMediaByFilenamePrefix('home-hero-feature')
}

export async function getFeaturedHomepageArticle(locale: Locale) {
  const payload = await getPayloadClient()
  // Try the FeaturedContent global first
  try {
    const featured = await payload.findGlobal({
      slug: 'featured-content',
      depth: 2,
      locale,
    })
    const heroId =
      typeof featured?.heroArticle === 'object'
        ? (featured.heroArticle as { id?: number } | null)?.id
        : (featured?.heroArticle as number | undefined)
    if (heroId) {
      const article = await payload.findByID({
        collection: 'articles',
        id: heroId,
        locale,
        depth: 2,
      })
      if (article) return article
    }
  } catch {
    // global may be empty — fall through
  }
  // Fallback: most recent article
  const recent = await payload.find({
    collection: 'articles',
    locale,
    depth: 2,
    limit: 1,
    sort: '-publishedDate',
  })
  return recent.docs[0] ?? null
}

export async function listAuthors(locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'authors',
    locale,
    depth: 1,
    limit: 50,
    sort: 'name',
  })
  return res.docs
}

export async function getAuthorBySlug(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'authors',
    where: { slug: { equals: slug } },
    locale,
    depth: 1,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function listArticlesByAuthorId(authorId: number, locale: Locale, limit = 24) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { author: { equals: authorId } },
    locale,
    depth: 1,
    limit,
    sort: '-publishedDate',
  })
  return res.docs
}

export async function listAllArticleSlugs() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    locale: 'all' as never,
    // depth:1 so `category` comes back as an object (we need its slug for sitemap).
    depth: 1,
    limit: 1000,
  })
  return res.docs
}

// ---- Footer global (CMS-editable footer) ----
// Local shapes mirror src/globals/Footer.ts. Typed here (rather than relying on
// the generated payload-types.ts) so the footer can ship without regenerating
// types against the pooled DB. SiteFooter.tsx applies built-in fallbacks.
export type FooterLink = { label?: string | null; href?: string | null; external?: boolean | null }
export type FooterColumn = { heading?: string | null; links?: FooterLink[] | null }
export type FooterOffice = {
  label?: string | null
  name?: string | null
  address?: string | null
  email?: string | null
  phones?: string | null
}
export type FooterData = {
  brandName?: string | null
  brandTagline?: string | null
  intro?: string | null
  linkColumns?: FooterColumn[] | null
  offices?: FooterOffice[] | null
  copyrightLine?: string | null
}

export async function getFooter(locale: Locale): Promise<FooterData | null> {
  try {
    const payload = await getPayloadClient()
    const footer = await payload.findGlobal({ slug: 'footer', locale, depth: 0 })
    return (footer ?? null) as unknown as FooterData | null
  } catch {
    // Global unreadable (e.g. schema not yet synced) — let the footer fall back.
    return null
  }
}
