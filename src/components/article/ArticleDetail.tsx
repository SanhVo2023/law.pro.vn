import type { Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import ArticleHero from './ArticleHero'
import KeyTakeaways from './KeyTakeaways'
import LexicalContent from './LexicalContent'
import FootnoteList from './FootnoteList'
import AuthorBadge from './AuthorBadge'
import ReadingProgressBar from './ReadingProgressBar'
import RelatedRail from './RelatedRail'
import ConsultCta from './ConsultCta'
import { listRelatedArticles } from '@/lib/queries'
import JsonLd from '@/components/seo/JsonLd'
import { organizationSchema } from '@/lib/identity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

type Author = {
  id: number
  name?: string
  slug?: string
  title?: string
  photo?: { url?: string } | string | null
}

type CategoryRef = {
  id: number
  name?: string
  slug?: string
  slugEn?: string
}

export type ArticleDoc = {
  id: number
  title?: string
  slug?: string
  slugEn?: string
  excerpt?: string
  content?: { root?: { children?: unknown[] } } | null
  publishedDate?: string
  readingTime?: number | null
  contentType?: string
  category?: CategoryRef | number | null
  author?: Author | number | null
  featuredImage?: { url?: string; alt?: string } | string | null
  keyTakeaways?: { point?: string }[] | null
  footnotes?: { label?: string | null; body: string; url?: string | null }[] | null
}

type SectionPathname =
  | '/thuc-tien-xet-xu/[slug]'
  | '/chien-luoc-ho-so/[slug]'
  | '/danh-gia-chung-cu/[slug]'
  | '/ky-nang-tranh-tung/[slug]'
  | '/goc-nhin-nghe-luat/[slug]'
  | '/binh-luan-ban-an/[slug]'

type Props = {
  doc: ArticleDoc
  locale: Locale
  hubPathname: string
  articlePathname: SectionPathname
}

function isObj<T extends object>(v: unknown): v is T {
  return !!v && typeof v === 'object'
}

export default async function ArticleDetail({ doc, locale, hubPathname, articlePathname }: Props) {
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const author = isObj<Author>(doc.author) ? doc.author : null
  const category = isObj<CategoryRef>(doc.category) ? doc.category : null

  const related = category
    ? await listRelatedArticles(doc.id, category.id, locale, 3)
    : []

  const photoUrl =
    isObj<{ url?: string }>(author?.photo) ? author.photo.url : null

  const heroUrl =
    isObj<{ url?: string }>(doc.featuredImage) ? doc.featuredImage.url : null
  const heroAlt =
    isObj<{ alt?: string }>(doc.featuredImage) ? doc.featuredImage.alt : null

  const takeaways = (doc.keyTakeaways ?? []).map((t) => t?.point || '').filter(Boolean)

  const sectionPath = locale === 'vi' ? hubPathname : hubPathname // pathname rewrites handled by next-intl Link

  return (
    <>
      <ReadingProgressBar />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': doc.contentType === 'analysis' ? 'ScholarlyArticle' : 'Article',
            headline: doc.title || '',
            description: doc.excerpt || '',
            inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
            datePublished: doc.publishedDate,
            dateModified: doc.publishedDate,
            wordCount: undefined,
            author: author
              ? {
                  '@type': 'Person',
                  name: author.name || '',
                  url: author.slug ? `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}/${author.slug}` : undefined,
                }
              : undefined,
            publisher: organizationSchema(locale),
            isPartOf: {
              '@type': 'CollectionPage',
              name: category?.name || '',
            },
            url: `${SITE_URL}/${locale}${sectionPath}/${doc.slug}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
              {
                '@type': 'ListItem',
                position: 2,
                name: category?.name || '',
                item: `${SITE_URL}/${locale}${sectionPath}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: doc.title || '',
                item: `${SITE_URL}/${locale}${sectionPath}/${doc.slug}`,
              },
            ],
          },
        ]}
      />

      <article className="pb-24">
        <ArticleHero
          category={category?.name || ''}
          categoryHref={{ pathname: hubPathname }}
          title={doc.title || ''}
          excerpt={doc.excerpt}
          authorName={author?.name}
          authorTitle={author?.title}
          authorPhotoUrl={photoUrl}
          publishedDate={doc.publishedDate}
          readingTime={doc.readingTime}
          heroImageUrl={heroUrl}
          heroAlt={heroAlt}
        />

        <div className="mx-auto max-w-screen-md px-6 lg:px-0 pt-12">
          {takeaways.length > 0 ? (
            <KeyTakeaways title={tCommon('keyTakeaways')} points={takeaways} />
          ) : null}

          <div className="article-body relative">
            <LexicalContent data={doc.content as never} />
          </div>

          {doc.footnotes && doc.footnotes.length > 0 ? (
            <FootnoteList heading="Endnotes" footnotes={doc.footnotes} />
          ) : null}

          {author ? (
            <section className="mt-20">
              <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-burgundy)] mb-5">
                {tCommon('byAuthor', { name: '' }).replace(/^\s*/, '')} {author.name}
              </p>
              <AuthorBadge
                variant="card"
                name={author.name || ''}
                slug={author.slug || ''}
                title={author.title}
                photoUrl={photoUrl}
              />
            </section>
          ) : null}

          <ConsultCta locale={locale} />
        </div>

        <RelatedRail
          locale={locale}
          articles={related as never}
          pathname={articlePathname}
          categoryName={category?.name || ''}
        />
      </article>
    </>
  )
}
