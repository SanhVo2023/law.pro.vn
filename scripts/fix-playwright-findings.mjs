#!/usr/bin/env node
/**
 * Patch two issues surfaced by the Playwright visual smoke test
 * (post Phase-1 fix-pack v2):
 *
 *   1. "TP.HCM" abbreviation lingering in 3 article titles/excerpts.
 *      Per Mr Hien (xlsx 17/5/2026 item 10), the city is written out
 *      everywhere as "Thành phố Hồ Chí Minh" — no abbreviation drift.
 *      The fix-pack swept identity.ts, footer, settings — these stragglers
 *      slipped through because they're in DB-backed article content seeded
 *      months ago.
 *
 *   2. "publication" in one EN article excerpt:
 *      `thuc-tien-ap-dung-an-le-tai-viet-nam` says "from selection and
 *      publication process to citation practices". Per Hien (xlsx item 2),
 *      "publication" is a press-media term to avoid. Replaced with
 *      "release" — semantically equivalent for court-judgment workflows
 *      ("công bố bản án" = release of the judgment).
 *
 * Direct SQL UPDATE on lpv.articles_locales. Same fast-path pattern as
 * F-002/F-006/F-008 scripts. Article content (Lexical JSON body) is
 * untouched; only `title` + `excerpt` strings change.
 *
 * Usage:
 *   node scripts/fix-playwright-findings.mjs --dry-run
 *   node scripts/fix-playwright-findings.mjs
 */
import 'dotenv/config'
import pg from 'pg'

const URI = process.env.DATABASE_URI
if (!URI) {
  console.error('DATABASE_URI required')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

const client = new pg.Client({ connectionString: URI })

try {
  await client.connect()

  // --- 1. TP.HCM → Thành phố Hồ Chí Minh in titles + excerpts ---
  const candidates1 = await client.query(
    `SELECT al.id, a.slug, al._locale, al.title, al.excerpt
       FROM lpv.articles_locales al
       JOIN lpv.articles a ON a.id = al._parent_id
       WHERE al.title   ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh'
          OR al.excerpt ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh'`,
  )
  console.log(`\n=== 1. TP.HCM matches in articles_locales ===`)
  console.log(`Found ${candidates1.rowCount} row(s):`)
  for (const r of candidates1.rows) {
    console.log(`  [${r._locale}] ${r.slug}`)
    if (r.title?.match(/TP\.HCM|TP\.\s*Hồ Chí Minh/))
      console.log(`    title:   ${r.title}`)
    if (r.excerpt?.match(/TP\.HCM|TP\.\s*Hồ Chí Minh/))
      console.log(`    excerpt: ${r.excerpt}`)
  }

  // --- 2. publication → release in EN excerpts ---
  const candidates2 = await client.query(
    `SELECT al.id, a.slug, al.excerpt
       FROM lpv.articles_locales al
       JOIN lpv.articles a ON a.id = al._parent_id
       WHERE al._locale = 'en' AND al.excerpt ~* 'publication'`,
  )
  console.log(`\n=== 2. 'publication' in EN excerpts ===`)
  console.log(`Found ${candidates2.rowCount} row(s):`)
  for (const r of candidates2.rows)
    console.log(`  ${r.slug}: ${r.excerpt}`)

  if (DRY_RUN) {
    console.log('\nDry run — no changes made.')
    process.exit(0)
  }

  // --- Live updates ---
  const upd1 = await client.query(
    `UPDATE lpv.articles_locales
        SET title   = regexp_replace(title,   'TP\\.HCM|TP\\.\\s*Hồ Chí Minh', 'Thành phố Hồ Chí Minh', 'g'),
            excerpt = regexp_replace(excerpt, 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh', 'Thành phố Hồ Chí Minh', 'g')
      WHERE (title   ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh')
         OR (excerpt ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh')
    RETURNING id`,
  )
  console.log(`\nUPDATED ${upd1.rowCount} row(s) for TP.HCM → Thành phố Hồ Chí Minh`)

  // Be more precise on publication: match the specific phrase so we don't
  // mangle accidental other uses (Education Publication, etc.).
  const upd2 = await client.query(
    `UPDATE lpv.articles_locales
        SET excerpt = regexp_replace(excerpt, 'publication', 'release', 'g')
      WHERE _locale = 'en' AND excerpt ~ 'publication'
    RETURNING id`,
  )
  console.log(`UPDATED ${upd2.rowCount} row(s) for 'publication' → 'release'`)

  // Verify
  const after1 = await client.query(
    `SELECT count(*)::int AS c FROM lpv.articles_locales WHERE title ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh' OR excerpt ~ 'TP\\.HCM|TP\\.\\s*Hồ Chí Minh'`,
  )
  const after2 = await client.query(
    `SELECT count(*)::int AS c FROM lpv.articles_locales WHERE _locale = 'en' AND excerpt ~ 'publication'`,
  )
  console.log(`\nVerification — TP.HCM remaining: ${after1.rows[0].c}, 'publication' remaining: ${after2.rows[0].c}`)
} catch (e) {
  console.error('FAIL:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
