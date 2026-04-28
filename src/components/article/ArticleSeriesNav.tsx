import { Link } from '@/i18n/navigation'

type SeriesItem = {
  slug: string
  title: string
  position: number
  isCurrent?: boolean
  hubPath: '/thuc-tien-xet-xu/[slug]' | '/chien-luoc-ho-so/[slug]' | '/danh-gia-chung-cu/[slug]' | '/ky-nang-tranh-tung/[slug]' | '/goc-nhin-nghe-luat/[slug]' | '/binh-luan-ban-an/[slug]'
}

type Props = {
  seriesTitle: string
  partLabel: string
  items: SeriesItem[]
}

export default function ArticleSeriesNav({ seriesTitle, partLabel, items }: Props) {
  if (!items?.length) return null
  return (
    <aside className="my-10 border-y border-[var(--color-rule)] py-6">
      <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-muted)] mb-2">
        {partLabel}
      </p>
      <p className="font-[family-name:var(--font-cormorant)] text-2xl text-[var(--color-burgundy)] mb-5">
        {seriesTitle}
      </p>
      <ol className="space-y-2">
        {items.map((it) => (
          <li
            key={it.slug}
            className="flex items-baseline gap-4 font-[family-name:var(--font-lora)]"
          >
            <span className="font-[family-name:var(--font-inter)] text-[11px] tabular-nums text-[var(--color-ink-muted)] w-7">
              {String(it.position).padStart(2, '0')}
            </span>
            {it.isCurrent ? (
              <span className="text-[var(--color-burgundy)] font-medium">
                {it.title}
              </span>
            ) : (
              <Link
                href={{ pathname: it.hubPath, params: { slug: it.slug } }}
                className="text-[var(--color-charcoal)] hover:text-[var(--color-burgundy)] transition-colors"
              >
                {it.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </aside>
  )
}
