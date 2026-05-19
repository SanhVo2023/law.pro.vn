import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import JsonLd from '@/components/seo/JsonLd'
import { listArticlesByCategorySlug, getHubHeroMedia } from '@/lib/queries'
import ArticleCard from '@/components/article/ArticleCard'

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

  const [{ articles }, hubMedia] = await Promise.all([
    listArticlesByCategorySlug(categorySlug, locale, 24),
    getHubHeroMedia(sectionKey),
  ])

  const hubHeroUrl =
    hubMedia && typeof hubMedia === 'object' && 'url' in hubMedia
      ? (hubMedia as { url?: string }).url ?? null
      : null

  const [leadArticle, ...restArticles] = articles

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

      {/* Hub hero — photograph if available, typographic if not */}
      {hubHeroUrl ? (
        <section className="relative">
          <div className="relative w-full h-[44vh] min-h-[360px] max-h-[460px]">
            <Image
              src={hubHeroUrl}
              alt={sectionTitle}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="hero-overlay" aria-hidden />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pb-12 lg:pb-16 text-[var(--color-parchment)]">
                <Link
                  href="/"
                  className="inline-block eyebrow text-[var(--color-gold)] hover:text-[var(--color-parchment)] transition-colors mb-5"
                >
                  ← {tNav('home')}
                </Link>
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-4xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
                  {sectionTitle}
                </h1>
                <p className="mt-5 max-w-2xl font-[family-name:var(--font-cormorant)] italic text-lg md:text-xl leading-snug text-[var(--color-parchment)]/85">
                  {description[locale]}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-[var(--color-rule)]">
          <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pt-16 lg:pt-24 pb-14 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-9">
              <Link href="/" className="inline-block eyebrow text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] mb-7">
                ← {tNav('home')}
              </Link>
              <div aria-hidden className="h-px w-16 bg-[var(--color-gold)] mb-7" />
              <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-[var(--color-ink)]">
                {sectionTitle}
              </h1>
              <p className="mt-7 max-w-3xl font-[family-name:var(--font-cormorant)] italic text-xl lg:text-2xl leading-[1.5] text-[var(--color-charcoal)]">
                {description[locale]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Section meta strip */}
      <div className="border-b border-[var(--color-rule)] bg-[var(--color-parchment)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[var(--color-ink-muted)] font-[family-name:var(--font-inter)]">
          <span>
            <span className="text-[var(--color-burgundy)] font-medium">{articles.length}</span>{' '}
            {locale === 'vi' ? 'phân tích' : 'analyses'}
            <span aria-hidden className="mx-2 text-[var(--color-gold)]">·</span>
            {locale === 'vi' ? 'biên tập bởi ban biên tập' : 'curated by the editorial team'}
          </span>
          <span className="hidden md:inline">{locale === 'vi' ? 'Cập nhật hàng tuần' : 'Updated weekly'}</span>
        </div>
      </div>

      <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-16">
        {articles.length === 0 ? (
          <p className="font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            {tCommon('notFound')}
          </p>
        ) : (
          <div className="space-y-16">
            {/* Lead feature article (if exists) */}
            {leadArticle ? (
              <div className="border-b border-[var(--color-rule)] pb-14">
                {(() => {
                  const author = typeof leadArticle.author === 'object' ? leadArticle.author : null
                  const img = typeof leadArticle.featuredImage === 'object' ? leadArticle.featuredImage : null
                  return (
                    <ArticleCard
                      pathname={articlePathname}
                      slug={leadArticle.slug}
                      category={sectionTitle}
                      title={leadArticle.title}
                      excerpt={leadArticle.excerpt}
                      authorName={author?.name}
                      publishedDate={leadArticle.publishedDate}
                      readingTime={leadArticle.readingTime}
                      imageUrl={(img as { url?: string } | null)?.url || null}
                      variant="feature"
                    />
                  )
                })()}
              </div>
            ) : null}

            {/* Remaining articles in 3-up grid */}
            {restArticles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                {restArticles.map((a) => {
                  const author = typeof a.author === 'object' ? a.author : null
                  const img = typeof a.featuredImage === 'object' ? a.featuredImage : null
                  return (
                    <ArticleCard
                      key={a.id}
                      pathname={articlePathname}
                      slug={a.slug}
                      category={sectionTitle}
                      title={a.title}
                      excerpt={a.excerpt}
                      authorName={author?.name}
                      publishedDate={a.publishedDate}
                      readingTime={a.readingTime}
                      imageUrl={(img as { url?: string } | null)?.url || null}
                    />
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
