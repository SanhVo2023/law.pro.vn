#!/usr/bin/env node
/**
 * F-005 — Vietnamese spelling sweep (Mr Hien 17/5/2026 xlsx items 3.0–7.0).
 *
 * Substitutions (word-boundary aware, case-preserving):
 *   hoá → hóa     (e.g. chuyển hoá → chuyển hóa)
 *   toà → tòa     (e.g. toà án → tòa án)
 *   hoà → hòa     (e.g. hoà giải → hòa giải)
 *   hòan → hoàn   (typo)
 *   tòan → toàn   (typo)
 *
 * Targets:
 *   - All articles' `title`, `excerpt`, and `content` (Lexical) in both VI + EN
 *     locales — direct SQL UPDATE on lpv.articles + lpv.articles_locales.
 *   - Authors' bios (lpv.authors_locales).
 *   - Categories' descriptions (lpv.categories_locales).
 *
 * Static source files are swept separately via grep/edit by the agent.
 *
 * The Lexical content lives as JSONB; we serialize the text nodes, run the
 * substitution, deserialize. Word-boundary matching is enforced with \b
 * lookarounds to avoid changing mid-word matches like `tha hóa` (where
 * `hóa` is correct already) or `hoặc` (which contains no `hoá`).
 *
 * Usage:
 *   node scripts/fix-vn-spelling.mjs --dry-run
 *   node scripts/fix-vn-spelling.mjs
 */
import 'dotenv/config'
import pg from 'pg'

const URI = process.env.DATABASE_URI
if (!URI) {
  console.error('DATABASE_URI required')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

// Order matters: typos first (hòan → hoàn) so we don't double-rewrite,
// then the orthographic updates.
// Use Unicode-aware word boundaries; \b in JS regex won't trigger on
// non-ASCII chars, so we use lookarounds around Vietnamese letter class.
const VN_LETTER = '[A-Za-zÀ-ỹ]'
const RULES = [
  { from: 'hòan', to: 'hoàn' },
  { from: 'tòan', to: 'toàn' },
  { from: 'hoá', to: 'hóa' },
  { from: 'toà', to: 'tòa' },
  { from: 'hoà', to: 'hòa' },
]

function rewrite(input) {
  if (typeof input !== 'string') return { value: input, hits: 0 }
  let out = input
  let hits = 0
  for (const { from, to } of RULES) {
    // word-boundary: char before+after must NOT be Vietnamese letters.
    const re = new RegExp(`(?<!${VN_LETTER})${from}(?!${VN_LETTER})`, 'g')
    out = out.replace(re, () => { hits += 1; return to })
  }
  return { value: out, hits }
}

function walkLexical(node, stats) {
  if (!node || typeof node !== 'object') return node
  if (typeof node.text === 'string') {
    const { value, hits } = rewrite(node.text)
    if (hits > 0) {
      node.text = value
      stats.textNodes += 1
      stats.hits += hits
    }
  }
  if (Array.isArray(node.children)) {
    for (const c of node.children) walkLexical(c, stats)
  }
  if (node.root) walkLexical(node.root, stats)
  return node
}

const client = new pg.Client({ connectionString: URI })

try {
  await client.connect()

  const reports = []

  // 1) Articles — title, excerpt, content via articles_locales
  const articleLocs = await client.query(
    `SELECT id, _parent_id, _locale, title, excerpt, content FROM lpv.articles_locales`,
  )
  for (const row of articleLocs.rows) {
    const stats = { textNodes: 0, hits: 0 }
    const titleR = rewrite(row.title || '')
    const excerptR = rewrite(row.excerpt || '')
    let nextContent = row.content
    if (row.content) {
      nextContent = JSON.parse(JSON.stringify(row.content))
      walkLexical(nextContent, stats)
    }
    const totalHits = titleR.hits + excerptR.hits + stats.hits
    if (totalHits > 0) {
      reports.push({
        table: 'articles_locales',
        id: row.id,
        parent: row._parent_id,
        locale: row._locale,
        hits: totalHits,
        title_hits: titleR.hits,
        excerpt_hits: excerptR.hits,
        content_hits: stats.hits,
      })
      if (!DRY_RUN) {
        await client.query(
          `UPDATE lpv.articles_locales SET title = $1, excerpt = $2, content = $3::jsonb WHERE id = $4`,
          [titleR.value, excerptR.value, JSON.stringify(nextContent), row.id],
        )
      }
    }
  }

  // 2) Authors — bio
  const authorLocs = await client.query(
    `SELECT id, _parent_id, _locale, bio, title FROM lpv.authors_locales`,
  )
  for (const row of authorLocs.rows) {
    const stats = { textNodes: 0, hits: 0 }
    const titleR = rewrite(row.title || '')
    let nextBio = row.bio
    if (row.bio) {
      nextBio = JSON.parse(JSON.stringify(row.bio))
      walkLexical(nextBio, stats)
    }
    const totalHits = titleR.hits + stats.hits
    if (totalHits > 0) {
      reports.push({
        table: 'authors_locales',
        id: row.id,
        parent: row._parent_id,
        locale: row._locale,
        hits: totalHits,
        title_hits: titleR.hits,
        bio_hits: stats.hits,
      })
      if (!DRY_RUN) {
        await client.query(
          `UPDATE lpv.authors_locales SET title = $1, bio = $2::jsonb WHERE id = $3`,
          [titleR.value, JSON.stringify(nextBio), row.id],
        )
      }
    }
  }

  // 3) Categories — description
  const catLocs = await client.query(
    `SELECT id, _parent_id, _locale, name, description FROM lpv.categories_locales`,
  )
  for (const row of catLocs.rows) {
    const nameR = rewrite(row.name || '')
    const descR = rewrite(row.description || '')
    if (nameR.hits + descR.hits > 0) {
      reports.push({
        table: 'categories_locales',
        id: row.id,
        parent: row._parent_id,
        locale: row._locale,
        hits: nameR.hits + descR.hits,
      })
      if (!DRY_RUN) {
        await client.query(
          `UPDATE lpv.categories_locales SET name = $1, description = $2 WHERE id = $3`,
          [nameR.value, descR.value, row.id],
        )
      }
    }
  }

  console.log(`MODE: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`\nFound ${reports.length} rows with spelling hits:`)
  for (const r of reports) {
    console.log(`  ${r.table} id=${r.id} parent=${r.parent} locale=${r.locale} hits=${r.hits}`)
  }
  console.log(`\nTotal hits: ${reports.reduce((s, r) => s + r.hits, 0)}`)
} catch (e) {
  console.error('FAIL:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
