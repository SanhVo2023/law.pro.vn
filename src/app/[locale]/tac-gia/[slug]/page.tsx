import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getAuthorBySlug, listArticlesByAuthorId } from '@/lib/queries'
import LexicalContent from '@/components/article/LexicalContent'
import ArticleCard from '@/components/article/ArticleCard'
import Reveal from '@/components/ui/Reveal'
import JsonLd from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

type Params = { locale: string; slug: string }

const SECTION_PATHNAMES: Record<string, '/thuc-tien-xet-xu/[slug]' | '/chien-luoc-ho-so/[slug]' | '/danh-gia-chung-cu/[slug]' | '/ky-nang-tranh-tung/[slug]' | '/goc-nhin-nghe-luat/[slug]' | '/binh-luan-ban-an/[slug]'> = {
  'thuc-tien-xet-xu':   '/thuc-tien-xet-xu/[slug]',
  'chien-luoc-ho-so':   '/chien-luoc-ho-so/[slug]',
  'danh-gia-chung-cu':  '/danh-gia-chung-cu/[slug]',
  'ky-nang-tranh-tung': '/ky-nang-tranh-tung/[slug]',
  'goc-nhin-nghe-luat': '/goc-nhin-nghe-luat/[slug]',
  'binh-luan-ban-an':   '/binh-luan-ban-an/[slug]',
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const author = await getAuthorBySlug(slug, locale as Locale)
  if (!author) return {}
  return {
    title: author.name,
    description: author.title || undefined,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}/${slug}`,
      languages: {
        vi: `${SITE_URL}/vi/tac-gia/${slug}`,
        en: `${SITE_URL}/en/authors/${slug}`,
      },
    },
  }
}

export default async function AuthorProfile({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const author = await getAuthorBySlug(slug, locale as Locale)
  if (!author) notFound()

  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const articles = await listArticlesByAuthorId(Number(author.id), locale as Locale, 24)
  const photo = typeof author.photo === 'object' ? author.photo : null

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.name,
            jobTitle: author.title || undefined,
            url: `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}/${slug}`,
            email: author.email || undefined,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              name: author.name,
            },
            inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
            url: `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}/${slug}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tNav('home'), item: `${SITE_URL}/${locale}` },
              {
                '@type': 'ListItem',
                position: 2,
                name: tNav('authors'),
                item: `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: author.name,
                item: `${SITE_URL}/${locale}/${locale === 'vi' ? 'tac-gia' : 'authors'}/${slug}`,
              },
            ],
          },
        ]}
      />

      <section className="border-b border-[var(--color-line)]">
        <div className="wrap pt-16 lg:pt-24 pb-14 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            {photo?.url ? (
              <Image
                src={photo.url}
                alt=""
                width={320}
                height={320}
                className="w-52 h-52 md:w-60 md:h-60 lg:w-full lg:h-auto aspect-square object-cover rounded-full lg:rounded-none ring-1 ring-[var(--color-rule)]"
              />
            ) : (
              <div
                aria-hidden
                className="w-52 h-52 md:w-60 md:h-60 lg:w-full lg:aspect-square rounded-full lg:rounded-none bg-[var(--color-burgundy)]/[0.06] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-7xl text-[var(--color-burgundy)]/40"
              >
                {author.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .slice(-2)
                  .join('')}
              </div>
            )}
          </div>

          <div className="lg:col-span-9">
            <Link
              href="/tac-gia"
              className="inline-block font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] mb-6"
            >
              ← {tNav('authors')}
            </Link>
            <h1 className="font-[family-name:var(--font-cormorant)] font-semibold text-5xl md:text-6xl tracking-tight text-[var(--color-ink)] leading-tight">
              {author.name}
            </h1>
            {author.title ? (
              <p className="mt-4 font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.18em] text-[var(--color-burgundy)]">
                {author.title}
              </p>
            ) : null}

            {/* Credentials + expertise lists removed per Mr Hien 17/5/2026 —
                "Bỏ dòng thẻ luật sư và thạc sỹ luật". CMS fields kept for archive. */}

            <div className="mt-8 max-w-3xl prose-magazine">
              <LexicalContent data={author.bio as never} />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-10 border-b border-[var(--color-line)] pb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--color-ink)]">
            {locale === 'vi' ? 'Bài viết đã đăng' : 'Published analysis'}
          </h2>
          {articles.length > 0 ? (
            <p className="eyebrow text-[var(--color-burgundy)]">
              {articles.length} {locale === 'vi' ? 'bài' : 'pieces'}
            </p>
          ) : null}
        </div>

        {articles.length === 0 ? (
          /* When an author (e.g. the Managing Lawyer) hasn't personally
             authored a piece yet — instead of a jarring "No articles yet" —
             explain the editorial workflow and route to the team byline. */
          <div className="max-w-2xl border-l-4 border-[var(--color-gold)] bg-[var(--color-parchment)] px-6 py-6">
            <p className="font-[family-name:var(--font-cormorant)] italic text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {locale === 'vi'
                ? 'Bài phân tích trên chuyên trang được đăng dưới byline “Apolo Editorial Team” và được rà soát biên tập trước khi đăng. Phần này sẽ cập nhật khi có bài viết do tác giả trực tiếp chấp bút.'
                : 'Analysis on this review is published under the “Apolo Editorial Team” byline and is reviewed by our editorial team before it is posted. This section will fill in as the author personally bylines pieces.'}
            </p>
            <Link
              href={{ pathname: '/tac-gia/[slug]', params: { slug: 'editorial-team' } }}
              className="mt-5 inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-burgundy)] hover:text-[var(--color-burgundy-dark)] transition-colors"
            >
              {locale === 'vi' ? 'Xem Ban Biên tập' : 'See the Editorial Team'} <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {articles.map((a, i) => {
              const cat = typeof a.category === 'object' ? a.category : null
              const img = typeof a.featuredImage === 'object' ? a.featuredImage : null
              const pathname = cat?.slug ? SECTION_PATHNAMES[cat.slug] : SECTION_PATHNAMES['thuc-tien-xet-xu']
              return (
                <Reveal key={a.id} delay={(i % 3) * 0.05} className="h-full">
                  <ArticleCard
                    pathname={pathname}
                    slug={a.slug}
                    category={cat?.name || ''}
                    title={a.title}
                    excerpt={a.excerpt}
                    publishedDate={a.publishedDate}
                    readingTime={a.readingTime}
                    imageUrl={img?.url || null}
                  />
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
