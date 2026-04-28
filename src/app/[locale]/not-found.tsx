import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-screen-md px-6 py-32 text-center">
      <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.32em] text-[var(--color-burgundy)] mb-6">
        404
      </p>
      <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[var(--color-ink)]">
        Trang không tồn tại / Page not found
      </h1>
      <p className="mt-6 text-[var(--color-ink-muted)]">
        Bài viết bạn tìm có thể đã được di chuyển hoặc gỡ bỏ.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm uppercase tracking-[0.16em] text-[var(--color-burgundy)] border-b-2 border-[var(--color-gold)] pb-1"
      >
        ← Quay về trang chủ / Back to home
      </Link>
    </section>
  )
}
