#!/usr/bin/env node
/**
 * Append one UNIQUE per-article thumbnail prompt to image-assets.json for
 * each of the 29 articles, so every post gets its own image instead of a
 * shared per-category template (Hien/Thach feedback: "all posts in a category
 * have the same image").
 *
 * Entry id = `post-{articleId}` → after image-generator-ui /batch sets
 * status:uploaded + result_url, scripts/seed-media.mjs creates a Media record
 * with filename `post-{articleId}.webp`, and scripts/assign-article-images.mjs
 * wires each article's featuredImage to it.
 *
 * Idempotent: re-running won't duplicate entries (matched by id).
 *
 * Usage: node scripts/append-article-image-prompts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const manifestPath = path.join(root, 'image-assets.json')

// Shared grade appended to every scene for editorial consistency.
const GRADE =
  'Documentary editorial photograph, shallow depth of field, warm low-key directional lighting, ' +
  'burgundy #6B1D2A / antique-gold #C9A84C / charcoal colour grade with parchment warmth, ' +
  'no readable text, no logos, no identifiable faces, professional Vietnamese legal setting.'

// articleId → { name (VI title), scene }
const POSTS = {
  // binh-luan-ban-an — case commentary
  26: { name: 'Bình luận Án lệ 09/2016 — hợp đồng mua bán nhà ở chưa công chứng', scene: 'Close-up of an open Vietnamese court precedent booklet on a walnut desk beside a ring of brass house keys resting on a property sale contract, a red pen marking an unsigned signature line.' },
  27: { name: 'Bình luận Án lệ 42/2021 — bồi thường vi phạm hợp đồng', scene: 'A brass balance scale on dark marble, one pan holding a small stack of antique coins, the other a folded contract document, beside an open precedent booklet with margin annotations.' },
  28: { name: 'Bình luận vụ ly hôn có yếu tố nước ngoài — quyền nuôi con', scene: 'Two passports from different countries fanned on a walnut desk beside a small wooden toy and a manila family-court folder, a softly blurred globe behind, contemplative mood.' },
  29: { name: 'Bình luận tranh chấp cổ đông thiểu số — Điều 153 LDN 2020', scene: 'A vintage share certificate and a corporate minute-book open on a boardroom table, a fountain pen and a small brass gavel on top, a printed ownership pie-chart with a thin minority slice highlighted in burgundy.' },

  // chien-luoc-ho-so — case-file strategy
  3:  { name: 'Chiến lược chuẩn bị hồ sơ khởi kiện dân sự', scene: 'Hands organising a civil lawsuit dossier with colour-tabbed dividers (burgundy, navy, gold) and a printed checklist on a polished walnut desk, a fountain pen alongside.' },
  4:  { name: 'Kỹ thuật soạn đơn khởi kiện đúng quy định', scene: 'An antique fountain pen poised over a freshly typed legal petition on cream letterhead, a brass paperweight holding the page down, warm low-angle light.' },
  15: { name: 'Chiến lược chuẩn bị hồ sơ tranh chấp đất đai', scene: 'A red Vietnamese land-use rights certificate and a folded cadastral map on a desk, a brass compass and ruler resting across them, analytical mood.' },
  16: { name: 'Kỹ thuật soạn hợp đồng phòng ngừa tranh chấp', scene: 'A bound contract document with an embossed gold seal and ribbon, an antique fountain pen laid diagonally, a magnifying glass resting on a clause.' },
  17: { name: 'Chiến lược đàm phán hòa giải hiệu quả', scene: 'Two porcelain coffee cups on either side of a walnut negotiation table, a partly-signed agreement and a fountain pen between them, two empty chairs implied, warm window light, reconciliatory mood.' },

  // danh-gia-chung-cu — evidence assessment
  5:  { name: 'Đánh giá chứng cứ trong tranh chấp đất đai', scene: 'A brass magnifying glass over the corner of an aged land deed and a stack of property survey photographs on a desk, forensic warm lighting.' },
  6:  { name: 'Vai trò của chứng cứ điện tử trong tố tụng', scene: 'A smartphone and an open laptop emitting a soft blue glow (screens abstract, no UI) beside printed digital-evidence exhibits and a USB drive on a dark desk, warm-cool mixed light, forensic mood.' },
  18: { name: 'Giám định tư pháp trong vụ án dân sự', scene: 'A forensic loupe and white cotton examination gloves over a contested document on a light-table, faint grid light from below, tweezers nearby, clinical-warm mood.' },
  19: { name: 'Thu thập và bảo quản chứng cứ điện tử', scene: 'A tamper-evident evidence bag containing a hard drive and a phone, a chain-of-custody label and pen on top, resting on a stainless surface under warm directional light, meticulous mood.' },
  20: { name: 'Đánh giá chứng cứ trong tranh chấp hợp đồng', scene: 'A magnifying glass hovering over two side-by-side contract pages, a red pen marking a discrepancy between them, on a walnut desk, analytical mood.' },

  // goc-nhin-nghe-luat — the profession
  9:  { name: 'Đạo đức nghề luật sư tại Việt Nam', scene: 'A brass scales-of-justice beside a closed leather code-of-ethics volume and a softly glowing brass lamp on a dark desk, reverent contemplative mood, deep shadows.' },
  10: { name: 'Thách thức và cơ hội cho luật sư trong thời đại AI', scene: 'A worn leather law book on a desk beside a softly glowing abstract circuit-board pattern reflected on the wood, warm tungsten meeting cool blue light, thoughtful future-facing mood.' },
  25: { name: 'Luật sư và trí tuệ nhân tạo: cơ hội hay thách thức', scene: 'A human hand resting on a wooden gavel while a faint abstract digital-light hand pattern overlaps from the opposite side, warm-cool mixed lighting, tradition-meets-technology mood.' },

  // ky-nang-tranh-tung — advocacy skills
  7:  { name: 'Kỹ năng tranh luận tại phiên tòa dân sự', scene: "A lawyer's hand gripping the edge of a dark-wood courtroom lectern with an open argument folder and a clip-on brass microphone, empty courtroom benches softly blurred behind, dramatic light." },
  8:  { name: 'Chiến thuật phản bác lập luận đối phương', scene: 'Two opposing stacks of legal briefs meeting across a table, a red pen drawing a line through a passage on one, tense dramatic side light, confrontational mood.' },
  21: { name: 'Kỹ năng xét hỏi nhân chứng tại tòa', scene: "An empty carved-wood witness stand in a warm-lit courtroom, a lawyer's hand entering frame mid-gesture toward it, a shaft of light with dust motes, anticipatory mood." },
  22: { name: 'Chiến thuật tranh luận tại phiên tòa phúc thẩm', scene: "A tall empty appellate judges' bench of dark carved wood with three high-back chairs, warm overhead light, a single open case file on the advocate's table in the foreground, solemn mood." },
  23: { name: 'Kỹ năng viết bản luận cứ bảo vệ', scene: 'A multi-page typed defence brief fanned on a walnut desk, a fountain pen adding a margin note, a structured outline page on top, warm desk-lamp light, focused mood.' },
  24: { name: 'Nghệ thuật thuyết phục hội đồng xét xử', scene: "An advocate's open upturned hand in the foreground gesturing toward a softly blurred judges' bench, warm directional courtroom light, dust motes, persuasive dignified mood." },

  // thuc-tien-xet-xu — court practice / trends
  1:  { name: 'Thực tiễn xét xử tranh chấp hợp đồng tại Việt Nam', scene: "A judge's wooden gavel resting on a thick stack of bound contract-dispute judgments on a courtroom bench, warm single-source light from the left, deep shadows, authoritative mood." },
  2:  { name: 'Xu hướng xét xử các vụ ly hôn có yếu tố tài sản lớn', scene: 'A small brass gavel beside a miniature model house, a luxury car key and a folded share certificate arranged on dark marble, dramatic light, high-stakes mood.' },
  11: { name: 'Thực tiễn xét xử tranh chấp đất đai tại TP.HCM', scene: 'A stack of land-dispute case files on a courthouse window sill, the Ho Chi Minh City skyline softly blurred through the glass at golden hour, place-specific mood.' },
  12: { name: 'Xu hướng xét xử tranh chấp lao động 2025-2026', scene: "A worker's safety helmet and gloves resting beside a labour-contract document and a small brass gavel on a desk, balanced labour-justice mood." },
  13: { name: 'Thực tiễn áp dụng án lệ tại Việt Nam', scene: 'A row of numbered precedent volumes with antique-gold embossed spines on a mahogany shelf, one volume pulled halfway out, dramatic library light from above-right, scholarly mood.' },
  14: { name: 'Phân tích bản án tranh chấp thừa kế điển hình', scene: 'An aged handwritten testament document with a broken red wax seal, a pair of reading glasses and a fountain pen resting on top, a faint hand-drawn family tree visible, solemn inheritance mood.' },
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const existing = new Set(manifest.images.map((i) => i.id))

let added = 0
for (const [id, { name, scene }] of Object.entries(POSTS)) {
  const entryId = `post-${id}`
  if (existing.has(entryId)) {
    console.log(`SKIP ${entryId} (already in manifest)`)
    continue
  }
  manifest.images.push({
    id: entryId,
    name,
    type: 'text-to-image',
    prompt: `${scene} ${GRADE}`,
    style: 'documentary editorial photograph',
    category: 'thumbnail',
    aspect: '4:3',
    width: 1024,
    priority: 'medium',
    status: 'pending',
  })
  added += 1
  console.log(`ADD  ${entryId} — ${name}`)
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`\n${added} entries added. Manifest now has ${manifest.images.length} images.`)
