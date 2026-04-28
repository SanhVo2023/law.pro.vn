import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function LitigationStrategyHub({
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
      navKey="litigationStrategy"
      hubVi="/chien-luoc-ho-so"
      hubEn="/litigation-strategy-vietnam"
      categorySlug="chien-luoc-ho-so"
      sectionKey="litigation-strategy"
      articlePathname="/chien-luoc-ho-so/[slug]"
      description={{
        vi: 'Chiến lược tố tụng, chuẩn bị hồ sơ kiện, lựa chọn diễn đàn giải quyết tranh chấp và quản lý rủi ro tố tụng cho luật sư hành nghề.',
        en: 'Litigation strategy, case-file preparation, forum selection, and procedural risk management for practising counsel in Vietnam.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
