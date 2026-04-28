import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://law.pro.vn'),
  title: {
    default: 'The Apolo Review | Phân tích pháp lý chuyên sâu',
    template: '%s | The Apolo Review',
  },
  description:
    'The Apolo Review — tạp chí phân tích pháp lý chuyên sâu cho luật sư, chuyên viên pháp chế và nhà nghiên cứu luật tại Việt Nam.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
