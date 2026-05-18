#!/usr/bin/env node
/**
 * Assign Media `photo` to existing authors AND restore missing VI localized
 * fields on credentials/expertise arrays (the EN patch in seed-taxonomy.mjs
 * inadvertently wiped the VI label/area values when re-writing the array).
 *
 * Slug → Media-filename-prefix map:
 *   vo-thien-hien   → author-vo-thien-hien
 *   editorial-team  → author-editorial-team
 *
 * Idempotent — re-runs are safe (re-PATCHes the same data).
 *
 * Usage: node scripts/backfill-author-photos.mjs
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set')
  process.exit(1)
}

const PHOTO_PREFIX_BY_AUTHOR = {
  'vo-thien-hien': 'author-vo-thien-hien',
  'editorial-team': 'author-editorial-team',
}

// Authoritative VI source — must match seed-taxonomy.mjs
const VI_DATA = {
  'vo-thien-hien': {
    credentials: [
      { label: 'Thẻ luật sư — Liên đoàn Luật sư Việt Nam', year: 2010 },
      { label: 'Thạc sĩ Luật — Đại học Luật Thành phố Hồ Chí Minh', year: 2015 },
    ],
    expertise: [
      { area: 'Tố tụng dân sự' },
      { area: 'Tranh chấp hợp đồng' },
      { area: 'Đất đai' },
      { area: 'Doanh nghiệp' },
      { area: 'Trọng tài thương mại' },
    ],
  },
  'editorial-team': {
    credentials: [],
    expertise: [{ area: 'Biên tập pháp lý' }, { area: 'Phân tích bản án' }],
  },
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

async function findAuthor(token, slug) {
  const r = await fetch(
    `${SITE}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const d = await r.json()
  return d?.totalDocs > 0 ? d.docs[0] : null
}

async function main() {
  const token = await login()
  console.log('Logged in.')

  const updated = []
  for (const [authorSlug, mediaPrefix] of Object.entries(PHOTO_PREFIX_BY_AUTHOR)) {
    const author = await findAuthor(token, authorSlug)
    if (!author) {
      console.log(`SKIP ${authorSlug} — author not found`)
      continue
    }

    const media = await findMediaByPrefix(token, mediaPrefix)
    if (!media?.id) {
      console.log(`SKIP ${authorSlug} — media ${mediaPrefix}* not found`)
      continue
    }

    const viPayload = {
      photo: media.id,
      ...VI_DATA[authorSlug],
    }

    const p = await fetch(`${SITE}/api/authors/${author.id}?locale=vi`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(viPayload),
    })
    if (!p.ok) {
      const t = await p.text().catch(() => '')
      console.error(`FAIL ${authorSlug}: ${p.status} ${t.slice(0, 300)}`)
      continue
    }
    console.log(`UPDATE ${authorSlug} → photo media id=${media.id}, VI fields restored`)
    updated.push({ authorSlug, mediaId: media.id })
  }

  console.log(`\n${updated.length} authors updated.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
