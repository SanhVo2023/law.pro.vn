import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { FONT_VARIABLES } from '@/lib/fonts'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import '../globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'site' })

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${t('name')} | ${t('tagline')}`, template: `%s | ${t('name')}` },
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        vi: `${SITE_URL}/vi`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: t('name'),
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? 'en_US' : 'vi_VN',
      url: `${SITE_URL}/${locale}`,
      title: `${t('name')} | ${t('tagline')}`,
      description: t('description'),
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <body className={`${FONT_VARIABLES} antialiased`}>
        <NextIntlClientProvider>
          {/* Skip-link — keyboard / screen reader users can bypass the magazine
              masthead and 6-item nav and jump straight to article content. */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-burgundy)] focus:text-[var(--color-parchment)] focus:px-4 focus:py-2 focus:rounded-sm focus:font-[family-name:var(--font-inter)] focus:text-sm focus:no-underline"
          >
            {locale === 'vi' ? 'Đến nội dung chính' : 'Skip to main content'}
          </a>
          <SiteHeader locale={locale as Locale} />
          <main id="main" className="min-h-screen">{children}</main>
          <SiteFooter locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
