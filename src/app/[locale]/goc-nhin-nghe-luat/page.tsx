import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'
import { sectionByKey } from '@/lib/sections'
import { hubMetadata } from '@/lib/seo'

const SECTION_KEY = 'professional-perspective'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  return hubMetadata(SECTION_KEY, locale as Locale)
}

export default async function ProfessionalPerspectiveHub({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const section = sectionByKey(SECTION_KEY)!

  return (
    <HubPage
      locale={locale as Locale}
      navKey="professionalPerspective"
      hubVi={section.hub.vi}
      hubEn={section.hub.en}
      categorySlug="goc-nhin-nghe-luat"
      sectionKey={SECTION_KEY}
      articlePathname="/goc-nhin-nghe-luat/[slug]"
      description={section.description}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
