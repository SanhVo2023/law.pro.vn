import type { Locale } from '@/i18n/routing'

export type Section = {
  key: string
  hub: { vi: string; en: string }
  navKey: string
}

export const SECTIONS: Section[] = [
  {
    key: 'court-practice',
    hub: { vi: '/thuc-tien-xet-xu', en: '/court-practice-vietnam' },
    navKey: 'courtPractice',
  },
  {
    key: 'litigation-strategy',
    hub: { vi: '/chien-luoc-ho-so', en: '/litigation-strategy-vietnam' },
    navKey: 'litigationStrategy',
  },
  {
    key: 'evidence-assessment',
    hub: { vi: '/danh-gia-chung-cu', en: '/evidence-assessment-vietnam' },
    navKey: 'evidenceAssessment',
  },
  {
    key: 'litigation-skills',
    hub: { vi: '/ky-nang-tranh-tung', en: '/procedural-practice-vietnam' },
    navKey: 'litigationSkills',
  },
  {
    key: 'professional-perspective',
    hub: { vi: '/goc-nhin-nghe-luat', en: '/professional-perspective' },
    navKey: 'professionalPerspective',
  },
  {
    key: 'case-commentary',
    hub: { vi: '/binh-luan-ban-an', en: '/case-commentary-vietnam' },
    navKey: 'caseCommentary',
  },
]

export function getSectionHref(section: Section, locale: Locale): string {
  return section.hub[locale]
}
