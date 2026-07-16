import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SECTIONS } from '@/lib/sections'
import { routing, type Locale } from '@/i18n/routing'
import {
  getFeaturedHomepageArticle,
  listLatestArticles,
  listArticlesByCategorySlug,
} from '@/lib/queries'
import JsonLd from '@/components/seo/JsonLd'
import Reveal from '@/components/ui/Reveal'
import { organizationSchema } from '@/lib/identity'
import { formatDate, readingTimeLabel } from '@/lib/format'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

// ISR (QA-LPRO-010): cache the homepage for an hour instead of SSR-ing
// (8 DB queries against the shared pooler) on every request.
export const revalidate = 3600

const SECTION_PATHNAMES = {
  'court-practice':           '/thuc-tien-xet-xu/[slug]',
  'litigation-strategy':      '/chien-luoc-ho-so/[slug]',
  'evidence-assessment':      '/danh-gia-chung-cu/[slug]',
  'litigation-skills':        '/ky-nang-tranh-tung/[slug]',
  'professional-perspective': '/goc-nhin-nghe-luat/[slug]',
  'case-commentary':          '/binh-luan-ban-an/[slug]',
} as const

const slugToPath: Record<string, (typeof SECTION_PATHNAMES)[keyof typeof SECTION_PATHNAMES]> = {
  'thuc-tien-xet-xu':   SECTION_PATHNAMES['court-practice'],
  'chien-luoc-ho-so':   SECTION_PATHNAMES['litigation-strategy'],
  'danh-gia-chung-cu':  SECTION_PATHNAMES['evidence-assessment'],
  'ky-nang-tranh-tung': SECTION_PATHNAMES['litigation-skills'],
  'goc-nhin-nghe-luat': SECTION_PATHNAMES['professional-perspective'],
  'binh-luan-ban-an':   SECTION_PATHNAMES['case-commentary'],
}

const SECTION_KEY_TO_SLUG = {
  'court-practice': 'thuc-tien-xet-xu',
  'litigation-strategy': 'chien-luoc-ho-so',
  'evidence-assessment': 'danh-gia-chung-cu',
  'litigation-skills': 'ky-nang-tranh-tung',
  'professional-perspective': 'goc-nhin-nghe-luat',
  'case-commentary': 'binh-luan-ban-an',
} as const

function mediaUrl(m: unknown): string | null {
  return m && typeof m === 'object' && 'url' in m ? ((m as { url?: string }).url ?? null) : null
}

