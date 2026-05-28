#!/usr/bin/env node
/**
 * Wire each article's featuredImage to its OWN per-post image, replacing the
 * shared per-category template.
 *
 * Run order (after writing prompts with append-article-image-prompts.mjs):
 *   1. tools/image-generator-ui  →  /batch   (generate + approve + upload to R2;
 *        this sets status:uploaded + result_url on each `post-{id}` entry)
 *   2. node scripts/seed-media.mjs            (creates a Media record per entry,
 *        filename = `post-{id}.webp`)
 *   3. node scripts/assign-article-images.mjs (THIS — sets featured_image_id)
 *
 * Direct SQL (the REST PATCH path is ~5 min/row under the pool.max:2 cap).
 * Idempotent and safe to re-run; only assigns articles whose post-{id} Media
 * record already exists, and reports the ones still missing.
 *
 * Usage: node scripts/assign-article-images.mjs
 */
import fs from 'node:fs'
import pg from 'pg'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const uri = env.match(/^DATABASE_URI=(.+)$/m)?.[1]?.trim()
if (!uri) throw new Error('DATABASE_URI not found in .env')

const ARTICLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]

const c = new pg.Client({ connectionString: uri })
await c.connect()

// filename → media.id for every post-* media record that exists
const media = await c.query(
  `SELECT id, filename FROM lpv.media WHERE filename LIKE 'post-%'`,
)
const mediaByFilename = new Map(media.rows.map((r) => [r.filename, r.id]))
console.log(`Found ${mediaByFilename.size} post-* Media records.`)

const updated = []
const missing = []
for (const articleId of ARTICLE_IDS) {
  const filename = `post-${articleId}.webp`
  const mediaId = mediaByFilename.get(filename)
  if (!mediaId) {
    missing.push(filename)
    continue
  }
  await c.query(
    `UPDATE lpv.articles SET featured_image_id = $1 WHERE id = $2`,
    [mediaId, articleId],
  )
  updated.push({ articleId, mediaId, filename })
}

console.log(`\n${updated.length} articles assigned their own image:`)
console.table(updated)
if (missing.length) {
  console.log(`\n${missing.length} still missing a Media record (run /batch + seed-media.mjs first):`)
  console.log(missing.join(', '))
}
await c.end()
