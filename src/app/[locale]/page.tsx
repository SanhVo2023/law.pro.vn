import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SECTIONS } from '@/lib/sections'
import { routing, type Locale } from '@/i18n/routing'
import {
  getHomeHeroMedia,
  getFeaturedHomepageArticle,
  listLatestArticles,
  listArticlesByCategorySlug,
} from '@/lib/queries'
import JsonLd from '@/components/seo/JsonLd'
import ArticleCard from '@/components/article/ArticleCard'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

const SECTION_PATHNAMES = {
  'court-practice':           '/thuc-tien-xet-xu/[slug]',
  'litigation-strategy':      '/chien-luoc-ho-so/[slug]',
  'evidence-assessment':      '/danh-gia-chung-cu/[slug]',
  'litigation-skills':        '/ky-nang-tranh-tung/[slug]',
  'professional-perspective': '/goc-nhin-nghe-luat/[slug]',
  'case-commentary':          '/binh-luan-ban-an/[slug]',
} as const

export default async function Home({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const [heroMedia, featuredArticle, latestArticles, sectionPreviews] = await Promise.all([
    getHomeHeroMedia(),
    getFeaturedHomepageArticle(locale as Locale),
    listLatestArticles(locale as Locale, 4),
    Promise.all(
      SECTIONS.map(async (s) => {
        const { articles } = await listArticlesByCategorySlug(
          // map ecosystem section key to category slug used in DB
          ({
            'court-practice': 'thuc-tien-xet-xu',
            'litigation-strategy': 'chien-luoc-ho-so',
            'evidence-assessment': 'danh-gia-chung-cu',
            'litigation-skills': 'ky-nang-tranh-tung',
            'professional-perspective': 'goc-nhin-nghe-luat',
            'case-commentary': 'binh-luan-ban-an',
          } as const)[s.key as keyof typeof SECTION_PATHNAMES],
          locale as Locale,
          1,
        )
        return { section: s, latest: articles[0] || null }
      }),
    ),
  ])

  const heroUrl =
    heroMedia && typeof heroMedia === 'object' && 'url' in heroMedia
      ? (heroMedia as { url?: string }).url ?? null
      : null

  // Build editor's-pick rail: latest articles excluding the featured one
  const editorsPick = latestArticles
    .filter((a) => !featuredArticle || a.id !== featuredArticle.id)
    .slice(0, 3)

  const featuredCategory =
    featuredArticle && typeof featuredArticle.category === 'object'
      ? (featuredArticle.category as { slug?: string; name?: string })
      : null
  const featuredImg =
    featuredArticle && typeof featuredArticle.featuredImage === 'object'
      ? (featuredArticle.featuredImage as { url?: string } | null)
      : null
  const featuredAuthor =
    featuredArticle && typeof featuredArticle.author === 'object'
      ? (featuredArticle.author as { name?: string } | null)
      : null

  const slugToPath: Record<string, (typeof SECTION_PATHNAMES)[keyof typeof SECTION_PATHNAMES]> = {
    'thuc-tien-xet-xu':   SECTION_PATHNAMES['court-practice'],
    'chien-luoc-ho-so':   SECTION_PATHNAMES['litigation-strategy'],
    'danh-gia-chung-cu':  SECTION_PATHNAMES['evidence-assessment'],
    'ky-nang-tranh-tung': SECTION_PATHNAMES['litigation-skills'],
    'goc-nhin-nghe-luat': SECTION_PATHNAMES['professional-perspective'],
    'binh-luan-ban-an':   SECTION_PATHNAMES['case-commentary'],
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: tSite('name'),
          url: `${SITE_URL}/${locale}`,
          description: tSite('description'),
          inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
          publisher: {
            '@type': 'Organization',
            name: 'Apolo Lawyers',
            url: 'https://vothienhien.com',
          },
        }}
      />

      {/* Cover hero — full-bleed editorial photograph */}
      <section className="relative">
        {heroUrl ? (
          <div className="relative w-full h-[78vh] min-h-[560px] max-h-[820px]">
            <Image src={heroUrl} alt="" fill sizes="100vw" priority className="object-cover" />
            <div className="hero-overlay" aria-hidden />
            <div className="absolute inset-0 flex flex-col">
              <div className="mx-auto max-w-screen-2xl w-full px-6 lg:px-12 pt-10 flex justify-end">
                <p className="eyebrow text-[var(--color-gold)]">
                  Vol. I · Issue 01 · April 2026
                </p>
              </div>
              <div className="flex-1 flex items-end">
                <div className="mx-auto max-w-screen-2xl w-full px-6 lg:px-12 pb-16 lg:pb-24 text-[var(--color-parchment)]">
                  <p className="eyebrow text-[var(--color-gold)] mb-7">{t('heroEyebrow')}</p>
                  <h1 className="font-[family-name:var(--font-cormorant)] text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.98] tracking-tight max-w-5xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
                    {t('heroTitle')}
                  </h1>
                  <div aria-hidden className="h-[2px] w-24 bg-[var(--color-gold)] mt-8" />
                  <p className="mt-7 max-w-2xl font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl leading-snug text-[var(--color-parchment)]/85">
                    {t('heroSubtitle')}
                  </p>
                  <Link
                    // @ts-expect-error pathnames keyed on VI
                    href={SECTIONS[0].hub.vi}
                    className="inline-flex items-center gap-3 mt-10 font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.16em] text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] pb-1 hover:text-[var(--color-parchment)] hover:border-[var(--color-parchment)] transition-colors"
                  >
                    {t('heroCta')} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback typographic hero (until home-hero-feature image is in R2)
          <div className="border-b border-[var(--color-rule)]">
            <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-20 lg:py-32 grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <p className="eyebrow mb-7">{t('heroEyebrow')}</p>
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] tracking-tight text-[var(--color-ink)]">
                  {t('heroTitle')}
                </h1>
                <div aria-hidden className="h-[2px] w-24 bg-[var(--color-gold)] mt-8" />
                <p className="mt-8 max-w-2xl text-lg lg:text-xl leading-[1.65] text-[var(--color-ink-muted)] font-[family-name:var(--font-cormorant)] italic">
                  {t('heroSubtitle')}
                </p>
                <div className="mt-10">
                  <Link
                    // @ts-expect-error pathnames keyed on VI
                    href={SECTIONS[0].hub.vi}
                    className="inline-flex items-center gap-3 eyebrow border-b-2 border-[var(--color-gold)] pb-1 hover:text-[var(--color-charcoal)] transition-colors"
                  >
                    {t('heroCta')} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              <aside className="lg:col-span-4 lg:border-l lg:border-[var(--color-rule)] lg:pl-10 self-end">
                <p className="eyebrow text-[var(--color-ink-muted)]">
                  Vol. I · Issue 01 · 2026
                </p>
                <p className="mt-3 font-[family-name:var(--font-cormorant)] italic text-xl text-[var(--color-charcoal)] leading-snug">
                  &ldquo;{tSite('tagline')}&rdquo;
                </p>
              </aside>
            </div>
          </div>
        )}
      </section>

      {/* Featured spotlight + Editor's pick rail */}
      {featuredArticle ? (
        <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-[var(--color-rule)] pb-4">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--color-ink)]">
              {t('featuredHeading')}
            </h2>
            <span className="eyebrow text-[var(--color-ink-muted)]">{t('latestHeading')}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Featured spotlight — left 8 cols */}
            <div className="lg:col-span-8">
              <ArticleCard
                pathname={
                  featuredCategory?.slug
                    ? slugToPath[featuredCategory.slug] || SECTION_PATHNAMES['court-practice']
                    : SECTION_PATHNAMES['court-practice']
                }
                slug={featuredArticle.slug}
                category={featuredCategory?.name || ''}
                title={featuredArticle.title}
                excerpt={featuredArticle.excerpt}
                authorName={featuredAuthor?.name}
                publishedDate={featuredArticle.publishedDate}
                readingTime={featuredArticle.readingTime}
                imageUrl={featuredImg?.url || null}
                variant="feature"
              />
            </div>

            {/* Editor's pick rail — right 4 cols, stacked */}
            <div className="lg:col-span-4 lg:border-l lg:border-[var(--color-rule)] lg:pl-12 space-y-8">
              {editorsPick.length === 0 ? (
                <p className="eyebrow text-[var(--color-ink-muted)]">
                  {locale === 'vi' ? 'Chưa có thêm bài viết.' : 'More analysis coming soon.'}
                </p>
              ) : null}
              {editorsPick.map((a, i) => {
                const cat = typeof a.category === 'object' ? (a.category as { slug?: string; name?: string }) : null
                const author = typeof a.author === 'object' ? (a.author as { name?: string } | null) : null
                const path = cat?.slug ? slugToPath[cat.slug] || SECTION_PATHNAMES['court-practice'] : SECTION_PATHNAMES['court-practice']
                return (
                  <Link
                    key={a.id}
                    href={{ pathname: path, params: { slug: a.slug } }}
                    className="group block"
                  >
                    {i > 0 ? (
                      <div aria-hidden className="h-px bg-[var(--color-rule)] -mt-4 mb-7" />
                    ) : null}
                    <p className="eyebrow text-[var(--color-burgundy)] mb-2">{cat?.name || ''}</p>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
                      <span className="editorial-link">{a.title}</span>
                    </h3>
                    <p className="mt-3 eyebrow text-[var(--color-ink-muted)] flex items-center gap-3">
                      {author?.name ? <span>{author.name}</span> : null}
                      {a.readingTime ? (
                        <>
                          <span aria-hidden className="opacity-50">·</span>
                          <span>{a.readingTime} min</span>
                        </>
                      ) : null}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <div className="editorial-divider" aria-hidden />

      {/* Sections grid — each card now shows the latest article title from that section */}
      <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-20">
        <div className="flex items-baseline justify-between mb-10 border-b border-[var(--color-rule)] pb-4">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--color-ink)]">
            {t('sectionsHeading')}
          </h2>
          <span className="eyebrow text-[var(--color-ink-muted)]">
            {SECTIONS.length} {locale === 'vi' ? 'chuyên mục' : 'sections'}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {sectionPreviews.map(({ section, latest }, i) => (
            <Link
              key={section.key}
              // @ts-expect-error — pathnames keyed on VI
              href={section.hub.vi}
              className="group border-t border-[var(--color-charcoal)] pt-5"
            >
              <div className="flex items-baseline justify-between mb-3">
                <p className="eyebrow text-[var(--color-burgundy)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                {latest?.readingTime ? (
                  <span className="eyebrow text-[var(--color-ink-muted)]">{latest.readingTime} min</span>
                ) : null}
              </div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
                <span className="editorial-link">{tNav(section.navKey as 'courtPractice')}</span>
              </h3>
              {latest ? (
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)] line-clamp-3 italic font-[family-name:var(--font-cormorant)]">
                  {locale === 'vi' ? 'Mới nhất: ' : 'Latest: '}
                  <span className="not-italic font-medium text-[var(--color-charcoal)]">
                    {latest.title}
                  </span>
                </p>
              ) : (
                <p className="mt-4 eyebrow text-[var(--color-ink-muted)]">
                  {locale === 'vi' ? 'Sắp ra mắt' : 'Coming soon'}
                </p>
              )}
              <p className="mt-6 eyebrow text-[var(--color-ink-muted)]">
                {locale === 'vi' ? 'Đọc chuyên mục →' : 'Read section →'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
