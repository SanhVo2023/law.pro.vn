import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function ProfessionalPerspectiveHub({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <HubPage
      locale={locale as Locale}
      navKey="professionalPerspective"
      hubVi="/goc-nhin-nghe-luat"
      hubEn="/professional-perspective"
      categorySlug="goc-nhin-nghe-luat"
      sectionKey="professional-perspective"
      articlePathname="/goc-nhin-nghe-luat/[slug]"
      description={{
        vi: 'Quan điểm và kinh nghiệm của luật sư hành nghề tại Việt Nam — đạo đức nghề nghiệp, công nghệ, quan hệ luật sư–thân chủ, sự nghiệp.',
        en: 'Personal essays and perspectives from practising lawyers in Vietnam — professional ethics, technology, the lawyer–client relationship, and career.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
