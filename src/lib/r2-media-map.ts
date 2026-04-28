/**
 * Filename → R2 CDN URL map, derived from ../../image-assets.json at module load.
 *
 * Consumed by the Media collection's afterRead hook to redirect Payload's
 * locally-served `/api/media/file/X.webp` URLs to the actual CDN URL on
 * Cloudflare R2 — required in production where Netlify is stateless and the
 * Payload local upload directory is empty.
 *
 * This is a stop-gap until @payloadcms/storage-s3 is fully wired (R2 creds
 * provisioned, Media table wiped + reseeded). Once that lands, this map is
 * obsolete: Payload will write canonical R2 URLs into media.url directly.
 */
import path from 'node:path'
// Statically imported JSON so Next bundles it with the server build (no fs).
// Path: src/lib/r2-media-map.ts → ../../image-assets.json (project root).
import manifest from '../../image-assets.json'

type ImageEntry = { id: string; result_url?: string; status?: string }

const map = new Map<string, string>()
for (const img of (manifest as { images: ImageEntry[] }).images || []) {
  if (img.status !== 'uploaded' || !img.result_url) continue
  // seed-media.mjs uploads each image as `${id}${ext}` where ext is from the
  // R2 URL (always .webp here) — match Media.filename exactly.
  let ext = '.webp'
  try {
    ext = path.posix.extname(new URL(img.result_url).pathname) || '.webp'
  } catch {
    /* keep default */
  }
  map.set(`${img.id}${ext}`, img.result_url)
}

export function r2UrlForFilename(filename: unknown): string | null {
  if (typeof filename !== 'string') return null
  return map.get(filename) ?? null
}
