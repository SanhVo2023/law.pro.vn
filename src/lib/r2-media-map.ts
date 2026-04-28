/**
 * Filename → R2 CDN URL lookup, consumed by the Media collection's afterRead
 * hook to redirect Payload's locally-served `/api/media/file/X.webp` URLs to
 * the actual CDN URL on Cloudflare R2.
 *
 * The lookup table is generated at build time by scripts/generate-r2-map.mjs
 * (run via `predev`/`prebuild`). The generator strips out everything in
 * image-assets.json except {filename → URL}, dropping the ~1.3 MB of base64
 * preview thumbnails that the image-generator-ui tool embeds — those would
 * otherwise bloat the Netlify Lambda bundle and produce 500s on cold start.
 *
 * Stop-gap until @payloadcms/storage-s3 is fully wired and Payload writes
 * canonical R2 URLs into media.url directly.
 */
import { r2MediaMap } from './r2-media-map.generated'

export function r2UrlForFilename(filename: unknown): string | null {
  if (typeof filename !== 'string') return null
  return r2MediaMap[filename] ?? null
}
