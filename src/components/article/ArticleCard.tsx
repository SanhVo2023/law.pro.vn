import Image from 'next/image'
import { Link } from '@/i18n/navigation'

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
}: Props) {
  const isFeature = variant === 'feature'
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={{ pathname, params: { slug } }}
      className="group flex flex-col"
    >
      {imageUrl ? (
        <div
          className={`relative w-full overflow-hidden ${
            isFeature ? 'aspect-[16/10]' : 'aspect-[4/3]'
          } bg-[var(--color-rule)]`}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes={isFeature ? '(min-width:1024px) 60vw, 100vw' : '(min-width:1024px) 33vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className={`paper-grain border border-[var(--color-rule)] ${
            isFeature ? 'aspect-[16/10]' : 'aspect-[4/3]'
          } relative overflow-hidden flex items-center justify-center`}
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
      <div className="pt-5">
        <p className="font-[family-name:var(--font-inter)] text-[10.5px] uppercase tracking-[0.24em] text-[var(--color-burgundy)] mb-3">
          {category}
        </p>
        <h3
          className={`font-[family-name:var(--font-cormorant)] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors ${
            isFeature ? 'text-3xl md:text-4xl' : 'text-2xl'
          }`}
        >
          <span className="editorial-link">{title}</span>
        </h3>
        {excerpt ? (
          <p className="mt-3 text-[var(--color-ink-muted)] line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        ) : null}
        <p className="mt-4 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] flex items-center gap-3">
          {authorName ? <span>{authorName}</span> : null}
          {authorName && (formattedDate || readingTime) ? (
            <span aria-hidden className="opacity-50">·</span>
          ) : null}
          {formattedDate ? <span>{formattedDate}</span> : null}
          {readingTime ? (
            <>
              <span aria-hidden className="opacity-50">·</span>
              <span>{readingTime} min</span>
            </>
          ) : null}
        </p>
      </div>
    </Link>
  )
}
