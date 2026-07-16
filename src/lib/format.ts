/**
 * Locale-aware presentation helpers (QA-LPRO-039/061/086: VI pages showed
 * English dates like "APR 27, 2026" and "7 MIN" because formatters ran with
 * the server default locale). Single source of truth for article meta strings.
 */
import type { Locale } from '@/i18n/routing'

const INTL_LOCALE: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US' }

export function formatDate(
  d: string | null | undefined,
  locale: Locale,
  style: 'short' | 'long' = 'short',
): string | null {
  if (!d) return null
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(INTL_LOCALE[locale], {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  })
}

/** "7 min" / "7 phút" — and with `read`: "7 min read" / "7 phút đọc". */
export function readingTimeLabel(
  minutes: number | null | undefined,
  locale: Locale,
  variant: 'plain' | 'read' = 'plain',
): string | null {
  if (!minutes) return null
  if (locale === 'vi') return variant === 'read' ? `${minutes} phút đọc` : `${minutes} phút`
  return variant === 'read' ? `${minutes} min read` : `${minutes} min`
}
