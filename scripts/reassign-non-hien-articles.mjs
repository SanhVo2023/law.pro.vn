#!/usr/bin/env node
/**
 * F-002 — Reassign articles credited to Vo Thien Hien but not personally
 * authored by him to the canonical non-Hien byline "Apolo Editorial Team"
 * (slug: editorial-team).
 *
 * Hien-authored allowlist:
 *   - Edit the HIEN_AUTHORED set below before running.
 *   - "none" => reassign every vo-thien-hien article to editorial-team.
 *
 * Both VI and EN locales get PATCHed in one pass since `author` is a
 * non-localized relation field (same row, same value).
 *
 * Usage:
 *   node scripts/reassign-non-hien-articles.mjs --dry-run   # report only
 *   node scripts/reassign-non-hien-articles.mjs              # write changes
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

// Set to the article slugs that Mr Hien personally authored.
// Empty set => every vo-thien-hien byline is reassigned to editorial-team.
/** @type {Set<string>} */
const HIEN_AUTHORED = new Set([
  // e.g. 'binh-luan-an-le-09-2016-hop-dong-mua-ban-nha',
])

async function login() {
  const r = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!r.ok) throw new Error(`Login failed ${r.status}`)
  return (await r.json()).token
}

async function findAuthorIdBySlug(token, slug) {
  const r = await fetch(
    `${SITE}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const d = await r.json()
  if (!d?.totalDocs) throw new Error(`Author "${slug}" not found`)
  return d.docs[0].id
}

async function listAllArticles(token) {
  const all = []
  let page = 1
  while (true) {
    const r = await fetch(
      `${SITE}/api/articles?locale=vi&depth=0&limit=100&page=${page}`,
      { headers: { Authorization: `JWT ${token}` } },
    )
    const d = await r.json()
    all.push(...(d.docs || []))
    if (!d.hasNextPage) break
    page += 1
  }
  return all
}

async function patchAuthor(token, articleId, newAuthorId) {
  const r = await fetch(`${SITE}/api/articles/${articleId}`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ author: newAuthorId }),
  })
  if (!r.ok) {
    const t = await r.text().catch(() => '')
    throw new Error(`PATCH /articles/${articleId} → ${r.status} ${t.slice(0, 200)}`)
  }
}

async function main() {
  console.log(`MODE: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (will PATCH)'}`)
  console.log(`Server: ${SITE}`)
  console.log(`Hien-authored allowlist: ${HIEN_AUTHORED.size === 0 ? '(none — every Hien byline will reassign)' : [...HIEN_AUTHORED].join(', ')}\n`)

  const token = await login()
  console.log('Logged in.\n')

  const hienId = await findAuthorIdBySlug(token, 'vo-thien-hien')
  const editorialId = await findAuthorIdBySlug(token, 'editorial-team')
  console.log(`Authors: vo-thien-hien = ${hienId}, editorial-team = ${editorialId}\n`)

  const articles = await listAllArticles(token)
  console.log(`Total articles: ${articles.length}\n`)

  // Distribution audit
  let hienCount = 0
  let editorialCount = 0
  let otherCount = 0
  for (const a of articles) {
    if (a.author === hienId) hienCount += 1
    else if (a.author === editorialId) editorialCount += 1
    else otherCount += 1
  }
  console.log(`Current distribution: vo-thien-hien=${hienCount}, editorial-team=${editorialCount}, other=${otherCount}\n`)

  const toReassign = articles.filter(
    (a) => a.author === hienId && !HIEN_AUTHORED.has(a.slug),
  )
  console.log(`To reassign (${toReassign.length}):`)
  for (const a of toReassign) console.log(`  ~ ${a.slug}`)
  console.log('')

  const toKeep = articles.filter(
    (a) => a.author === hienId && HIEN_AUTHORED.has(a.slug),
  )
  if (toKeep.length) {
    console.log(`Keeping Hien byline (${toKeep.length}):`)
    for (const a of toKeep) console.log(`  · ${a.slug}`)
    console.log('')
  }

  if (DRY_RUN) {
    console.log(`Dry run complete. Re-run without --dry-run to PATCH ${toReassign.length} article(s).`)
    return
  }

  let ok = 0
  for (const a of toReassign) {
    try {
      await patchAuthor(token, a.id, editorialId)
      console.log(`UPDATED ${a.slug} → editorial-team`)
      ok += 1
      await new Promise((r) => setTimeout(r, 150))
    } catch (e) {
      console.error(`FAILED ${a.slug}: ${e.message}`)
    }
  }
  console.log(`\nReassigned ${ok}/${toReassign.length} articles.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
