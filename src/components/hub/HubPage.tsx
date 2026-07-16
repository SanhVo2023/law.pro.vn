import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import JsonLd from '@/components/seo/JsonLd'
import { listArticlesByCategorySlug } from '@/lib/queries'
import ArticleCard from '@/components/article/ArticleCard'
import Reveal from '@/components/ui/Reveal'
import { formatDate, readingTimeLabel } from '@/lib/format'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

type SectionPathname =
  | '/thuc-tien-xet-xu/[slug]'
  | '/chien-luoc-ho-so/[slug]'
  | '/danh-gia-chung-cu/[slug]'
  | '/ky-nang-tranh-tung/[slug]'
  | '/goc-nhin-nghe-luat/[slug]'
  | '/binh-luan-ban-an/[slug]'

type SectionKey =
  | 'court-practice'
  | 'litigation-strategy'
  | 'evidence-assessment'
  | 'litigation-skills'
  | 'professional-perspective'
  | 'case-commentary'

type Props = {
  locale: Locale
  navKey:
    | 'courtPractice'
    | 'litigationStrategy'
    | 'evidenceAssessment'
    | 'litigationSkills'
    | 'professionalPerspective'
    | 'caseCommentary'
  hubVi: string
  hubEn: string
  categorySlug: string
  sectionKey: SectionKey
  articlePathname: SectionPathname
  description: { vi: string; en: string }
}

export default async function HubPage({
  locale,
  navKey,
  hubVi,
  hubEn,
  categorySlug,
  sectionKey,
  articlePathname,
  description,
}: Props) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const sectionTitle = tNav(navKey)
  const path = locale === 'vi' ? hubVi : hubEn

  const { articles } = await listArticlesByCategorySlug(categorySlug, locale, 24)
  const [leadArticle, ...restArticles] = articles

  const leadAuthor = leadArticle && typeof leadArticle.author === 'object' ? leadArticle.author : null
  const leadImg =
    leadArticle && typeof leadArticle.featuredImage === 'object'
      ? (leadArticle.featuredImage as { url?: string } | null)
      : null

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: sectionTitle,
          description: description[locale],
          url: `${SITE_URL}/${locale}${path}`,
          inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: tNav('home'), item: `${SITE_URL}/${locale}` },
            { '@type': 'ListItem', position: 2, name: sectionTitle, item: `${SITE_URL}/${locale}${path}` },
          ],
        }}
      />

      {/* Section header — typographic, count folded in, with a restrained
          cinematic banner (contained strip, not a full-bleed mega-hero). */}
      <header className="border-b border-[var(--color-line)]">
        <div className="wrap pt-14 lg:pt-20 pb-9">
          <Link
            href="/"
            className="inline-block eyebrow text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] transition-colors mb-7"
          >
            ← {tNav('home')}
          </Link>
          <div aria-hidden className="h-px w-16 bg-[var(--color-gold)] mb-7" />
          <h1 className="font-[family-name:var(--font-cormorant)] font-semibold text-[2.5rem] sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-[var(--color-ink)]">
            {sectionTitle}
          </h1>
          <p className="mt-6 max-w-3xl deck text-xl md:text-2xl">{description[locale]}</p>
          <p className="mt-7 eyebrow text-[var(--color-ink-muted)]">
            <span className="text-[var(--color-burgundy)]">{articles.length}</span>{' '}
            {locale === 'vi' ? 'phân tích' : articles.length === 1 ? 'analysis' : 'analyses'}
          </p>
        </div>
        <div className="wrap pb-12 lg:pb-14">
          <div className="relative w-full aspect-[21/9] max-h-[380px] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
            <Image
              src={`/decor/sec-${sectionKey}.webp`}
              alt=""
              fill
              sizes="(min-width:1024px) 1120px, 100vw"
              priority
              className="object-cover"
            />
            <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-gold)]/15" />
          </div>
        </div>
      </header>

      <section className="wrap py-14 lg:py-16">
        {articles.length === 0 ? (
          <p className="eyebrow text-[var(--color-ink-muted)]">{tCommon('notFound')}</p>
        ) : (
          <div className="space-y-14">
            {/* Lead — horizontal feature: contained image beside the headline,
                so the image stays restrained instead of dominating the page. */}
            {leadArticle ? (
              <Reveal>
                <Link
                  href={{ pathname: articlePathname, params: { slug: leadArticle.slug } }}
                  className="group grid md:grid-cols-2 gap-8 lg:gap-10 items-center border-b border-[var(--color-line)] pb-14"
                >
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)] order-1">
                    {leadImg?.url ? (
                      <Image
                        src={leadImg.url}
                        alt={leadArticle.title}
                        fill
                        sizes="(min-width:768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div aria-hidden className="paper-grain absolute inset-0" />
                    )}
                  </div>
                  <div className="order-2">
                    <p className="eyebrow text-[var(--color-burgundy)] mb-3">
                      {locale === 'vi' ? 'Bài mới nhất' : 'Latest'}
                    </p>
                    <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl leading-[1.1] text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
                      <span className="editorial-link">{leadArticle.title}</span>
                    </h2>
                    {leadArticle.excerpt ? (
                      <p className="mt-4 text-[var(--color-ink-muted)] leading-relaxed line-clamp-3">
                        {leadArticle.excerpt}
                      </p>
                    ) : null}
                    <p className="mt-5 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] flex items-center gap-x-3 gap-y-1 flex-wrap">
                      {leadAuthor?.name ? <span className="whitespace-nowrap">{leadAuthor.name}</span> : null}
                      {formatDate(leadArticle.publishedDate, locale) ? (
                        <span className="whitespace-nowrap">
                          {leadAuthor?.name ? <span aria-hidden className="opacity-50 mr-3">·</span> : null}
                          {formatDate(leadArticle.publishedDate, locale)}
                        </span>
                      ) : null}
                      {readingTimeLabel(leadArticle.readingTime, locale) ? (
                        <span className="whitespace-nowrap">
                          {leadAuthor?.name || formatDate(leadArticle.publishedDate, locale) ? (
                            <span aria-hidden className="opacity-50 mr-3">·</span>
                          ) : null}
                          {readingTimeLabel(leadArticle.readingTime, locale)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ) : null}

            {/* Even 3-up grid */}
            {restArticles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                {restArticles.map((a, i) => {
                  const author = typeof a.author === 'object' ? a.author : null
                  const img = typeof a.featuredImage === 'object' ? a.featuredImage : null
                  return (
                    <Reveal key={a.id} delay={(i % 3) * 0.05} className="h-full">
                      <ArticleCard
                        pathname={articlePathname}
                        slug={a.slug}
                        category={sectionTitle}
                        title={a.title}
                        excerpt={a.excerpt}
                        authorName={author?.name}
                        publishedDate={a.publishedDate}
                        readingTime={a.readingTime}
                        imageUrl={(img as { url?: string } | null)?.url || null}
                        locale={locale}
                      />
                    </Reveal>
                  )
                })}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}
