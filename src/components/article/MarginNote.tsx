/**
 * Tufte-style margin note. On wide viewports renders in the right gutter.
 * On narrow viewports collapses to inline italic notation.
 */
type Props = {
  number: number
  children: React.ReactNode
}

export default function MarginNote({ number, children }: Props) {
  return (
    <span className="margin-note">
      <span
        aria-hidden
        className="margin-note__marker font-[family-name:var(--font-inter)] text-[10px] align-super text-[var(--color-burgundy)] tabular-nums"
      >
        {number}
      </span>
      <span className="margin-note__body block lg:absolute lg:left-[calc(100%+2rem)] lg:top-0 lg:w-56 mt-2 lg:mt-0 font-[family-name:var(--font-inter)] text-[12.5px] leading-snug text-[var(--color-ink-muted)] italic">
        <span className="not-italic font-medium text-[var(--color-burgundy)] mr-1">{number}.</span>
        {children}
      </span>
    </span>
  )
}
