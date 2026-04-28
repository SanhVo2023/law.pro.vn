type Props = {
  children: React.ReactNode
  attribution?: string
}

export default function PullQuote({ children, attribution }: Props) {
  return (
    <figure className="my-14 md:-mx-6 lg:-mx-12 px-6 md:px-12 border-y border-[var(--color-rule)] py-10">
      <blockquote className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-3xl lg:text-4xl leading-snug text-[var(--color-burgundy)]">
        <span aria-hidden className="text-[var(--color-gold)] mr-2">"</span>
        {children}
        <span aria-hidden className="text-[var(--color-gold)] ml-1">"</span>
      </blockquote>
      {attribution ? (
        <figcaption className="mt-5 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-ink-muted)]">
          — {attribution}
        </figcaption>
      ) : null}
    </figure>
  )
}
