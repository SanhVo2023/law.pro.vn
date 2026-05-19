import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { listAuthors } from '@/lib/queries'
import AuthorBadge from '@/components/article/AuthorBadge'
import JsonLd from '@/components/seo/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'nav' })
  const path = locale === 'vi' ? '/tac-gia' : '/authors'
  return {
    title: t('authors'),
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: { vi: `${SITE_URL}/vi/tac-gia`, en: `${SITE_URL}/en/authors` },
    },
  }
}

export default async function AuthorsIndex({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const authors = await listAuthors(locale as Locale)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: tNav('authors'),
          url: `${SITE_URL}/${locale}${locale === 'vi' ? '/tac-gia' : '/authors'}`,
          inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
        }}
      />

      <section className="border-b border-[var(--color-rule)]">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 pt-16 lg:pt-24 pb-14">
          <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.32em] text-[var(--color-burgundy)] mb-7">
            {locale === 'vi' ? 'Ban biên tập' : 'Editorial team'}
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-[var(--color-ink)]">
            {tNav('authors')}
          </h1>
          <p className="mt-7 max-w-3xl font-[family-name:var(--font-lora)] text-lg lg:text-xl leading-[1.65] text-[var(--color-ink-muted)]">
            {locale === 'vi'
              ? 'Tác giả và cộng tác viên đóng góp phân tích chuyên sâu cho The Apolo Review — luật sư hành nghề, chuyên gia pháp lý và giảng viên luật.'
              : 'Authors and contributing editors at The Apolo Review — practising lawyers, legal experts, and academic contributors.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 lg:px-10 py-16">
        {/* Two cards on a screen-2xl page look isolated; cap the grid to a
            comfortable max-width so the cards feel like a designed page. */}
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
          {authors.map((a) => {
            const photo = typeof a.photo === 'object' ? a.photo : null
            return (
              <AuthorBadge
                key={a.id}
                variant="card"
                name={a.name}
                slug={a.slug}
                title={a.title}
                photoUrl={photo?.url || null}
              />
            )
          })}
        </div>
      </section>
    </>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
