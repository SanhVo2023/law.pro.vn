import type { Locale } from '@/i18n/routing'

export type Section = {
  key: string
  hub: { vi: string; en: string }
  navKey: string
  /** Long-form description used by hub hero, metadata, JSON-LD. SSOT — do
   *  not hand-write the description anywhere else. */
  description: { vi: string; en: string }
  /** R2 filename prefix of the OG card for this section (matches manifest entries). */
  ogFilename: string
  /** R2 filename prefix of the hub thumbnail (matches manifest entries). */
  thumbFilename: string
  /** R2 filename prefix of the hub hero image. */
  heroFilename: string
}

export const SECTIONS: Section[] = [
  {
    key: 'court-practice',
    hub: { vi: '/thuc-tien-xet-xu', en: '/court-practice-vietnam' },
    navKey: 'courtPractice',
    description: {
      vi: 'Phân tích thực tiễn xét xử của các cấp tòa án Việt Nam — xu hướng giải quyết tranh chấp, lập luận lặp lại trong bản án, và những phán quyết định hình ngành luật.',
      en: 'Analysis of how Vietnamese courts adjudicate disputes — practice trends, recurring reasoning, and the judgments that shape the profession.',
    },
    ogFilename: 'og-thuc-tien-xet-xu.webp',
    thumbFilename: 'thumb-template-thuc-tien-xet-xu.webp',
    heroFilename: 'hero-court-practice.webp',
  },
  {
    key: 'litigation-strategy',
    hub: { vi: '/chien-luoc-ho-so', en: '/litigation-strategy-vietnam' },
    navKey: 'litigationStrategy',
    description: {
      vi: 'Chiến lược tố tụng, chuẩn bị hồ sơ kiện và quản lý rủi ro tố tụng — kinh nghiệm thực tiễn cho luật sư hành nghề tại Việt Nam.',
      en: 'Litigation strategy, case-file preparation, and procedural risk management — practitioner-grade analysis for counsel working in Vietnam.',
    },
    ogFilename: 'og-chien-luoc-ho-so.webp',
    thumbFilename: 'thumb-template-chien-luoc-ho-so.webp',
    heroFilename: 'hero-litigation-strategy.webp',
  },
  {
    key: 'evidence-assessment',
    hub: { vi: '/danh-gia-chung-cu', en: '/evidence-assessment-vietnam' },
    navKey: 'evidenceAssessment',
    description: {
      vi: 'Nguyên tắc đánh giá chứng cứ trong tố tụng dân sự Việt Nam — chứng cứ điện tử, văn bản, giám định, lời khai và gánh nặng chứng minh.',
      en: 'Principles of evidence assessment in Vietnamese civil procedure — documentary, electronic, expert and witness evidence, and the burden of proof.',
    },
    ogFilename: 'og-danh-gia-chung-cu.webp',
    thumbFilename: 'thumb-template-danh-gia-chung-cu.webp',
    heroFilename: 'hero-evidence-assessment.webp',
  },
  {
    key: 'litigation-skills',
    hub: { vi: '/ky-nang-tranh-tung', en: '/procedural-practice-vietnam' },
    navKey: 'litigationSkills',
    description: {
      vi: 'Kỹ năng tranh tụng tại tòa — trình bày, hỏi và đối chất, viết bản luận cứ, đàm phán hòa giải, quản lý thời hiệu tố tụng.',
      en: 'Courtroom advocacy skills — oral presentation, examination and cross-examination, written argument, negotiation and mediation, and timeline management.',
    },
    ogFilename: 'og-ky-nang-tranh-tung.webp',
    thumbFilename: 'thumb-template-ky-nang-tranh-tung.webp',
    heroFilename: 'hero-litigation-skills.webp',
  },
  {
    key: 'professional-perspective',
    hub: { vi: '/goc-nhin-nghe-luat', en: '/professional-perspective' },
    navKey: 'professionalPerspective',
    description: {
      vi: 'Quan điểm và kinh nghiệm của luật sư hành nghề tại Việt Nam — đạo đức, công nghệ, quan hệ luật sư–thân chủ, sự nghiệp.',
      en: 'Perspectives from practising lawyers in Vietnam — ethics, technology, the lawyer–client relationship, and career.',
    },
    ogFilename: 'og-goc-nhin-nghe-luat.webp',
    thumbFilename: 'thumb-template-goc-nhin-nghe-luat.webp',
    heroFilename: 'hero-professional-perspective.webp',
  },
  {
    key: 'case-commentary',
    hub: { vi: '/binh-luan-ban-an', en: '/case-commentary-vietnam' },
    navKey: 'caseCommentary',
    description: {
      vi: 'Bình luận và phân tích các bản án tiêu biểu tại Việt Nam — tranh chấp hợp đồng, lao động, đất đai, hôn nhân gia đình, doanh nghiệp. Bài viết có tính tham khảo, tên cá nhân (nếu có) chỉ mang tính minh họa.',
      en: 'Commentary and analysis of notable Vietnamese judgments — contract, labour, land, family, and corporate disputes. Each piece works from a verifiable ruling (number, date, court) and engages with how the court reasoned, where the precedent sits, and what counsel can take into practice. Reference only; any names mentioned are illustrative.',
    },
    ogFilename: 'og-binh-luan-ban-an.webp',
    thumbFilename: 'thumb-template-binh-luan-ban-an.webp',
    heroFilename: 'hero-case-commentary.webp',
  },
]

export function getSectionHref(section: Section, locale: Locale): string {
  return section.hub[locale]
}

export function sectionByKey(key: string): Section | undefined {
  return SECTIONS.find((s) => s.key === key)
}
