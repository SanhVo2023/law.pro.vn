import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function CaseCommentaryHub({
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
      navKey="caseCommentary"
      hubVi="/binh-luan-ban-an"
      hubEn="/case-commentary-vietnam"
      categorySlug="binh-luan-ban-an"
      sectionKey="case-commentary"
      articlePathname="/binh-luan-ban-an/[slug]"
      description={{
        vi: 'Bình luận và phân tích các bản án tiêu biểu tại Việt Nam — tranh chấp hợp đồng, lao động, đất đai, hôn nhân gia đình, doanh nghiệp.',
        en: 'Commentary and analysis of notable Vietnamese judgments — contract, labour, land, family, and corporate disputes.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
