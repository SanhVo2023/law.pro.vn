import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function CourtPracticeHub({
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
      navKey="courtPractice"
      hubVi="/thuc-tien-xet-xu"
      hubEn="/court-practice-vietnam"
      categorySlug="thuc-tien-xet-xu"
      sectionKey="court-practice"
      articlePathname="/thuc-tien-xet-xu/[slug]"
      description={{
        vi: 'Phân tích thực tiễn xét xử của các cấp toà án, xu hướng giải quyết tranh chấp và những bản án định hình ngành luật Việt Nam.',
        en: 'Analysis of how Vietnamese courts adjudicate disputes — practice trends, recurring reasoning, and the judgments that shape the profession.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
