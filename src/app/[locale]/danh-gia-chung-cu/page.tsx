import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function EvidenceAssessmentHub({
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
      navKey="evidenceAssessment"
      hubVi="/danh-gia-chung-cu"
      hubEn="/evidence-assessment-vietnam"
      categorySlug="danh-gia-chung-cu"
      sectionKey="evidence-assessment"
      articlePathname="/danh-gia-chung-cu/[slug]"
      description={{
        vi: 'Nguyên tắc đánh giá chứng cứ trong tố tụng dân sự, chứng cứ điện tử, vai trò giám định và gánh nặng chứng minh.',
        en: 'Principles of evidence assessment in Vietnamese civil procedure: documentary, electronic, expert and witness testimony, and the burden of proof.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
