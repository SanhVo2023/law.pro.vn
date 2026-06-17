import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="relative w-full aspect-[4/3] max-h-[360px] overflow-hidden bg-[var(--color-rule)] ring-1 ring-[var(--color-line)] mb-12">
        <Image src="/decor/not-found.webp" alt="" fill sizes="(min-width:768px) 672px, 100vw" className="object-cover" />
        <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--color-gold)]/15" />
      </div>
      <p className="eyebrow text-[var(--color-burgundy)] mb-6">
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
