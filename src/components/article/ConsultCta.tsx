import type { Locale } from '@/i18n/routing'

/**
 * Outbound consult CTA — per ecosystem rules, links ONLY to luatsutructuyen.vn
 * (consult booking) or vothienhien.com (managing partner). Never to direct
 * practice-area conversion sites.
 */
type Props = { locale: Locale }

export default function ConsultCta({ locale }: Props) {
  const copy = {
    vi: {
      eyebrow: 'Tư vấn pháp lý',
      heading: 'Bạn đang đối mặt với vấn đề pháp lý tương tự?',
      body:
        'Đặt lịch trao đổi với luật sư tại Luật Sư Trực Tuyến — dịch vụ tư vấn của Apolo Lawyers — để được phân tích cụ thể vụ việc của bạn.',
      cta: 'Đặt lịch tư vấn',
      url: 'https://luatsutructuyen.vn',
      footnote: 'Ngoài ra, bạn có thể tìm hiểu thêm về quan điểm pháp lý của LS. Võ Thiện Hiển tại',
      footnoteLink: 'vothienhien.com',
      footnoteUrl: 'https://vothienhien.com',
    },
    en: {
      eyebrow: 'Legal consultation',
      heading: 'Facing a similar legal matter?',
      body:
        'Schedule a consultation with a practising lawyer at Luật Sư Trực Tuyến — the consult service of Apolo Lawyers — for tailored analysis of your case.',
      cta: 'Book a consultation',
      url: 'https://luatsutructuyen.vn',
      footnote: 'You can also read more from Managing Lawyer Võ Thiện Hiển at',
      footnoteLink: 'vothienhien.com',
      footnoteUrl: 'https://vothienhien.com',
    },
  }[locale]

  return (
    <aside className="mt-20 bg-[var(--color-parchment)] border border-[var(--color-line)] border-t-2 border-t-[var(--color-burgundy)] px-7 py-9 md:px-9 md:py-10">
      <p className="eyebrow text-[var(--color-burgundy)] mb-4">
        {copy.eyebrow}
      </p>
      <h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[var(--color-ink)] leading-tight max-w-2xl">
        {copy.heading}
      </h3>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)] font-[family-name:var(--font-lora)]">
        {copy.body}
      </p>
      <a
        href={copy.url}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-3 mt-7 font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.16em] text-[var(--color-burgundy)] border-b-2 border-[var(--color-gold)] pb-1 hover:text-[var(--color-charcoal)] transition-colors"
      >
        {copy.cta} <span aria-hidden>↗</span>
      </a>
      <p className="mt-7 text-sm text-[var(--color-ink-muted)] font-[family-name:var(--font-lora)] italic">
        {copy.footnote}{' '}
        <a
          href={copy.footnoteUrl}
          target="_blank"
          rel="noopener"
          className="text-[var(--color-burgundy)] underline-offset-4 hover:underline"
        >
          {copy.footnoteLink}
        </a>
        .
      </p>
    </aside>
  )
}
