import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import ArticleCard from './ArticleCard'

type SectionPathname =
  | '/thuc-tien-xet-xu/[slug]'
  | '/chien-luoc-ho-so/[slug]'
  | '/danh-gia-chung-cu/[slug]'
  | '/ky-nang-tranh-tung/[slug]'
  | '/goc-nhin-nghe-luat/[slug]'
  | '/binh-luan-ban-an/[slug]'

type Article = {
  id: number
  slug: string
  title: string
  excerpt?: string | null
  publishedDate?: string | null
  readingTime?: number | null
  author?: { name?: string } | null
  featuredImage?: { url?: string } | null
}

type Props = {
  locale: Locale
  articles: Article[]
  pathname: SectionPathname
  categoryName: string
}

export default async function RelatedRail({ locale, articles, pathname, categoryName }: Props) {
  if (!articles?.length) return null
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 mt-24 pt-14 border-t border-[var(--color-rule)]">
      <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl mb-10 text-[var(--color-ink)]">
        {tCommon('relatedArticles')}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {articles.map((a) => (
          <ArticleCard
            key={a.id}
            pathname={pathname}
            slug={a.slug}
            category={categoryName}
            title={a.title}
            excerpt={a.excerpt}
            authorName={a.author?.name}
            publishedDate={a.publishedDate}
            readingTime={a.readingTime}
            imageUrl={a.featuredImage?.url || null}
          />
        ))}
      </div>
    </section>
  )
}
