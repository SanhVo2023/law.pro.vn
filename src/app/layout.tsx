import type { Metadata } from 'next'

// Root-level metadata is intentionally minimal — the per-locale layout
// (src/app/[locale]/layout.tsx) supplies the localized title default +
// template. Defining a `title.template` at BOTH levels causes Next to
// cascade-append the brand twice ("Foo | The Apolo Review | The Apolo
// Review"), which the 2026-05-18 UI audit flagged as CX-1.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
