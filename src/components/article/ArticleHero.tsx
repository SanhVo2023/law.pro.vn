import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate, readingTimeLabel } from '@/lib/format'

type Props = {
  category: string
  categoryHref: { pathname: string }
  title: string
  excerpt?: string | null
  authorName?: string | null
  authorTitle?: string | null
  authorPhotoUrl?: string | null
  publishedDate?: string | null
  readingTime?: number | null
  heroImageUrl?: string | null
  heroAlt?: string | null
  locale?: Locale
}

/**
 * Header-first hero (Modern Authority): the headline sits on the canvas in a
 * comfortable reading column, with the byline beneath it, and the feature image
 * follows as a contained cinematic band. This reads as a serious publication,
 * keeps the LCP text/contained (not a full-bleed photo), and never buries the
 * title under an overlay.
 */
export default function ArticleHero({
  category,
  categoryHref,
  title,
  excerpt,
  authorName,
  authorTitle,
  authorPhotoUrl,
  publishedDate,
  readingTime,
  heroImageUrl,
  heroAlt,
  locale = 'vi',
}: Props) {
  // QA-LPRO-061/086: byline strings follow the page locale.
  const formattedDate = formatDate(publishedDate, locale, 'long')
  const readLabel = readingTimeLabel(readingTime, locale, 'read')

  return (
    <header className="border-b border-[var(--color-line)]">
      <div className="wrap-read pt-14 lg:pt-20 pb-10">
        <div aria-hidden className="h-px w-16 bg-[var(--color-gold)] mb-7" />
        <Link
          // @ts-expect-error — categoryHref points at a section hub pathname key
          href={categoryHref}
          className="inline-block eyebrow text-[var(--color-burgundy)] hover:text-[var(--color-burgundy-dark)] transition-colors mb-6"
        >
          {category}
        </Link>
        <h1 className="font-[family-name:var(--font-cormorant)] font-semibold text-[2.25rem] sm:text-5xl lg:text-[3.25rem] leading-[1.07] tracking-tight text-[var(--color-ink)]">
          {title}
        </h1>
        {excerpt ? <p className="mt-6 deck text-xl md:text-2xl">{excerpt}</p> : null}

        {/* Byline */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          {authorName ? (
            <div className="flex items-center gap-3">
              {authorPhotoUrl ? (
                <Image
                  src={authorPhotoUrl}
                  alt=""
                  width={44}
                  height={44}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--color-line)]"
                />
              ) : (
                <span aria-hidden className="h-10 w-10 rounded-full bg-[var(--color-burgundy)]/[0.08] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-base text-[var(--color-burgundy)]">
                  {authorName.split(' ').map((n) => n[0]).slice(-2).join('')}
                </span>
              )}
              <div className="leading-tight">
                <p className="font-[family-name:var(--font-cormorant)] text-base text-[var(--color-ink)]">
                  {authorName}
                </p>
                {authorTitle ? (
                  <p className="eyebrow text-[var(--color-ink-muted)]">{authorTitle}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          {authorName && (formattedDate || readingTime) ? (
            <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
          ) : null}
          {formattedDate ? <span className="eyebrow text-[var(--color-ink-muted)] whitespace-nowrap">{formattedDate}</span> : null}
          {readLabel ? (
            <>
              <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
              <span className="eyebrow text-[var(--color-ink-muted)] whitespace-nowrap">{readLabel}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Contained feature image — cinematic band, not a full-bleed mega-hero. */}
      {heroImageUrl ? (
        <div className="wrap pb-12 lg:pb-14">
          <div className="relative w-full aspect-[16/9] max-h-[520px] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)]">
            <Image
              src={heroImageUrl}
              alt={heroAlt || title}
              fill
              sizes="(min-width:1024px) 1100px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
    </header>
  )
}
