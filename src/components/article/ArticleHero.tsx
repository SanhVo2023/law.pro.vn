import Image from 'next/image'
import { Link } from '@/i18n/navigation'

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
}

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
}: Props) {
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Hero photograph variant: image goes BEHIND the title with a gradient overlay.
  if (heroImageUrl) {
    return (
      <header className="relative">
        <div className="relative w-full h-[60vh] min-h-[480px] max-h-[720px]">
          <Image
            src={heroImageUrl}
            alt={heroAlt || title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="hero-overlay" aria-hidden />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-screen-xl px-6 lg:px-12 pb-14 lg:pb-20 text-[var(--color-parchment)]">
              <Link
                // @ts-expect-error — categoryHref points at a section hub pathname key
                href={categoryHref}
                className="inline-block eyebrow text-[var(--color-gold)] hover:text-[var(--color-parchment)] transition-colors mb-6"
              >
                {category}
              </Link>
              <h1 className="font-[family-name:var(--font-cormorant)] text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.4rem] leading-[1.04] tracking-tight max-w-4xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-6 max-w-2xl font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl leading-snug text-[var(--color-parchment)]/85">
                  {excerpt}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Byline strip — sits below the photo against parchment */}
        <div className="border-y border-[var(--color-rule)] bg-[var(--color-parchment)]">
          <div className="mx-auto max-w-screen-md px-6 lg:px-0 py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            {authorName ? (
              <div className="flex items-center gap-3">
                {authorPhotoUrl ? (
                  <Image
                    src={authorPhotoUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--color-rule)]"
                  />
                ) : (
                  <span aria-hidden className="h-9 w-9 rounded-full bg-[var(--color-burgundy)]/[0.08] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-sm text-[var(--color-burgundy)]">
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
            <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
            {formattedDate ? <span className="eyebrow text-[var(--color-ink-muted)]">{formattedDate}</span> : null}
            {readingTime ? (
              <>
                <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
                <span className="eyebrow text-[var(--color-ink-muted)]">{readingTime} min read</span>
              </>
            ) : null}
          </div>
        </div>
      </header>
    )
  }

  // No-image fallback: typographic hero in parchment.
  return (
    <header className="border-b border-[var(--color-rule)] bg-[var(--color-parchment)]">
      <div className="mx-auto max-w-screen-md px-6 lg:px-0 pt-14 lg:pt-20 pb-10">
        <div aria-hidden className="h-px w-16 bg-[var(--color-gold)] mb-7" />
        <Link
          // @ts-expect-error — categoryHref points at a section hub pathname key
          href={categoryHref}
          className="inline-block eyebrow hover:text-[var(--color-charcoal)] mb-6"
        >
          {category}
        </Link>
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4rem] leading-[1.05] tracking-tight text-[var(--color-ink)]">
          {title}
        </h1>
        {excerpt ? (
          <p className="mt-7 font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl leading-snug text-[var(--color-charcoal)]">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {authorName ? (
            <div className="flex items-center gap-3">
              {authorPhotoUrl ? (
                <Image
                  src={authorPhotoUrl}
                  alt=""
                  width={44}
                  height={44}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--color-rule)]"
                />
              ) : (
                <span aria-hidden className="h-10 w-10 rounded-full bg-[var(--color-burgundy)]/10 flex items-center justify-center font-[family-name:var(--font-cormorant)] text-base text-[var(--color-burgundy)]">
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
          <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
          {formattedDate ? <span className="eyebrow text-[var(--color-ink-muted)]">{formattedDate}</span> : null}
          {readingTime ? (
            <>
              <span className="hidden md:block h-5 w-px bg-[var(--color-gold)]/40" aria-hidden />
              <span className="eyebrow text-[var(--color-ink-muted)]">{readingTime} min read</span>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
