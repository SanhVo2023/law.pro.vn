import { setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import HubPage from '@/components/hub/HubPage'

export default async function LitigationSkillsHub({
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
      navKey="litigationSkills"
      hubVi="/ky-nang-tranh-tung"
      hubEn="/procedural-practice-vietnam"
      categorySlug="ky-nang-tranh-tung"
      sectionKey="litigation-skills"
      articlePathname="/ky-nang-tranh-tung/[slug]"
      description={{
        vi: 'Kỹ năng tranh tụng tại toà — trình bày, hỏi và đối chất, viết bản luận cứ, đàm phán hoà giải, quản lý thời hiệu tố tụng.',
        en: 'Courtroom advocacy skills: oral presentation, examination and cross-examination, written argument, negotiation and mediation, and timeline management.',
      }}
    />
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
