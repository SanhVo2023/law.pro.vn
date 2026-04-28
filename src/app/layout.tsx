import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'),
  title: {
    default: 'law.pro.vn | Phân tích pháp lý chuyên sâu',
    template: '%s | law.pro.vn',
  },
  description:
    'law.pro.vn — tạp chí phân tích pháp lý chuyên sâu cho luật sư, chuyên viên pháp chế và nhà nghiên cứu luật tại Việt Nam.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
