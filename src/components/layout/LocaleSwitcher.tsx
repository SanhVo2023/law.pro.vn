'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import type { Locale } from '@/i18n/routing'

type Props = { currentLocale: Locale }

export default function LocaleSwitcher({ currentLocale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const switchTo = (next: Locale) => {
    if (next === currentLocale) return
    // @ts-expect-error — params is loosely typed; we forward to next-intl router
    router.replace({ pathname, params }, { locale: next })
  }

  return (
    <div className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
      <button
        onClick={() => switchTo('vi')}
        className={
          currentLocale === 'vi'
            ? 'text-[var(--color-burgundy)] font-semibold'
            : 'hover:text-[var(--color-burgundy)] transition-colors'
        }
        aria-current={currentLocale === 'vi' ? 'true' : undefined}
      >
        VI
      </button>
      <span className="opacity-40">/</span>
      <button
        onClick={() => switchTo('en')}
        className={
          currentLocale === 'en'
            ? 'text-[var(--color-burgundy)] font-semibold'
            : 'hover:text-[var(--color-burgundy)] transition-colors'
        }
        aria-current={currentLocale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  )
}
