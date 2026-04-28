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

type ImageEntry = {
  id: string
  result_url?: string
  status?: string
  /** When present, this entry's image should be served *in place of* the
   *  named v1 entry. Used to migrate to documentary-style imagery without
   *  touching component code. */
  aliasOf?: string
}

function extOf(url: string): string {
  try {
    return path.posix.extname(new URL(url).pathname) || '.webp'
  } catch {
    return '.webp'
  }
}

const images: ImageEntry[] = (manifest as { images: ImageEntry[] }).images || []

const map = new Map<string, string>()

// Pass 1: register every uploaded entry under its own filename.
for (const img of images) {
  if (img.status !== 'uploaded' || !img.result_url) continue
  map.set(`${img.id}${extOf(img.result_url)}`, img.result_url)
}

// Pass 2: aliases — if an entry is uploaded AND aliasOf points at a v1 id,
// override the v1 filename's URL with this entry's URL. This lets us swap to
// new imagery (e.g. -realistic variants) by uploading once, no code change.
for (const img of images) {
  if (img.status !== 'uploaded' || !img.result_url || !img.aliasOf) continue
  // The Media collection's `filename` for the aliased v1 row is `${aliasOf}.webp`
  // (seed-media uploaded it that way); always use .webp for the alias key
  // regardless of the realistic variant's actual extension.
  map.set(`${img.aliasOf}.webp`, img.result_url)
}

export function r2UrlForFilename(filename: unknown): string | null {
  if (typeof filename !== 'string') return null
  return map.get(filename) ?? null
}
