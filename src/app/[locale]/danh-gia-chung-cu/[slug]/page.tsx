import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleBySlug } from '@/lib/queries'
import ArticleDetail from '@/components/article/ArticleDetail'
import { articleMetadata } from '@/lib/seo'

type Params = { locale: string; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) return {}
  return articleMetadata(
    doc as never,
    locale as Locale,
    '/danh-gia-chung-cu',
    '/evidence-assessment-vietnam',
    slug,
    'evidence-assessment',
  )
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) notFound()
  return <ArticleDetail doc={doc as never} locale={locale as Locale} hubPathname="/danh-gia-chung-cu" articlePathname="/danh-gia-chung-cu/[slug]" />
}
