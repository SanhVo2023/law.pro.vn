import dns from 'node:dns'
import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

// Force IPv4 first — fixes Supabase IPv6-only DNS resolution on some networks
dns.setDefaultResultOrder('ipv4first')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev',
        pathname: '/law.pro.vn/**',
      },
      // Dev-only: Payload serves uploaded media from its own /api/media/file route.
      // In production this is replaced by the R2 cloud-storage adapter, so neither
      // entry is reachable from the browser.
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
}

export default withPayload(withNextIntl(nextConfig))
