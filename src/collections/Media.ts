import type { CollectionConfig } from 'payload'
import { r2UrlForFilename } from '../lib/r2-media-map'

// Strip localhost/loopback protocol+host from URLs so next/image treats them
// as same-origin (Next refuses to fetch private IPs through the optimizer).
// Production R2 URLs (https://pub-...r2.dev/...) are left untouched.
function relativizeLocalhost(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(/^https?:\/\/(localhost|127\.0\.0\.1|\[?::1\]?)(:\d+)?/i, '')
}

// If the file is in the image-assets manifest, return its R2 CDN URL.
// Falls back to relativized local URL for unmanaged uploads (e.g. user
// uploads via admin before R2 cloud storage is fully wired).
function rewriteUrl(filename: unknown, fallbackUrl: unknown): unknown {
  const r2 = r2UrlForFilename(filename)
  return r2 ?? relativizeLocalhost(fallbackUrl)
}

function rewriteSizes(filename: unknown, sizes: unknown): unknown {
  if (!sizes || typeof sizes !== 'object') return sizes
  const r2 = r2UrlForFilename(filename)
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(sizes as Record<string, unknown>)) {
    if (v && typeof v === 'object' && 'url' in (v as object)) {
      // For manifest-backed files we point every size at the original R2 URL;
      // next/image optimises (resizes/format) on-demand via /_next/image.
      const sizeUrl = r2 ?? relativizeLocalhost((v as { url: unknown }).url)
      out[k] = { ...(v as object), url: sizeUrl }
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
    // Declared here (rather than letting @payloadcms/storage-s3 inject it)
    // so the schema is identical with or without R2 env vars set. When the
    // s3Storage plugin is active it detects this field and reuses it; when
    // inactive Payload still has a place to store the manifest prefix
    // ('law.pro.vn') so the lpv.media.prefix column never gets dropped.
    {
      name: 'prefix',
      type: 'text',
      admin: { hidden: true, readOnly: true },
      defaultValue: 'law.pro.vn',
    },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!doc) return doc
        return {
          ...doc,
          url: rewriteUrl(doc.filename, doc.url),
          thumbnailURL: rewriteUrl(doc.filename, doc.thumbnailURL),
          sizes: rewriteSizes(doc.filename, doc.sizes),
        }
      },
    ],
  },
}
