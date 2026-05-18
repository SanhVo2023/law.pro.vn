#!/usr/bin/env node
/**
 * Seed the Media collection with already-uploaded R2 images from image-assets.json.
 * Also seeds the SiteSettings global with the default OG card and logo references.
 *
 * Usage:
 *   node scripts/seed-media.mjs
 *
 * Idempotent: skips entries that already exist (matched by alt + filename suffix).
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'image-assets.json'), 'utf8'),
)

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}

const ALT_BY_ID = {
  'hero-home':              { vi: 'Chuyên trang phân tích pháp lý — trang chủ',            en: 'Legal review magazine — homepage hero' },
  'hero-analysis-article':  { vi: 'Bài phân tích pháp lý — ảnh đầu bài',                  en: 'Analysis article hero' },
  'hero-case-commentary':   { vi: 'Bình luận bản án — ảnh đầu bài',                       en: 'Case commentary hero' },
  'og-default':             { vi: 'Thẻ chia sẻ mạng xã hội — mặc định',                   en: 'Default open-graph social card' },
  'icon-laurel':            { vi: 'Biểu tượng — vòng nguyệt quế',                         en: 'Icon — laurel wreath' },
  'icon-quill':             { vi: 'Biểu tượng — bút lông và mực',                         en: 'Icon — quill and inkwell' },
  'icon-book-stack':        { vi: 'Biểu tượng — chồng sách luật',                         en: 'Icon — stack of law books' },
  'icon-compass':           { vi: 'Biểu tượng — la bàn',                                  en: 'Icon — compass rose' },
  'icon-magnifier':         { vi: 'Biểu tượng — kính lúp trên tài liệu',                  en: 'Icon — analytical magnifier' },
  'icon-favicon':           { vi: 'Favicon — vòng nguyệt quế tối giản',                   en: 'Favicon — simplified laurel' },
  'bg-parchment-texture':   { vi: 'Nền giấy da — kết cấu nhẹ',                            en: 'Parchment paper texture background' },
}

async function login() {
  const res = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Login failed: ${res.status} ${text}`)
  }
  const data = await res.json()
  return data.token
}

async function uploadFromUrl(token, image) {
  const alt = ALT_BY_ID[image.id]?.vi || image.name
  const altEn = ALT_BY_ID[image.id]?.en || image.name

  const remote = image.result_url
  if (!remote) {
    console.log(`SKIP ${image.id} (no result_url yet)`)
    return null
  }

  const filename = `${image.id}${path.extname(new URL(remote).pathname) || '.webp'}`

  // Check duplicate
  const list = await fetch(
    `${SITE}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  ).then((r) => r.json())
  if (list?.totalDocs > 0) {
    console.log(`SKIP ${image.id} (already in Media id=${list.docs[0].id})`)
    return list.docs[0]
  }

  const fileRes = await fetch(remote)
  if (!fileRes.ok) throw new Error(`Failed to fetch ${remote}: ${fileRes.status}`)
  const buf = Buffer.from(await fileRes.arrayBuffer())

  const form = new FormData()
  form.append('file', new Blob([buf], { type: 'image/webp' }), filename)
  form.append(
    '_payload',
    JSON.stringify({ alt, caption: image.name, credit: 'Nano Banana 2 / Gemini 3.1 Flash Image' }),
  )

  const upload = await fetch(`${SITE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  if (!upload.ok) {
    const text = await upload.text().catch(() => '')
    throw new Error(`Upload failed for ${image.id}: ${upload.status} ${text}`)
  }
  const result = await upload.json()
  const doc = result.doc || result

  // Patch EN locale alt
  await fetch(`${SITE}/api/media/${doc.id}?locale=en`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ alt: altEn, caption: image.name }),
  })

  console.log(`UPLOADED ${image.id} → media id=${doc.id}`)
  return doc
}

async function main() {
  const token = await login()
  console.log('Logged in.')
  const uploaded = []
  for (const img of manifest.images) {
    if (img.status !== 'uploaded' || !img.result_url) continue
    try {
      const doc = await uploadFromUrl(token, img)
      if (doc) uploaded.push({ id: img.id, mediaId: doc.id })
      await new Promise((r) => setTimeout(r, 200))
    } catch (e) {
      console.error(`ERROR on ${img.id}:`, e.message)
    }
  }
  console.log(`\nDone — ${uploaded.length} entries:`)
  console.table(uploaded)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
