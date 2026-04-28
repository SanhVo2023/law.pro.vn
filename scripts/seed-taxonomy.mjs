#!/usr/bin/env node
/**
 * Seed categories, tags, authors, series via the Payload REST API.
 * Idempotent — skips entries that already exist (matched by slug).
 *
 * Usage: node scripts/seed-taxonomy.mjs
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}

const CATEGORIES = [
  {
    slug: 'thuc-tien-xet-xu',
    slugEn: 'court-practice-vietnam',
    order: 1,
    name: { vi: 'Thực tiễn xét xử', en: 'Court Practice' },
    description: {
      vi: 'Phân tích thực tiễn xét xử của các cấp toà án Việt Nam, xu hướng giải quyết tranh chấp và những bản án định hình ngành luật.',
      en: 'Analysis of how Vietnamese courts adjudicate disputes — practice trends, recurring reasoning, and the judgments shaping the profession.',
    },
  },
  {
    slug: 'chien-luoc-ho-so',
    slugEn: 'litigation-strategy-vietnam',
    order: 2,
    name: { vi: 'Chiến lược hồ sơ', en: 'Litigation Strategy' },
    description: {
      vi: 'Chiến lược tố tụng, chuẩn bị hồ sơ kiện và quản lý rủi ro tố tụng cho luật sư hành nghề tại Việt Nam.',
      en: 'Litigation strategy, case-file preparation and procedural risk management for practising counsel in Vietnam.',
    },
  },
  {
    slug: 'danh-gia-chung-cu',
    slugEn: 'evidence-assessment-vietnam',
    order: 3,
    name: { vi: 'Đánh giá chứng cứ', en: 'Evidence Assessment' },
    description: {
      vi: 'Nguyên tắc đánh giá chứng cứ trong tố tụng dân sự Việt Nam — chứng cứ điện tử, văn bản, giám định, lời khai và gánh nặng chứng minh.',
      en: 'Principles of evidence assessment in Vietnamese civil procedure — documentary, electronic, expert and witness evidence, and the burden of proof.',
    },
  },
  {
    slug: 'ky-nang-tranh-tung',
    slugEn: 'procedural-practice-vietnam',
    order: 4,
    name: { vi: 'Kỹ năng tranh tụng', en: 'Procedural Practice' },
    description: {
      vi: 'Kỹ năng tranh tụng tại toà — trình bày, hỏi và đối chất, viết bản luận cứ, đàm phán hoà giải, quản lý thời hiệu tố tụng.',
      en: 'Courtroom advocacy skills: oral presentation, examination and cross-examination, written argument, mediation, and timeline management.',
    },
  },
  {
    slug: 'goc-nhin-nghe-luat',
    slugEn: 'professional-perspective',
    order: 5,
    name: { vi: 'Góc nhìn nghề luật', en: 'Professional Perspective' },
    description: {
      vi: 'Quan điểm và kinh nghiệm của luật sư hành nghề tại Việt Nam — đạo đức, công nghệ, quan hệ luật sư–thân chủ, sự nghiệp.',
      en: 'Personal essays and perspectives from practising lawyers in Vietnam — ethics, technology, the lawyer–client relationship, and career.',
    },
  },
  {
    slug: 'binh-luan-ban-an',
    slugEn: 'case-commentary-vietnam',
    order: 6,
    name: { vi: 'Bình luận bản án', en: 'Case Commentary' },
    description: {
      vi: 'Bình luận và phân tích các bản án tiêu biểu tại Việt Nam — tranh chấp hợp đồng, lao động, đất đai, hôn nhân gia đình, doanh nghiệp.',
      en: 'Commentary and analysis of notable Vietnamese judgments — contract, labour, land, family, and corporate disputes.',
    },
  },
]

const TAGS = [
  { slug: 'tranh-chap-hop-dong',     name: { vi: 'Tranh chấp hợp đồng',     en: 'Contract dispute' } },
  { slug: 'dat-dai',                 name: { vi: 'Đất đai',                 en: 'Land law' } },
  { slug: 'lao-dong',                name: { vi: 'Lao động',                en: 'Labour' } },
  { slug: 'hon-nhan-gia-dinh',       name: { vi: 'Hôn nhân & gia đình',     en: 'Family law' } },
  { slug: 'doanh-nghiep',            name: { vi: 'Doanh nghiệp',            en: 'Corporate' } },
  { slug: 'an-le',                   name: { vi: 'Án lệ',                   en: 'Precedent' } },
  { slug: 'chung-cu-dien-tu',        name: { vi: 'Chứng cứ điện tử',        en: 'Electronic evidence' } },
  { slug: 'phuc-tham',               name: { vi: 'Phúc thẩm',               en: 'Appeal' } },
  { slug: 'trong-tai',               name: { vi: 'Trọng tài',               en: 'Arbitration' } },
  { slug: 'dao-duc-nghe-nghiep',     name: { vi: 'Đạo đức nghề nghiệp',     en: 'Professional ethics' } },
  { slug: 'ky-nang-luat-su',         name: { vi: 'Kỹ năng luật sư',         en: 'Lawyer skills' } },
  { slug: 'cong-nghe-phap-ly',       name: { vi: 'Công nghệ pháp lý',       en: 'Legal technology' } },
]

const AUTHORS = [
  {
    slug: 'vo-thien-hien',
    name: 'Võ Thiên Hiển',
    title: { vi: 'Luật sư Điều hành — Apolo Lawyers', en: 'Managing Partner — Apolo Lawyers' },
    bioMd: {
      vi:
`Võ Thiên Hiển (Henry Vo) là Luật sư Điều hành Công ty Luật Apolo Lawyers, có hơn 15 năm kinh nghiệm tham gia tố tụng dân sự, tranh chấp doanh nghiệp và tư vấn pháp lý cho các tổ chức trong và ngoài nước tại Việt Nam.

Ông đã tham gia hàng trăm vụ tranh tụng cấp sơ thẩm và phúc thẩm, đặc biệt trong các lĩnh vực hợp đồng thương mại, đất đai và doanh nghiệp. Bài viết của ông tập trung vào **chiến lược tố tụng**, **đánh giá chứng cứ** và **bình luận án lệ**.`,
      en:
`Vo Thien Hien (Henry Vo) is the Managing Partner of Apolo Lawyers Law Firm in Vietnam, with over 15 years of litigation and advisory experience for domestic and international clients.

He has appeared in hundreds of first-instance and appellate proceedings, with particular focus on commercial contract, land and corporate disputes. His writing focuses on **litigation strategy**, **evidence assessment** and **precedent commentary**.`,
    },
    credentials: [
      { label: { vi: 'Thẻ luật sư — Liên đoàn Luật sư Việt Nam', en: 'Bar member — Vietnam Bar Federation' }, year: 2010 },
      { label: { vi: 'Thạc sĩ Luật — Đại học Luật TP.HCM',         en: 'LLM — Ho Chi Minh City University of Law' }, year: 2015 },
    ],
    expertise: {
      vi: ['Tố tụng dân sự', 'Tranh chấp hợp đồng', 'Đất đai', 'Doanh nghiệp', 'Trọng tài thương mại'],
      en: ['Civil litigation', 'Contract disputes', 'Land law', 'Corporate', 'Commercial arbitration'],
    },
    email: 'contact@apolo.com.vn',
  },
  {
    slug: 'editorial-team',
    name: 'Apolo Editorial Team',
    title: { vi: 'Ban biên tập — law.pro.vn', en: 'Editorial Team — law.pro.vn' },
    bioMd: {
      vi:
`Ban biên tập tạp chí law.pro.vn gồm các luật sư hành nghề thuộc Công ty Luật Apolo Lawyers cùng cộng tác viên là chuyên gia pháp lý và giảng viên luật. Nội dung được biên tập kỹ lưỡng theo nguyên tắc *peer review* nội bộ, dẫn nguồn đầy đủ và cập nhật thường xuyên theo những thay đổi của pháp luật.`,
      en:
`The editorial team at law.pro.vn is drawn from practising lawyers at Apolo Lawyers and contributing legal academics. Articles go through internal peer review, are fully cited, and are kept current with developments in Vietnamese law.`,
    },
    credentials: [],
    expertise: { vi: ['Biên tập pháp lý', 'Phân tích bản án'], en: ['Legal editorial', 'Case analysis'] },
    email: 'editorial@apolo.com.vn',
  },
]

async function login() {
  const res = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed ${res.status}`)
  return (await res.json()).token
}

async function findBySlug(token, collection, slug) {
  const r = await fetch(
    `${SITE}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const d = await r.json()
  return d?.totalDocs > 0 ? d.docs[0] : null
}

async function createOrUpdate(token, collection, viPayload, enPatch) {
  const existing = await findBySlug(token, collection, viPayload.slug)
  if (existing) {
    console.log(`SKIP ${collection}/${viPayload.slug} (id=${existing.id})`)
    return existing
  }
  const res = await fetch(`${SITE}/api/${collection}?locale=vi`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(viPayload),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`POST /${collection} failed ${res.status}: ${t.slice(0, 300)}`)
  }
  const created = (await res.json()).doc
  if (enPatch) {
    await fetch(`${SITE}/api/${collection}/${created.id}?locale=en`, {
      method: 'PATCH',
      headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(enPatch),
    })
  }
  console.log(`CREATED ${collection}/${viPayload.slug} (id=${created.id})`)
  return created
}

async function seedCategories(token) {
  for (const c of CATEGORIES) {
    await createOrUpdate(
      token,
      'categories',
      { slug: c.slug, slugEn: c.slugEn, order: c.order, name: c.name.vi, description: c.description.vi },
      { name: c.name.en, description: c.description.en },
    )
  }
}

async function seedTags(token) {
  for (const t of TAGS) {
    await createOrUpdate(token, 'tags', { slug: t.slug, name: t.name.vi }, { name: t.name.en })
  }
}

async function seedAuthors(token) {
  const { markdownToLexical } = await import('./lib/markdown-to-lexical.mjs')
  for (const a of AUTHORS) {
    await createOrUpdate(
      token,
      'authors',
      {
        slug: a.slug,
        name: a.name,
        title: a.title.vi,
        bio: markdownToLexical(a.bioMd.vi),
        credentials: a.credentials.map((c) => ({ label: c.label.vi, year: c.year })),
        expertise: a.expertise.vi.map((area) => ({ area })),
        email: a.email,
      },
      {
        title: a.title.en,
        bio: markdownToLexical(a.bioMd.en),
        credentials: a.credentials.map((c) => ({ label: c.label.en, year: c.year })),
        expertise: a.expertise.en.map((area) => ({ area })),
      },
    )
  }
}

async function main() {
  const token = await login()
  console.log('Logged in.')
  console.log('\n— Categories —')
  await seedCategories(token)
  console.log('\n— Tags —')
  await seedTags(token)
  console.log('\n— Authors —')
  await seedAuthors(token)
  console.log('\nTaxonomy seed complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
