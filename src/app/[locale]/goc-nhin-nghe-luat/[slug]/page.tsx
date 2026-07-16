import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleBySlug } from '@/lib/queries'
import ArticleDetail from '@/components/article/ArticleDetail'
import { articleMetadata } from '@/lib/seo'

type Params = { locale: string; slug: string }

// ISR (QA-LPRO-010/011): render on demand, then cache for an hour. Without
// this every article hit was a full SSR + DB round-trip (4-10s TTFB) and any
// pooler hiccup surfaced as a 500. Empty params = no build-time DB hammering;
// unknown slugs render once, then serve statically until revalidation.
export const revalidate = 3600
export const dynamicParams = true
export function generateStaticParams() {
  return []
}


export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) return {}
  return articleMetadata(
    doc as never,
    locale as Locale,
    '/goc-nhin-nghe-luat',
    '/professional-perspective',
    slug,
    'professional-perspective',
  )
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) notFound()
  return <ArticleDetail doc={doc as never} locale={locale as Locale} hubPathname="/goc-nhin-nghe-luat" articlePathname="/goc-nhin-nghe-luat/[slug]" />
}
