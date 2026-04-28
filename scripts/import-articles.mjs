#!/usr/bin/env node
/**
 * Import pre-generated SEO articles from tools/seo-content-writer/output/law.pro.vn/
 * into the Articles collection. Idempotent — skips articles whose slug already exists.
 *
 * Usage: node scripts/import-articles.mjs
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { markdownToLexical } from './lib/markdown-to-lexical.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const articlesDir = path.resolve(root, '../../../tools/seo-content-writer/output/law.pro.vn')

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}

const CONTENT_TYPE_BY_CATEGORY = {
  'thuc-tien-xet-xu':     'analysis',
  'chien-luoc-ho-so':     'practice-note',
  'danh-gia-chung-cu':    'practice-note',
  'ky-nang-tranh-tung':   'practice-note',
  'goc-nhin-nghe-luat':   'essay',
  'binh-luan-ban-an':     'case-commentary',
}

async function login() {
  const res = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed ${res.status}`)
  return (await res.json()).token
}

async function findOne(token, collection, where) {
  const qs = Object.entries(where)
    .map(([k, v]) => `where[${k}][equals]=${encodeURIComponent(v)}`)
    .join('&')
  const r = await fetch(`${SITE}/api/${collection}?${qs}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const d = await r.json()
  return d?.totalDocs > 0 ? d.docs[0] : null
}

async function buildIndex(token, collection) {
  const map = new Map()
  let page = 1
  while (true) {
    const r = await fetch(`${SITE}/api/${collection}?limit=200&page=${page}&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const d = await r.json()
    for (const doc of d.docs || []) {
      if (doc.slug) map.set(doc.slug, doc.id)
    }
    if (!d.hasNextPage) break
    page += 1
  }
  return map
}

async function buildThumbnailTemplateIndex(token) {
  // Returns Map<categorySlug, mediaId>
  const map = new Map()
  const slugs = [
    'thuc-tien-xet-xu',
    'chien-luoc-ho-so',
    'danh-gia-chung-cu',
    'ky-nang-tranh-tung',
    'goc-nhin-nghe-luat',
    'binh-luan-ban-an',
  ]
  for (const slug of slugs) {
    const r = await fetch(
      `${SITE}/api/media?where[filename][like]=${encodeURIComponent(`thumb-template-${slug}`)}&limit=1&depth=0`,
      { headers: { Authorization: `JWT ${token}` } },
    )
    const d = await r.json()
    if (d?.totalDocs > 0) map.set(slug, d.docs[0].id)
  }
  return map
}

async function importArticle(token, indices, file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))

  // Already imported?
  const existing = await findOne(token, 'articles', { slug: data.slug })
  if (existing) {
    console.log(`SKIP ${data.slug} (id=${existing.id})`)
    return existing
  }

  const categoryId = indices.categories.get(data.category)
  if (!categoryId) {
    throw new Error(`Unknown category slug "${data.category}" for ${data.slug}`)
  }
  const authorId = indices.authors.get('vo-thien-hien')

  // Find slug_en counterpart from category mapping
  const categoryMap = {
    'thuc-tien-xet-xu':   'court-practice-vietnam',
    'chien-luoc-ho-so':   'litigation-strategy-vietnam',
    'danh-gia-chung-cu':  'evidence-assessment-vietnam',
    'ky-nang-tranh-tung': 'procedural-practice-vietnam',
    'goc-nhin-nghe-luat': 'professional-perspective',
    'binh-luan-ban-an':   'case-commentary-vietnam',
  }

  // VI create
  const featuredImageId = indices.thumbnailTemplates?.get(data.category)
  const viPayload = {
    title: data.title_vi,
    slug: data.slug,
    slugEn: data.slug, // we keep the same slug across locales for simplicity unless overridden
    excerpt: data.excerpt_vi,
    content: markdownToLexical(data.content_vi),
    category: categoryId,
    author: authorId,
    publishedDate: new Date().toISOString().slice(0, 10),
    contentType: CONTENT_TYPE_BY_CATEGORY[data.category] || 'analysis',
    ...(featuredImageId ? { featuredImage: featuredImageId } : {}),
  }

  const post = await fetch(`${SITE}/api/articles?locale=vi`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(viPayload),
  })
  if (!post.ok) {
    const t = await post.text().catch(() => '')
    throw new Error(`POST /articles failed for ${data.slug}: ${post.status}\n${t.slice(0, 500)}`)
  }
  const created = (await post.json()).doc

  // EN locale patch
  const enPayload = {
    title: data.title_en,
    excerpt: data.excerpt_en,
    content: markdownToLexical(data.content_en),
  }
  const patch = await fetch(`${SITE}/api/articles/${created.id}?locale=en`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(enPayload),
  })
  if (!patch.ok) {
    const t = await patch.text().catch(() => '')
    throw new Error(`PATCH /articles/${created.id} (en) failed: ${patch.status}\n${t.slice(0, 500)}`)
  }
  console.log(`CREATED ${data.slug} (id=${created.id}, category=${data.category})`)
  return created
}

async function main() {
  if (!fs.existsSync(articlesDir)) {
    console.error(`Articles directory not found: ${articlesDir}`)
    process.exit(1)
  }
  const files = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.json'))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => path.join(articlesDir, f))

  console.log(`Found ${files.length} article JSON files in ${articlesDir}`)

  const token = await login()
  console.log('Logged in.')

  console.log('Indexing categories + authors + thumbnail templates...')
  const indices = {
    categories: await buildIndex(token, 'categories'),
    authors: await buildIndex(token, 'authors'),
    thumbnailTemplates: await buildThumbnailTemplateIndex(token),
  }
  console.log(`  ${indices.categories.size} categories, ${indices.authors.size} authors, ${indices.thumbnailTemplates.size} thumbnail templates indexed`)

  const created = []
  const failed = []
  for (const file of files) {
    try {
      const doc = await importArticle(token, indices, file)
      created.push({ slug: doc.slug || path.basename(file), id: doc.id })
      await new Promise((r) => setTimeout(r, 200))
    } catch (e) {
      console.error(`FAILED ${path.basename(file)}: ${e.message}`)
      failed.push({ file: path.basename(file), error: e.message })
    }
  }

  console.log(`\nImport complete — ${created.length} created/skipped, ${failed.length} failed.`)
  if (failed.length) {
    console.log('Failed:')
    console.table(failed)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
