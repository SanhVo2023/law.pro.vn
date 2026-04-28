import Image from 'next/image'
import { Link } from '@/i18n/navigation'

type Credential = { label: string; issuer?: string | null; year?: number | null }

type Props = {
  name: string
  slug: string
  title?: string | null
  photoUrl?: string | null
  credentials?: Credential[]
  variant?: 'inline' | 'card'
}

export default function AuthorBadge({
  name,
  slug,
  title,
  photoUrl,
  credentials = [],
  variant = 'inline',
}: Props) {
  if (variant === 'card') {
    return (
      <Link
        href={{ pathname: '/tac-gia/[slug]', params: { slug } }}
        className="group flex items-start gap-5 border-t border-[var(--color-rule)] pt-6"
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={84}
            height={84}
            className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover ring-1 ring-[var(--color-rule)]"
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
          {credentials.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-burgundy)]">
              {credentials.slice(0, 3).map((c, i) => (
                <li
                  key={i}
                  className="border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1"
                >
                  {c.label}
                  {c.year ? ` · ${c.year}` : ''}
                </li>
              ))}
            </ul>
          ) : null}
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
          alt={name}
          width={48}
          height={48}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--color-rule)]"
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
