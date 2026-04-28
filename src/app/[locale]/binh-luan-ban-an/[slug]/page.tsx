import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleBySlug } from '@/lib/queries'
import ArticleDetail from '@/components/article/ArticleDetail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

type Params = { locale: string; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) return {}
  return {
    title: doc.title || '',
    description: doc.excerpt || '',
    alternates: {
      canonical: `${SITE_URL}/${locale}/binh-luan-ban-an/${slug}`,
      languages: {
        vi: `${SITE_URL}/vi/binh-luan-ban-an/${slug}`,
        en: `${SITE_URL}/en/case-commentary-vietnam/${slug}`,
      },
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const doc = await getArticleBySlug(slug, locale as Locale)
  if (!doc) notFound()
  return <ArticleDetail doc={doc as never} locale={locale as Locale} hubPathname="/binh-luan-ban-an" articlePathname="/binh-luan-ban-an/[slug]" />
}
