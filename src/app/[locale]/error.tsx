'use client'

/**
 * Locale-segment error boundary (QA-LPRO-001/010). Transient DB/pooler
 * timeouts used to surface as the raw Next.js "Application error" screen.
 * This keeps the failure branded, bilingual (best-effort from the URL), and
 * recoverable via reset() — while the real fixes (ISR caching + pool
 * timeouts) make it rare.
 */
import { useEffect } from 'react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log for the platform's function logs — includes the Next digest.
    console.error('[law.pro.vn] route error', error?.digest || '', error)
  }, [error])

  const isVi =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/vi')

  return (
    <main className="min-h-[60vh] flex items-center">
      <div className="wrap py-24 max-w-2xl">
        <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-burgundy)] mb-5">
          {isVi ? 'Đã xảy ra lỗi' : 'Something went wrong'}
        </p>
        <h1 className="font-[family-name:var(--font-cormorant)] font-semibold text-4xl md:text-5xl leading-tight text-[var(--color-ink)]">
          {isVi
            ? 'Không thể tải trang này ngay lúc này.'
            : 'This page could not be loaded right now.'}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)] font-[family-name:var(--font-lora)]">
          {isVi
            ? 'Sự cố thường chỉ là tạm thời. Vui lòng thử lại — nếu vẫn không được, hãy quay lại trang chủ.'
            : 'This is usually temporary. Please try again — if it persists, return to the homepage.'}
        </p>
        <div className="mt-9 flex items-center gap-8">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.16em] text-[var(--color-burgundy)] border-b-2 border-[var(--color-gold)] pb-1 hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
          >
            {isVi ? 'Thử lại' : 'Try again'} <span aria-hidden>↻</span>
          </button>
          <a
            href={isVi ? '/vi' : '/en'}
            className="inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-[12px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] hover:text-[var(--color-burgundy)] transition-colors"
          >
            {isVi ? 'Về trang chủ' : 'Back to home'} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </main>
  )
}
