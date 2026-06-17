import Image from 'next/image'
import { Link } from '@/i18n/navigation'

type Props = {
  name: string
  slug: string
  title?: string | null
  photoUrl?: string | null
  variant?: 'inline' | 'card'
}

export default function AuthorBadge({
  name,
  slug,
  title,
  photoUrl,
  variant = 'inline',
}: Props) {
  if (variant === 'card') {
    return (
      <Link
        href={{ pathname: '/tac-gia/[slug]', params: { slug } }}
        className="group flex items-start gap-5 border-t border-[var(--color-line)] pt-6"
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            width={84}
            height={84}
            className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover ring-1 ring-[var(--color-line)]"
          />
        ) : (
          <div
            aria-hidden
            className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[var(--color-burgundy)]/10 flex items-center justify-center font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-burgundy)]"
          >
            {name.split(' ').map((n) => n[0]).slice(-2).join('')}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors">
            {name}
          </p>
          {title ? (
            <p className="text-sm text-[var(--color-ink-muted)] mt-1">{title}</p>
          ) : null}
          {/* Credentials chips removed per Mr Hien 17/5/2026. */}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={{ pathname: '/tac-gia/[slug]', params: { slug } }}
      className="inline-flex items-center gap-3 group"
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          width={48}
          height={48}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--color-line)]"
        />
      ) : (
        <span
          aria-hidden
          className="h-10 w-10 rounded-full bg-[var(--color-burgundy)]/10 flex items-center justify-center font-[family-name:var(--font-cormorant)] text-base text-[var(--color-burgundy)]"
        >
          {name.split(' ').map((n) => n[0]).slice(-2).join('')}
        </span>
      )}
      <span>
        <span className="block font-[family-name:var(--font-cormorant)] text-lg text-[var(--color-ink)] group-hover:text-[var(--color-burgundy)] transition-colors leading-tight">
          {name}
        </span>
        {title ? (
          <span className="block font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] mt-0.5">
            {title}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
