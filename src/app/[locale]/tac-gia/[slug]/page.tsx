import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getAuthorBySlug, listArticlesByAuthorId } from '@/lib/queries'
import LexicalContent from '@/components/article/LexicalContent'
import ArticleCard from '@/components/article/ArticleCard'
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

      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pt-16 lg:pt-24 pb-14 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            {photo?.url ? (
              <Image
                src={photo.url}
                alt={author.name}
                width={320}
                height={320}
                className="w-44 h-44 lg:w-full lg:h-auto aspect-square object-cover rounded-full lg:rounded-none ring-1 ring-[var(--color-rule)]"
              />
            ) : (
              <div
                aria-hidden
                className="w-44 h-44 lg:w-full lg:aspect-square rounded-full lg:rounded-none bg-[var(--color-burgundy)]/[0.06] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-7xl text-[var(--color-burgundy)]/40"
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
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl tracking-tight text-[var(--color-ink)] leading-tight">
              {author.name}
            </h1>
            {author.title ? (
              <p className="mt-4 font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.18em] text-[var(--color-burgundy)]">
                {author.title}
              </p>
            ) : null}

            {Array.isArray(author.credentials) && author.credentials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-burgundy)]">
                {author.credentials.map((c: { label?: string; year?: number }, i: number) => (
                  <li key={i} className="border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-1">
                    {c.label}
                    {c.year ? ` · ${c.year}` : ''}
                  </li>
                ))}
              </ul>
            ) : null}

            {Array.isArray(author.expertise) && author.expertise.length > 0 ? (
              <p className="mt-4 text-[var(--color-ink-muted)] text-sm">
                {(author.expertise as { area?: string }[])
                  .map((e) => e.area)
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}

            <div className="mt-8 max-w-3xl prose-magazine">
              <LexicalContent data={author.bio as never} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-16">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl mb-10 text-[var(--color-ink)] border-b border-[var(--color-rule)] pb-4">
          {locale === 'vi' ? 'Bài viết đã xuất bản' : 'Published analysis'}
          <span className="ml-3 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-ink-muted)]">
            {articles.length}
          </span>
        </h2>

        {articles.length === 0 ? (
          <p className="font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            {locale === 'vi' ? 'Chưa có bài viết.' : 'No articles yet.'}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {articles.map((a) => {
              const cat = typeof a.category === 'object' ? a.category : null
              const img = typeof a.featuredImage === 'object' ? a.featuredImage : null
              const pathname = cat?.slug ? SECTION_PATHNAMES[cat.slug] : SECTION_PATHNAMES['thuc-tien-xet-xu']
              return (
                <ArticleCard
                  key={a.id}
                  pathname={pathname}
                  slug={a.slug}
                  category={cat?.name || ''}
                  title={a.title}
                  excerpt={a.excerpt}
                  publishedDate={a.publishedDate}
                  readingTime={a.readingTime}
                  imageUrl={img?.url || null}
                />
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
