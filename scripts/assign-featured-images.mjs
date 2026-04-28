#!/usr/bin/env node
/**
 * Backfill featuredImage on existing articles using per-category thumbnail templates.
 *
 * Looks up Media records whose filename starts with `thumb-template-{category-slug}`
 * (created by scripts/seed-media.mjs after image-generator-ui /batch uploads them),
 * and assigns the matching template as `featuredImage` on every article in that
 * category that has no featuredImage set.
 *
 * Idempotent — skips articles that already have a featuredImage.
 *
 * Usage: node scripts/assign-featured-images.mjs
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set')
  process.exit(1)
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

async function findMediaByPrefix(token, prefix) {
  const r = await fetch(
    `${SITE}/api/media?where[filename][like]=${encodeURIComponent(prefix)}&limit=1&depth=0`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const d = await r.json()
  return d?.totalDocs > 0 ? d.docs[0] : null
}

async function main() {
  const token = await login()
  console.log('Logged in.')

  // Build category-slug → template-media-id map
  const categoryRes = await fetch(`${SITE}/api/categories?limit=20&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const categories = (await categoryRes.json()).docs || []
  const templateByCategory = new Map()

  for (const cat of categories) {
    const media = await findMediaByPrefix(token, `thumb-template-${cat.slug}`)
    if (media?.id) {
      templateByCategory.set(cat.id, { mediaId: media.id, slug: cat.slug })
      console.log(`  ${cat.slug} → media id=${media.id}`)
    } else {
      console.log(`  ${cat.slug} → no template yet (skip)`)
    }
  }

  if (templateByCategory.size === 0) {
    console.log('\nNo thumbnail templates found in Media. Run image-generator-ui /batch first, then `node scripts/seed-media.mjs`, then re-run this script.')
    return
  }

  // Walk all articles
  let page = 1
  const updated = []
  const skipped = []
  while (true) {
    const r = await fetch(`${SITE}/api/articles?locale=vi&depth=0&limit=50&page=${page}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const d = await r.json()
    for (const a of d.docs || []) {
      if (a.featuredImage) {
        skipped.push(a.slug)
        continue
      }
      const tpl = templateByCategory.get(a.category)
      if (!tpl) {
        skipped.push(a.slug)
        continue
      }
      const p = await fetch(`${SITE}/api/articles/${a.id}`, {
        method: 'PATCH',
        headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredImage: tpl.mediaId }),
      })
      if (!p.ok) {
        const t = await p.text().catch(() => '')
        console.error(`FAIL ${a.slug}: ${p.status} ${t.slice(0, 200)}`)
        continue
      }
      console.log(`UPDATE ${a.slug} → media id=${tpl.mediaId} (${tpl.slug})`)
      updated.push({ slug: a.slug, mediaId: tpl.mediaId })
    }
    if (!d.hasNextPage) break
    page += 1
  }

  console.log(`\n${updated.length} articles updated, ${skipped.length} skipped.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
