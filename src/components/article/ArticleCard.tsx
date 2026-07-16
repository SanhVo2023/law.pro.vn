import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate, readingTimeLabel } from '@/lib/format'

type SectionPathname =
  | '/thuc-tien-xet-xu/[slug]'
  | '/chien-luoc-ho-so/[slug]'
  | '/danh-gia-chung-cu/[slug]'
  | '/ky-nang-tranh-tung/[slug]'
  | '/goc-nhin-nghe-luat/[slug]'
  | '/binh-luan-ban-an/[slug]'

type Props = {
  pathname: SectionPathname
  slug: string
  category: string
  title: string
  excerpt?: string | null
  authorName?: string | null
  publishedDate?: string | null
  readingTime?: number | null
  imageUrl?: string | null
  variant?: 'default' | 'feature'
  locale?: Locale
}

export default function ArticleCard({
  pathname,
  slug,
  category,
  title,
  excerpt,
  authorName,
  publishedDate,
  readingTime,
  imageUrl,
  variant = 'default',
  locale = 'vi',
}: Props) {
  const isFeature = variant === 'feature'
  const formattedDate = formatDate(publishedDate, locale)
  const readLabel = readingTimeLabel(readingTime, locale)

  return (
    <Link
      href={{ pathname, params: { slug } }}
      className="group flex flex-col h-full"
    >
      {imageUrl ? (
        <div className="relative w-full overflow-hidden aspect-[3/2] bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={isFeature ? '(min-width:1024px) 58vw, 100vw' : '(min-width:1024px) 33vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="paper-grain border border-[var(--color-line)] aspect-[3/2] relative overflow-hidden flex items-center justify-center"
        >
          {/* Laurel ornament centred on parchment paper-grain */}
          <svg
            viewBox="0 0 80 80"
            className="w-1/3 max-w-[120px] opacity-50 transition-opacity duration-500 group-hover:opacity-80"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M40 64 V 18" />
            <path d="M40 22 q -10 -4 -16 6 q 8 4 16 0" />
            <path d="M40 22 q 10 -4 16 6 q -8 4 -16 0" />
            <path d="M40 32 q -12 -4 -18 8 q 10 4 18 0" />
            <path d="M40 32 q 12 -4 18 8 q -10 4 -18 0" />
            <path d="M40 44 q -12 -2 -18 10 q 10 4 18 0" />
            <path d="M40 44 q 12 -2 18 10 q -10 4 -18 0" />
            <circle cx="40" cy="16" r="2.4" fill="var(--color-gold)" stroke="none" />
          </svg>
          <span aria-hidden className="absolute inset-x-8 bottom-3 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />
        </div>
      )}
      <div className="pt-5 flex flex-col flex-1">
        <p className="eyebrow text-[var(--color-burgundy)] mb-3">
          {category}
        </p>
        <h3
          className={`font-[family-name:var(--font-cormorant)] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors ${
            isFeature ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
        >
          <span className="editorial-link">{title}</span>
        </h3>
        {excerpt ? (
          <p className="mt-3 text-[15px] text-[var(--color-ink-muted)] line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        ) : null}
        {/* QA-LPRO-036/081: each token is a whitespace-nowrap unit with its
            separator attached, so the row only wraps between whole items and
            a '·' never dangles at the end of a line. */}
        <p className="mt-4 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] flex items-center gap-x-3 gap-y-1 flex-wrap">
          {authorName ? <span className="whitespace-nowrap">{authorName}</span> : null}
          {formattedDate ? (
            <span className="whitespace-nowrap">
              {authorName ? <span aria-hidden className="opacity-50 mr-3">·</span> : null}
              {formattedDate}
            </span>
          ) : null}
          {readLabel ? (
            <span className="whitespace-nowrap">
              {authorName || formattedDate ? <span aria-hidden className="opacity-50 mr-3">·</span> : null}
              {readLabel}
            </span>
          ) : null}
        </p>
      </div>
    </Link>
  )
}
