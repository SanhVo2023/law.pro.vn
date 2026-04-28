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
          <SiteHeader locale={locale as Locale} />
          <main className="min-h-screen">{children}</main>
          <SiteFooter locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
