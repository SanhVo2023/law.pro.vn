#!/usr/bin/env node
/**
 * Adds 13 documentary-style "realistic editorial photograph" prompts to
 * image-assets.json. Each new entry has status: 'pending' so the next
 * tools/image-generator-ui /batch run will generate them.
 *
 * Once they're uploaded to R2, src/lib/r2-media-map.ts will prefer the
 * `-realistic` variant for the matching v1 filename so the site swaps to
 * the new imagery without any code change.
 *
 * Idempotent — skips IDs that already exist.
 *
 * Usage: node scripts/append-realistic-image-prompts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const file = path.resolve(here, '..', 'image-assets.json')
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'))

const STYLE = 'documentary editorial photograph'
const NEW_ENTRIES = [
  {
    id: 'home-hero-feature-realistic',
    name: 'Home Cover — Documentary Photograph',
    aliasOf: 'home-hero-feature',
    aspect: '21:9',
    width: 2400,
    category: 'hero',
    prompt:
      "Cinematic documentary photograph in soft daylight: a Vietnamese woman lawyer in her thirties walking through the marble corridor of the Ho Chi Minh City People's Court, holding a brown leather case file and a folded suit jacket over one arm. Caught mid-stride, partial profile, eyes ahead. Dark wood panelling and tall arched windows behind her — a single shaft of late-afternoon light cuts diagonally across the floor. Background out of focus. Subject placed in the right third; left two thirds clean for an overlaid headline. Cormorant-warm parchment tones, burgundy accent on her tie. No readable text, no signage. Photojournalistic colour grade, mild grain.",
  },
  {
    id: 'hero-court-practice-realistic',
    name: 'Court Practice Hub — Documentary',
    aliasOf: 'hero-court-practice',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      'Editorial documentary photograph, wide angle: an empty Vietnamese courtroom in the moments before proceedings begin — three rows of wooden gallery benches, the elevated judge\'s bench at the far end, a single court staff member seen from behind adjusting a microphone. Warm overhead lighting on dark hardwood. A red Vietnamese national flag with a yellow star on the back wall. Mood is anticipatory, weighty. Soft shadows, eye-level perspective. No people facing the camera, no readable text. Natural cinematic colour, mild grain.',
  },
  {
    id: 'hero-litigation-strategy-realistic',
    name: 'Litigation Strategy Hub — Documentary',
    aliasOf: 'hero-litigation-strategy',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      'Documentary photograph from above: three Vietnamese lawyers in dark suits gathered around a polished walnut conference table, mid-discussion. Open folders, a laptop, hand-drawn timeline on a yellow legal pad with a fountain pen across it. Coffee cups slightly out of frame. Heads tilted in concentration; faces partially obscured by the high angle (no clear faces). Late-afternoon golden light through floor-to-ceiling windows of an HCMC high-rise office. Warm neutral palette, subtle burgundy and gold accents. Composition leaves clean upper third for an overlaid headline. Photojournalistic, no signage.',
  },
  {
    id: 'hero-evidence-assessment-realistic',
    name: 'Evidence Assessment Hub — Documentary',
    aliasOf: 'hero-evidence-assessment',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      "Editorial documentary close photograph: a senior Vietnamese lawyer's hands carefully laying out a numbered sequence of documentary evidence — printed photographs, an old contract, expert-witness reports — across a black drafting table. A brass desk lamp casts focused warm light. The hands are weathered and professional, holding a single document up to the light. Forensic, methodical mood. Out-of-focus law books behind. Subject only the hands and documents — no faces, no readable text, no signage. Cinematic warm tones with a single cool reflection on the brass.",
  },
  {
    id: 'hero-litigation-skills-realistic',
    name: 'Procedural Practice Hub — Documentary',
    aliasOf: 'hero-litigation-skills',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      "Documentary editorial photograph: a Vietnamese male lawyer in a dark suit, mid-speech at a polished wooden lectern in a Vietnamese courtroom, captured in a half-profile from the side at a gentle 3/4 angle. One hand resting on the lectern, the other gesturing forward. He is reading from a bound brief. The judge's bench out-of-focus in the background, warm overhead light. The image conveys persuasion without theatricality. Composition leaves clean negative space upper-right for an overlaid headline. No readable text on the brief. Photojournalistic colour, gentle grain.",
  },
  {
    id: 'hero-professional-perspective-realistic',
    name: 'Professional Perspective Hub — Documentary',
    aliasOf: 'hero-professional-perspective',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      'Editorial documentary photograph: a senior Vietnamese lawyer in his sixties seated at his private office desk in an HCMC high-rise, gazing thoughtfully out a floor-to-ceiling window at the city skyline at dusk. Behind him, a wall of leather-bound legal volumes; foreground includes an open notebook and a porcelain teacup on a saucer. Soft warm interior lighting; cool city lights outside. Reflective, contemplative mood. Side three-quarter view, his face partially silhouetted against the window (no clear face). Composition allows clean lower-right space for headline overlay. No signage, no readable text.',
  },
  {
    id: 'hero-case-commentary-realistic',
    name: 'Case Commentary Hub — Documentary',
    aliasOf: 'hero-case-commentary',
    aspect: '16:9',
    width: 1600,
    category: 'hero',
    prompt:
      "Editorial overhead documentary photograph: a Vietnamese law academic's hands annotating a printed published court judgment with a red felt-tip pen, crossing out and writing marginal notes. The judgment text is rendered as legible-looking blur (no readable words), highlighted passages glow yellow. A stack of related case files beside the central document. Warm desk-lamp lighting, walnut surface. No faces. Photojournalistic, intimate mood, mild grain.",
  },
  {
    id: 'thumb-template-thuc-tien-xet-xu-realistic',
    name: 'Court Practice — Thumb (Documentary)',
    aliasOf: 'thumb-template-thuc-tien-xet-xu',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      "Documentary close-up photograph: a judge's wooden gavel mid-strike, a touch of motion blur on the gavel head as it descends toward the sound block. Dark courtroom hardwood beneath. Dramatic single-source warm light from upper-left. Background out of focus. No readable text, photojournalistic colour grade.",
  },
  {
    id: 'thumb-template-chien-luoc-ho-so-realistic',
    name: 'Litigation Strategy — Thumb (Documentary)',
    aliasOf: 'thumb-template-chien-luoc-ho-so',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      'Documentary close-up: a pair of professional hands in a Vietnamese law office organising colour-tabbed manila case folders into stacks on a polished walnut desk. Three coloured tabs visible: burgundy, navy, gold. A fountain pen and a smartphone rest beside the stack. Warm afternoon light. No faces, no readable text on tabs.',
  },
  {
    id: 'thumb-template-danh-gia-chung-cu-realistic',
    name: 'Evidence Assessment — Thumb (Documentary)',
    aliasOf: 'thumb-template-danh-gia-chung-cu',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      "Documentary editorial close-up: a Vietnamese lawyer's gloved hand (white cotton evidence-handling glove) holding up a single piece of paper documentary evidence to a desk lamp's warm light, examining it. Other documents in soft focus on a black drafting surface beneath. Forensic, methodical mood. No readable text on documents.",
  },
  {
    id: 'thumb-template-ky-nang-tranh-tung-realistic',
    name: 'Procedural Practice — Thumb (Documentary)',
    aliasOf: 'thumb-template-ky-nang-tranh-tung',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      "Documentary close-up of a hand resting on a wooden courtroom lectern, the other hand gripping the rim of a clip-on microphone, mid-argument. The lectern and microphone are antique brass and dark wood. Warm courtroom lighting. Out-of-focus judge's bench in the deep background. No face visible, no readable text.",
  },
  {
    id: 'thumb-template-goc-nhin-nghe-luat-realistic',
    name: 'Professional Perspective — Thumb (Documentary)',
    aliasOf: 'thumb-template-goc-nhin-nghe-luat',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      'Documentary editorial photograph: silhouette of a Vietnamese lawyer standing at a floor-to-ceiling window of a high-rise HCMC office, looking out at the city at dusk. Reflective, contemplative mood. Warm interior backlight. The figure is small in the frame; most of the composition is the city beyond and the contemplative interior space. No readable text, no signage.',
  },
  {
    id: 'thumb-template-binh-luan-ban-an-realistic',
    name: 'Case Commentary — Thumb (Documentary)',
    aliasOf: 'thumb-template-binh-luan-ban-an',
    aspect: '4:3',
    width: 1024,
    category: 'thumbnail',
    prompt:
      'Documentary close-up: an open published Vietnamese court judgment lying flat on a walnut desk, with red pen annotations in the margins (legible as marks, not readable text), highlighted passages in yellow, and a hand mid-annotation just visible at frame edge. Warm desk-lamp lighting, dark wood. A subtle gold-edged bookmark beside it. No readable text in the annotations.',
  },
]

const existingIds = new Set(manifest.images.map((i) => i.id))
let added = 0
for (const e of NEW_ENTRIES) {
  if (existingIds.has(e.id)) {
    console.log(`SKIP ${e.id} (already in manifest)`)
    continue
  }
  manifest.images.push({
    id: e.id,
    name: e.name,
    type: 'text-to-image',
    prompt: e.prompt,
    style: STYLE,
    category: e.category,
    aspect: e.aspect,
    width: e.width,
    status: 'pending',
    aliasOf: e.aliasOf,
  })
  console.log(`ADDED ${e.id} (alias of ${e.aliasOf})`)
  added += 1
}

if (added > 0) {
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\nWrote ${added} new entries. Run tools/image-generator-ui /batch to generate.`)
} else {
  console.log('\nNothing to add.')
}
