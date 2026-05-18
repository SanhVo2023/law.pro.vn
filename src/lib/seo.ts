/**
 * Shared SEO helpers — single source of truth for OG image extraction and
 * canonical URL composition. Every page route that ships metadata should
 * read from here so we don't re-implement the same logic in 14 files.
 *
 * Implementation note: the Media collection's afterRead hook (see
 * src/collections/Media.ts) already rewrites every media URL to the
 * canonical R2 CDN URL. So we can safely take `media.url` as-is and
 * feed it to `openGraph.images`.
 */
import { r2UrlForFilename } from './r2-media-map'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

type MediaLike =
  | { url?: string | null; width?: number | null; height?: number | null }
  | string
  | null
  | undefined

export function mediaUrl(media: MediaLike): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media.url || null
}

/** OG image array for a Media doc — falls back to null when missing. */
export function ogImageForMedia(media: MediaLike) {
  const url = mediaUrl(media)
  if (!url) return undefined
  const w = typeof media === 'object' && media?.width ? media.width : 1200
  const h = typeof media === 'object' && media?.height ? media.height : 630
  return [{ url, width: w, height: h }]
}

/** OG image array for a section, sourced from the R2 manifest by filename. */
export function ogImageForSection(filename: string) {
  const url = r2UrlForFilename(filename)
  if (!url) return undefined
  return [{ url, width: 1200, height: 630 }]
}

/** Absolute URL for a path on the site (used for `alternates.canonical`). */
export function absUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`
}

/** Canonical + hreflang alternates pair for a route with vi/en pathnames. */
export function alternatesFor(viPath: string, enPath: string, locale: 'vi' | 'en') {
  return {
    canonical: absUrl(`/${locale}${locale === 'vi' ? viPath : enPath}`),
    languages: {
      vi: absUrl(`/vi${viPath}`),
      en: absUrl(`/en${enPath}`),
    },
  }
}

import type { Metadata } from 'next'
import { sectionByKey } from './sections'
import { getTranslations } from 'next-intl/server'

type Locale = 'vi' | 'en'

/** Generate Metadata object for an article detail page. Pulls title +
 *  description from the article doc and OG image from its featuredImage
 *  (falling back to the section thumbnail if the article has none). */
type ArticleMediaLike = { url?: string | null; width?: number | null; height?: number | null }
type ArticleDocLike = {
  title?: string | null
  excerpt?: string | null
  featuredImage?: ArticleMediaLike | string | null
}
export async function articleMetadata(
  doc: ArticleDocLike,
  locale: Locale,
  hubViPath: string,
  hubEnPath: string,
  slug: string,
  sectionKey: string,
): Promise<Metadata> {
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const section = sectionByKey(sectionKey)
  const title = doc.title || ''
  const description = doc.excerpt || section?.description[locale] || ''
  let images = ogImageForMedia(doc.featuredImage as MediaLike)
  if (!images && section) images = ogImageForSection(section.thumbFilename)
  return {
    title,
    description,
    alternates: alternatesFor(`${hubViPath}/${slug}`, `${hubEnPath}/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: 'article',
      url: absUrl(`/${locale}${locale === 'vi' ? hubViPath : hubEnPath}/${slug}`),
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      siteName: tSite('name'),
      images,
    },
  }
}

/** Generate Metadata object for a section hub page. Pulls description + OG
 *  image from sections.ts SSOT. */
export async function hubMetadata(sectionKey: string, locale: Locale): Promise<Metadata> {
  const section = sectionByKey(sectionKey)
  if (!section) return {}
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  // navKey to translations key (camelCase) — matches the enum used in nav.
  const navKey = section.navKey as 'courtPractice'
  const title = `${tNav(navKey)} | ${tSite('name')}`
  const description = section.description[locale]
  const images = ogImageForSection(section.ogFilename)
  return {
    title,
    description,
    alternates: alternatesFor(section.hub.vi, section.hub.en, locale),
    openGraph: {
      title,
      description,
      url: absUrl(`/${locale}${locale === 'vi' ? section.hub.vi : section.hub.en}`),
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      siteName: tSite('name'),
      images,
    },
  }
}
