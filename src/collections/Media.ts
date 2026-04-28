import type { CollectionConfig } from 'payload'

// Strip localhost/loopback protocol+host from URLs so next/image treats them
// as same-origin (Next refuses to fetch private IPs through the optimizer).
// Production R2 URLs (https://pub-...r2.dev/...) are left untouched.
function relativizeLocalhost(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(/^https?:\/\/(localhost|127\.0\.0\.1|\[?::1\]?)(:\d+)?/i, '')
}

function rewriteSizes(sizes: unknown): unknown {
  if (!sizes || typeof sizes !== 'object') return sizes
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(sizes as Record<string, unknown>)) {
    if (v && typeof v === 'object' && 'url' in (v as object)) {
      out[k] = { ...(v as object), url: relativizeLocalhost((v as { url: unknown }).url) }
    } else {
      out[k] = v
    }
  }
  return out
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'credit', type: 'text' },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!doc) return doc
        return {
          ...doc,
          url: relativizeLocalhost(doc.url),
          thumbnailURL: relativizeLocalhost(doc.thumbnailURL),
          sizes: rewriteSizes(doc.sizes),
        }
      },
    ],
  },
}
