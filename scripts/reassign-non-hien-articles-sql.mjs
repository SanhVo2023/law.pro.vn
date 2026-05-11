#!/usr/bin/env node
/**
 * F-002 — Direct-SQL author reassignment (fast path).
 *
 * The REST-based reassign-non-hien-articles.mjs is the canonical tool,
 * but each PATCH triggers Payload's full update pipeline which, under the
 * production-safe pool.max=2 cap, was taking ~5 minutes per article (29 × 5
 * = ~2.5 hours). The change here is a simple FK swap with no localized
 * content touched, so a direct UPDATE is correct and dramatically faster.
 *
 * What it does
 *   UPDATE lpv.articles SET author_id = <editorial-team>
 *   WHERE author_id = <vo-thien-hien>
 *     AND slug NOT IN (<HIEN_AUTHORED set>)
 *
 * What it does NOT do
 *   - Run Payload's beforeChange / afterChange hooks. The only relevant
 *     hook (reading-time compute) depends on `content`, not `author`, so
 *     skipping it is correct.
 *   - Re-bump updatedAt — Drizzle's auto-update column does that for us
 *     on the affected rows.
 *
 * Usage:
 *   node scripts/reassign-non-hien-articles-sql.mjs --dry-run
 *   node scripts/reassign-non-hien-articles-sql.mjs
 */
import 'dotenv/config'
import pg from 'pg'

const URI = process.env.DATABASE_URI
if (!URI) {
  console.error('DATABASE_URI required')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

/** Slugs Mr Hien personally authored — leave empty to reassign every byline. */
const HIEN_AUTHORED = new Set([
  // e.g. 'binh-luan-an-le-09-2016-hop-dong-mua-ban-nha',
])

const client = new pg.Client({ connectionString: URI })

try {
  await client.connect()

  const authors = await client.query(
    `SELECT id, slug FROM lpv.authors WHERE slug IN ('vo-thien-hien','editorial-team')`,
  )
  const hien = authors.rows.find((r) => r.slug === 'vo-thien-hien')
  const editorial = authors.rows.find((r) => r.slug === 'editorial-team')
  if (!hien) throw new Error('vo-thien-hien author not found')
  if (!editorial) throw new Error('editorial-team author not found')
  console.log(`Authors: vo-thien-hien=${hien.id}, editorial-team=${editorial.id}`)

  const before = await client.query(
    `SELECT id, slug FROM lpv.articles WHERE author_id = $1 ORDER BY id`,
    [hien.id],
  )
  console.log(`\nCurrently on vo-thien-hien: ${before.rowCount} article(s)`)

  const targets = before.rows.filter((r) => !HIEN_AUTHORED.has(r.slug))
  const skipped = before.rows.filter((r) => HIEN_AUTHORED.has(r.slug))
  console.log(`To reassign: ${targets.length}`)
  for (const r of targets) console.log(`  ~ ${r.slug}`)
  if (skipped.length) {
    console.log(`\nKeeping Hien byline (${skipped.length}):`)
    for (const r of skipped) console.log(`  · ${r.slug}`)
  }

  if (DRY_RUN) {
    console.log('\nDry run — no changes made.')
  } else if (targets.length === 0) {
    console.log('\nNothing to do.')
  } else {
    const ids = targets.map((r) => r.id)
    const res = await client.query(
      `UPDATE lpv.articles
       SET author_id = $1, updated_at = now()
       WHERE id = ANY($2::int[])
       RETURNING id, slug`,
      [editorial.id, ids],
    )
    console.log(`\nUPDATED ${res.rowCount} row(s).`)

    // Verify
    const after = await client.query(
      `SELECT
         (SELECT count(*) FROM lpv.articles WHERE author_id = $1) AS hien_count,
         (SELECT count(*) FROM lpv.articles WHERE author_id = $2) AS editorial_count`,
      [hien.id, editorial.id],
    )
    console.log(
      `Post-update distribution: vo-thien-hien=${after.rows[0].hien_count}, editorial-team=${after.rows[0].editorial_count}`,
    )
  }
} catch (e) {
  console.error('FAIL:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