export default async function Home({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const [featuredArticle, latestArticles, sectionPreviews] = await Promise.all([
    getFeaturedHomepageArticle(locale as Locale),
    listLatestArticles(locale as Locale, 5),
    Promise.all(
      SECTIONS.map(async (s) => {
        const { articles } = await listArticlesByCategorySlug(
          SECTION_KEY_TO_SLUG[s.key as keyof typeof SECTION_KEY_TO_SLUG],
          locale as Locale,
          1,
        )
        return { section: s, latest: articles[0] || null }
      }),
    ),
  ])

  // Latest rail: most recent, excluding the featured spotlight.
  const latest = latestArticles
    .filter((a) => !featuredArticle || a.id !== featuredArticle.id)
    .slice(0, 4)

  const featuredCategory =
    featuredArticle && typeof featuredArticle.category === 'object'
      ? (featuredArticle.category as { slug?: string; name?: string })
      : null
  const featuredImg = mediaUrl(featuredArticle?.featuredImage)
  const featuredAuthor =
    featuredArticle && typeof featuredArticle.author === 'object'
      ? (featuredArticle.author as { name?: string } | null)
      : null
  const featuredPath = featuredCategory?.slug
    ? slugToPath[featuredCategory.slug] || SECTION_PATHNAMES['court-practice']
    : SECTION_PATHNAMES['court-practice']

  // Hero CTA → the featured article if we have one, else the first section hub.
  const heroCtaHref = featuredArticle
    ? { pathname: featuredPath, params: { slug: featuredArticle.slug } }
    : (SECTIONS[0].hub.vi as never)

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
          publisher: organizationSchema(locale),
        }}
      />

      {/* 1 — Purpose hero. Value-prop text in a reading column, paired with a
            contained editorial image on the right (lg+). LCP-friendly: the
            headline is text; the image is sized, not full-bleed. */}
      <section className="wrap pt-12 lg:pt-16 pb-14 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-[var(--color-burgundy)]">{t('heroEyebrow')}</p>
            <div aria-hidden className="mt-5 h-px w-16 bg-[var(--color-gold)]" />
            <h1 className="mt-6 font-[family-name:var(--font-cormorant)] font-semibold text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem] text-[var(--color-ink)]">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-xl deck text-xl md:text-2xl">{t('heroSubtitle')}</p>
            <div className="mt-9">
              <Link
                href={heroCtaHref}
                className="inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.16em] text-[var(--color-burgundy)] border-b-2 border-[var(--color-gold)] pb-1 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
              >
                {t('heroCta')} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
              <Image
                src="/decor/home-hero.webp"
                alt=""
                fill
                sizes="(min-width:1024px) 38vw, 0px"
                priority
                className="object-cover"
              />
              <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-gold)]/15" />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Featured spotlight + Latest rail (with thumbnails). */}
      {featuredArticle ? (
        <section className="border-t border-[var(--color-line)]">
          <div className="wrap py-16 lg:py-20 grid lg:grid-cols-12 gap-x-12 gap-y-14">
            {/* Feature — dominant, contained 3:2 image */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-7">
                <span className="eyebrow">{t('featuredHeading')}</span>
                <span aria-hidden className="h-px flex-1 bg-[var(--color-line)]" />
              </div>
              <Reveal>
                <Link
                  href={{ pathname: featuredPath, params: { slug: featuredArticle.slug } }}
                  className="group block"
                >
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
                    {featuredImg ? (
                      <Image
                        src={featuredImg}
                        alt={featuredArticle.title}
                        fill
                        sizes="(min-width:1024px) 58vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div aria-hidden className="paper-grain absolute inset-0" />
                    )}
                  </div>
                  <p className="eyebrow text-[var(--color-burgundy)] mt-6 mb-3">
                    {featuredCategory?.name || ''}
                  </p>
                  <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
                    <span className="editorial-link">{featuredArticle.title}</span>
                  </h2>
                  {featuredArticle.excerpt ? (
                    <p className="mt-4 max-w-2xl text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                  ) : null}
                  {/* QA-LPRO-038/075: flex-wrap + nowrap tokens so items never
                      break mid-date/mid-name at narrow widths. */}
                  <p className="mt-5 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] flex items-center gap-x-3 gap-y-1 flex-wrap">
                    {featuredAuthor?.name ? <span className="whitespace-nowrap">{featuredAuthor.name}</span> : null}
                    {formatDate(featuredArticle.publishedDate, locale as Locale) ? (
                      <span className="whitespace-nowrap">
                        {featuredAuthor?.name ? <span aria-hidden className="opacity-50 mr-3">·</span> : null}
                        {formatDate(featuredArticle.publishedDate, locale as Locale)}
                      </span>
                    ) : null}
                    {readingTimeLabel(featuredArticle.readingTime, locale as Locale) ? (
                      <span className="whitespace-nowrap">
                        <span aria-hidden className="opacity-50 mr-3">·</span>
                        {readingTimeLabel(featuredArticle.readingTime, locale as Locale)}
                      </span>
                    ) : null}
                  </p>
                </Link>
              </Reveal>
            </div>

            {/* Latest — scannable list with thumbnails */}
            <aside className="lg:col-span-5 lg:border-l lg:border-[var(--color-line)] lg:pl-12">
              <div className="flex items-center gap-4 mb-7">
                <span className="eyebrow">{t('latestHeading')}</span>
                <span aria-hidden className="h-px flex-1 bg-[var(--color-line)]" />
              </div>
              {latest.length === 0 ? (
                <p className="eyebrow text-[var(--color-ink-muted)]">
                  {locale === 'vi' ? 'Chưa có thêm bài viết.' : 'More analysis coming soon.'}
                </p>
              ) : (
                <ul className="divide-y divide-[var(--color-line)]">
                  {latest.map((a) => {
                    const cat = typeof a.category === 'object' ? (a.category as { slug?: string; name?: string }) : null
                    const author = typeof a.author === 'object' ? (a.author as { name?: string } | null) : null
                    const path = cat?.slug ? slugToPath[cat.slug] || SECTION_PATHNAMES['court-practice'] : SECTION_PATHNAMES['court-practice']
                    const thumb = mediaUrl(a.featuredImage)
                    return (
                      <li key={a.id} className="py-5 first:pt-0">
                        <Link href={{ pathname: path, params: { slug: a.slug } }} className="group flex gap-4">
                          <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
                            {thumb ? (
                              <Image
                                src={thumb}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                              />
                            ) : (
                              <div aria-hidden className="paper-grain absolute inset-0" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="eyebrow text-[var(--color-burgundy)] mb-1.5">{cat?.name || ''}</p>
                            <h3 className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors line-clamp-2">
                              {a.title}
                            </h3>
                            <p className="mt-2 font-[family-name:var(--font-inter)] text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)] flex items-center gap-2.5">
                              {author?.name ? <span className="truncate">{author.name}</span> : null}
                              {author?.name && a.readingTime ? <span aria-hidden className="opacity-50">·</span> : null}
                              {a.readingTime ? (
                                <span className="shrink-0 whitespace-nowrap">{readingTimeLabel(a.readingTime, locale as Locale)}</span>
                              ) : null}
                            </p>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </aside>
          </div>
        </section>
      ) : null}

      {/* 3 — Browse by section. Parchment-tinted band; each card now leads with
            its section image so the grid reads as a designed page, not a list. */}
      <section className="border-t border-[var(--color-line)] bg-[var(--color-parchment)]">
        <div className="wrap py-16 lg:py-20">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow text-[var(--color-burgundy)]">{t('sectionsHeading')}</span>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl leading-tight text-[var(--color-ink)]">
              {t('sectionsIntro')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {sectionPreviews.map(({ section, latest: latestInSection }, i) => (
              <Reveal key={section.key} delay={(i % 3) * 0.05} className="h-full">
                <Link
                  // @ts-expect-error — pathnames keyed on VI
                  href={section.hub.vi}
                  className="group flex flex-col h-full"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)] mb-5">
                    <Image
                      src={`/decor/sec-${section.key}.webp`}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="eyebrow text-[var(--color-burgundy)]">{String(i + 1).padStart(2, '0')}</p>
                    {latestInSection?.readingTime ? (
                      <span className="eyebrow text-[var(--color-ink-muted)] whitespace-nowrap">
                        {readingTimeLabel(latestInSection.readingTime, locale as Locale)}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-[1.7rem] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
                    <span className="editorial-link">{tNav(section.navKey as 'courtPractice')}</span>
                  </h3>
                  {latestInSection ? (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)] line-clamp-2 flex-1">
                      <span className="text-[var(--color-ink-muted)]">{locale === 'vi' ? 'Mới nhất: ' : 'Latest: '}</span>
                      <span className="text-[var(--color-charcoal)] font-medium">{latestInSection.title}</span>
                    </p>
                  ) : (
                    <p className="mt-3 eyebrow text-[var(--color-ink-muted)] flex-1">
                      {locale === 'vi' ? 'Sắp ra mắt' : 'Coming soon'}
                    </p>
                  )}
                  <p className="mt-6 eyebrow text-[var(--color-ink-muted)] group-hover:text-[var(--color-burgundy)] transition-colors">
                    {locale === 'vi' ? 'Xem chuyên mục →' : 'View section →'}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Disclaimer (required at home per Mr Hien 17/5/2026), de-escalated to
            a slim muted strip so it informs without alarming. */}
      <section className="border-t border-[var(--color-line)]">
        <div className="wrap py-6 flex flex-col gap-1.5 sm:flex-row sm:gap-5 sm:items-baseline">
          <span className="eyebrow text-[var(--color-ink-muted)] shrink-0">{t('disclaimerEyebrow')}</span>
          <p className="max-w-4xl font-[family-name:var(--font-inter)] text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
            {t('disclaimerBody')}
          </p>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
