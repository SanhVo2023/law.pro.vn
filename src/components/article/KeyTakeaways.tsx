type Props = {
  title: string
  points: string[]
}

export default function KeyTakeaways({ title, points }: Props) {
  if (!points?.length) return null

  return (
    <aside
      role="complementary"
      aria-label={title}
      className="my-12 border border-[var(--color-line)] border-l-2 border-l-[var(--color-gold)] bg-[var(--color-parchment)] px-6 py-6 md:px-8 md:py-7"
    >
      <p className="eyebrow text-[var(--color-burgundy)] mb-4">
        {title}
      </p>
      <ul className="space-y-3 font-[family-name:var(--font-lora)] text-[var(--color-body)]">
        {points.map((p, i) => (
          <li key={i} className="flex gap-3 leading-snug">
            <span
              aria-hidden
              className="mt-2 h-1 w-3 shrink-0 bg-[var(--color-gold)]"
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
