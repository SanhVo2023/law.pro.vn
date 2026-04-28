#!/usr/bin/env node
/**
 * One-shot: walk all articles, compute reading time from Lexical content
 * and PATCH it back. Reads VI body for VI count (200 wpm), EN body for EN count
 * (250 wpm) — but the Articles collection only has a single `readingTime` field
 * (not localised), so we use the VI body since that's the primary locale.
 *
 * Usage: node scripts/backfill-reading-time.mjs
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set')
  process.exit(1)
}

function extractText(n) {
  if (!n) return ''
  if (typeof n === 'string') return n
  if (Array.isArray(n)) return n.map(extractText).join(' ')
  if (typeof n === 'object') {
    if (typeof n.text === 'string') return n.text
    if (n.root?.children) return extractText(n.root.children)
    if (n.children) return extractText(n.children)
  }
  return ''
}

async function login() {
  const r = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!r.ok) throw new Error(`Login failed ${r.status}`)
  return (await r.json()).token
}

async function main() {
  const token = await login()
  let page = 1
  const updated = []
  while (true) {
    const r = await fetch(`${SITE}/api/articles?locale=vi&depth=0&limit=50&page=${page}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const d = await r.json()
    for (const a of d.docs || []) {
      const text = extractText(a.content)
      const words = text.split(/\s+/).filter(Boolean).length
      const minutes = Math.max(1, Math.round(words / 200))
      if (a.readingTime === minutes) {
        console.log(`SKIP ${a.slug} (already ${minutes} min)`)
        continue
      }
      const p = await fetch(`${SITE}/api/articles/${a.id}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ readingTime: minutes }),
      })
      if (!p.ok) {
        const t = await p.text().catch(() => '')
        console.error(`FAIL ${a.slug}: ${p.status} ${t.slice(0, 200)}`)
        continue
      }
      console.log(`UPDATE ${a.slug} → ${minutes} min (${words} words)`)
      updated.push({ slug: a.slug, minutes, words })
    }
    if (!d.hasNextPage) break
    page += 1
  }
  console.log(`\n${updated.length} articles updated.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
