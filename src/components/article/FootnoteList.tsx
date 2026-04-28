type Footnote = {
  label?: string | null
  body: string
  url?: string | null
}

type Props = {
  heading: string
  footnotes: Footnote[]
}

export default function FootnoteList({ heading, footnotes }: Props) {
  if (!footnotes?.length) return null
  return (
    <section className="mt-20 border-t border-[var(--color-rule)] pt-10">
      <h2 className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-burgundy)] mb-6">
        {heading}
      </h2>
      <ol className="space-y-4 font-[family-name:var(--font-lora)] text-[15px] leading-relaxed text-[var(--color-charcoal)]">
        {footnotes.map((f, i) => (
          <li key={i} id={`fn-${i + 1}`} className="flex gap-3">
            <span className="font-[family-name:var(--font-plex-mono)] text-[12px] text-[var(--color-burgundy)] tabular-nums shrink-0 mt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>
              {f.label ? <span className="font-medium mr-1">{f.label}.</span> : null}
              {f.body}{' '}
              {f.url ? (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener"
                  className="text-[var(--color-burgundy)] underline-offset-4 hover:underline"
                >
                  ↗
                </a>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
