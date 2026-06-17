import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { SECTIONS } from '@/lib/sections'
import SiteNav from './SiteNav'

type Props = { locale: Locale }

export default async function SiteHeader({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  const items = SECTIONS.map((s) => ({
    hubVi: s.hub.vi,
    label: tNav(s.navKey as 'courtPractice'),
  }))

  return (
    <SiteNav
      brand={tSite('name')}
      items={items}
      authorsLabel={tNav('authors')}
      locale={locale}
    />
  )
}
