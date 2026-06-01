#!/usr/bin/env node
/**
 * Seed the Footer global (both locales) with the footer's current built-in
 * content, so editing it in the admin drives the live footer.
 *
 * Idempotent: re-running overwrites the footer global with these canonical
 * values. Run against a running server (dev or `next start`):
 *   node scripts/seed-footer.mjs [port]            (default 3000)
 *
 * Auth via JWT header (no Origin → bypasses CSRF). `linkColumns` and `offices`
 * are localized arrays, so each locale is POSTed independently.
 *
 * Sources mirrored here (keep in sync if these change):
 *   - offices  ← src/lib/identity.ts (canonical address.txt)
 *   - sections ← src/lib/sections.ts + i18n routing pathnames
 *   - strings  ← messages/{vi,en}.json (site/footer/nav)
 */
import fs from 'node:fs'

const PORT = process.argv[2] || '3000'
const BASE = `http://localhost:${PORT}`
const root = new URL('../', import.meta.url)
const env = fs.readFileSync(new URL('.env', root), 'utf8')
const EMAIL = env.match(/^SEED_ADMIN_EMAIL=(.+)$/m)?.[1]?.trim() || 'it@apolo.com.vn'
const PASS = env.match(/^SEED_ADMIN_PASSWORD=(.+)$/m)?.[1]?.trim()

const DATA = {
  vi: {
    brandName: 'The Apolo Review',
    brandTagline: 'Phân tích pháp lý chuyên sâu',
    intro:
      'Một sản phẩm thuộc hệ sinh thái Apolo Lawyers — không gian phân tích pháp lý chuyên sâu cho giới hành nghề.',
    linkColumns: [
      {
        heading: 'Chuyên mục',
        links: [
          { label: 'Thực tiễn xét xử', href: '/thuc-tien-xet-xu', external: false },
          { label: 'Chiến lược hồ sơ', href: '/chien-luoc-ho-so', external: false },
          { label: 'Đánh giá chứng cứ', href: '/danh-gia-chung-cu', external: false },
          { label: 'Kỹ năng tranh tụng', href: '/ky-nang-tranh-tung', external: false },
          { label: 'Góc nhìn nghề luật', href: '/goc-nhin-nghe-luat', external: false },
          { label: 'Bình luận bản án', href: '/binh-luan-ban-an', external: false },
        ],
      },
      { heading: 'Về chuyên trang', links: [{ label: 'Tác giả', href: '/tac-gia', external: false }] },
      {
        heading: 'Hệ sinh thái Apolo',
        links: [
          { label: 'apolo.com.vn', href: 'https://www.apolo.com.vn', external: true },
          { label: 'luatsutructuyen.vn', href: 'https://luatsutructuyen.vn', external: true },
          { label: 'vothienhien.com', href: 'https://vothienhien.com', external: true },
          { label: 'law.org.vn', href: 'https://law.org.vn', external: true },
        ],
      },
    ],
    offices: [
      {
        label: 'Trụ sở chính',
        name: 'Công ty Luật Apolo Lawyers',
        address: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh',
        email: 'contact@apolo.com.vn',
        phones: '(028) 66.701.709\n0903.419.479',
      },
      {
        label: 'Chi nhánh',
        name: 'Chi nhánh Đông Sài Gòn - Công ty Luật Apolo Lawyers',
        address:
          'Tầng 9, Tòa nhà K&M, 33 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh',
        email: '',
        phones: '(028) 35.059.349\n0903.419.479',
      },
    ],
    copyrightLine: '© 2026 CÔNG TY LUẬT APOLO LAWYERS',
  },
  en: {
    brandName: 'The Apolo Review',
    brandTagline: 'Vietnam Legal Analysis Review',
    intro:
      'Part of the Apolo Lawyers ecosystem — an editorial review of practitioner-grade legal analysis for the profession.',
    linkColumns: [
      {
        heading: 'Sections',
        links: [
          { label: 'Court Practice', href: '/court-practice-vietnam', external: false },
          { label: 'Litigation Strategy', href: '/litigation-strategy-vietnam', external: false },
          { label: 'Evidence Assessment', href: '/evidence-assessment-vietnam', external: false },
          { label: 'Procedural Practice', href: '/procedural-practice-vietnam', external: false },
          { label: 'Professional Perspective', href: '/professional-perspective', external: false },
          { label: 'Case Commentary', href: '/case-commentary-vietnam', external: false },
        ],
      },
      { heading: 'About the review', links: [{ label: 'Authors', href: '/authors', external: false }] },
      {
        heading: 'Apolo ecosystem',
        links: [
          { label: 'apololawyers.com', href: 'https://www.apololawyers.com', external: true },
          { label: 'luatsutructuyen.vn', href: 'https://luatsutructuyen.vn', external: true },
          { label: 'vothienhien.com', href: 'https://vothienhien.com', external: true },
          { label: 'law.org.vn', href: 'https://law.org.vn', external: true },
        ],
      },
    ],
    offices: [
      {
        label: 'Head Office',
        name: 'APOLO LAWYERS - Solicitors & Litigators',
        address: '108 Tran Dinh Xu Street, Cau Ong Lanh Ward, Ho Chi Minh City, Vietnam',
        email: 'contact@apolo.com.vn',
        phones: '(+8428) 66.701.709\n(+84) 903.419.479',
      },
      {
        label: 'Branch',
        name: 'EAST SAI GON BRANCH - APOLO LAWYERS LAWFIRM',
        address:
          '9th/F, Tower K&M Building, 33 Ung Van Khiem Street, Thanh My Tay Ward, Ho Chi Minh City, Vietnam',
        email: '',
        phones: '(+8428) 35.059.349\n(+84) 903.419.479',
      },
    ],
    copyrightLine: '© 2026 APOLO LAWYERS LAW FIRM',
  },
}

const lr = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASS }),
})
const token = (await lr.json().catch(() => ({})))?.token
console.log('LOGIN', lr.status, token ? 'ok' : 'NO TOKEN')
if (!token) process.exit(1)
const auth = { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' }

for (const locale of ['vi', 'en']) {
  const r = await fetch(`${BASE}/api/globals/footer?locale=${locale}`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify(DATA[locale]),
  })
  const j = await r.json().catch(() => ({}))
  console.log(
    `SEED ${locale} ->`,
    r.status,
    r.ok ? `cols=${j.result?.linkColumns?.length} offices=${j.result?.offices?.length}` : JSON.stringify(j.errors || j).slice(0, 300),
  )
}

// verify
for (const locale of ['vi', 'en']) {
  const g = await fetch(`${BASE}/api/globals/footer?locale=${locale}&depth=0`, { headers: auth }).then((r) => r.json())
  console.log(`VERIFY ${locale}: brand="${g.brandName}" cols=${g.linkColumns?.length} offices=${g.offices?.length} copyright="${g.copyrightLine}"`)
}
console.log('DONE')
