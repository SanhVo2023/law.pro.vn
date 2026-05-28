#!/usr/bin/env node
/**
 * Create a Media record for each uploaded `post-{id}` image and wire it to its
 * article's featuredImage — all via direct SQL.
 *
 * Why SQL instead of seed-media.mjs (REST): on the E: drive with pool.max:2,
 * the local Payload server stalls/times out generating 4 sharp sizes per
 * upload × 29. The afterRead hook in collections/Media.ts already rewrites a
 * media doc's url/sizes to the R2 CDN URL by filename (via the build-time
 * r2-media-map), so the record only needs a correct `filename`; Payload never
 * has to process the file. Images already live on R2 from /batch.
 *
 * Reads image-assets.json for {id, name, result_url} of every post-* entry.
 * Idempotent: media matched by filename; assignment is an unconditional UPDATE.
 *
 * Usage: node scripts/seed-post-media-sql.mjs
 */
import fs from 'node:fs'
import pg from 'pg'

const root = new URL('../', import.meta.url)
const env = fs.readFileSync(new URL('.env', root), 'utf8')
const uri = env.match(/^DATABASE_URI=(.+)$/m)?.[1]?.trim()
if (!uri) throw new Error('DATABASE_URI not found in .env')

const manifest = JSON.parse(fs.readFileSync(new URL('image-assets.json', root), 'utf8'))
const posts = manifest.images.filter(
  (i) => /^post-\d+$/.test(i.id) && i.status === 'uploaded' && i.result_url,
)
console.log(`${posts.length} uploaded post-* entries in manifest.`)

const c = new pg.Client({ connectionString: uri })
await c.connect()

const assigned = []
for (const img of posts) {
  const articleId = Number(img.id.slice('post-'.length))
  const filename = `${img.id}.webp`
  const alt = img.name

  // upsert media by filename
  let mediaId
  const found = await c.query(`SELECT id FROM lpv.media WHERE filename = $1 LIMIT 1`, [filename])
  if (found.rows.length) {
    mediaId = found.rows[0].id
    await c.query(`UPDATE lpv.media SET url = $1 WHERE id = $2`, [img.result_url, mediaId])
  } else {
    const ins = await c.query(
      `INSERT INTO lpv.media
        (filename, url, mime_type, filesize, width, height, focal_x, focal_y, prefix, credit, updated_at, created_at)
       VALUES ($1,$2,'image/webp',NULL,1024,768,50,50,'law.pro.vn','Nano Banana 2 / Gemini 3.1 Flash Image',now(),now())
       RETURNING id`,
      [filename, img.result_url],
    )
    mediaId = ins.rows[0].id
    for (const locale of ['vi', 'en']) {
      await c.query(
        `INSERT INTO lpv.media_locales (alt, caption, _locale, _parent_id) VALUES ($1,$1,$2,$3)`,
        [alt, locale, mediaId],
      )
    }
  }

  await c.query(`UPDATE lpv.articles SET featured_image_id = $1 WHERE id = $2`, [mediaId, articleId])
  assigned.push({ articleId, mediaId, filename })
}

console.log(`\n${assigned.length} articles wired to their own image:`)
console.table(assigned)

// verify distinct images per category
const dist = await c.query(`
  SELECT cat.slug AS category, COUNT(*) AS articles, COUNT(DISTINCT a.featured_image_id) AS distinct_images
  FROM lpv.articles a JOIN lpv.categories cat ON cat.id = a.category_id
  GROUP BY cat.slug ORDER BY cat.slug`)
console.log('\n=== distinct featuredImage per category (should equal article count) ===')
console.table(dist.rows)
await c.end()
