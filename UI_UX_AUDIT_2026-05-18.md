# UI/UX Designer Audit — law.pro.vn (The Apolo Review)

**Date**: 2026-05-18  
**HEAD**: `64ecd81` (intelligent header live; Phase 1 fix-pack v2 closed)  
**Auditor**: builder agent, picky-designer pass  
**Method**: headless Chromium (Playwright) against `next start` :3002, 14 routes × 3 viewports (mobile 390×844, tablet 768×1024, desktop 1440×900), plus per-route DOM checks (heading tree, alt-text, link names, forbidden phrases, sticky-bar visibility, console errors, response codes).  
**Screenshots**: `./audit-screenshots/` (42 files: 14 routes × 3 viewports + slim-bar transition shot).  
**Raw DOM data**: `./audit-screenshots/_dom-audit.json`.

---

## Executive summary

The structural and content fix-pack from the 17/5/2026 xlsx review landed cleanly: zero forbidden press-media phrases on any page, zero `TP.HCM` abbreviations, the `LS. Võ Thiện Hiển` rename with dấu nặng renders, the home + case-commentary disclaimers appear, the address is the full `Thành phố Hồ Chí Minh` form on both locales, and the intelligent header transitions correctly (slim bar hidden at scroll-top, present after scrolling past the masthead). Bilingual parity is intact. No console errors except for the missing `/favicon.ico`.

However a **picky designer's pass surfaces ~25 issues** the user would notice — split roughly into three buckets:

1. **HTML head hygiene** — every page ships a doubled title (`"X | The Apolo Review | The Apolo Review"`) because the root layout's title template appends the brand a second time. Every page has two `<h1>` elements (header masthead + page body); article-detail pages have **three** (a duplicate of the article title). One missing favicon shows in dev-tools on every page.

2. **Image accessibility** — the cover hero, hub thumbnails, and article-card thumbnails ship with empty `alt=""` because they were marked decorative when wired. With 24-of-25 imgs missing alt on the editorial-team author page (the heaviest article-list surface), the site is failing screen readers and losing image-search SEO.

3. **Design rhythm and editorial polish** — readable but not yet HLR-grade in several places: the slim sticky bar misses a visual link between the wordmark and the nav, the masthead gold rule is structurally tied to the wordmark not the section, the home cover hero "Vol. I" stamp competes with the headline at small viewports, the editorial-team author grid suffers from thumbnail-monotony (the same per-category thumb repeats 4-5 times in a row), and the empty state on Hien's author page (zero articles after F-002 reassignment) reads as broken rather than reserved.

Recommend treating P0 + P1 as ship-blockers for the next Netlify deploy; P2 + P3 are polish for a follow-up batch.

---

## Cross-cutting findings

### CX-1 [P0] Doubled brand in `<title>` on every page

Every route ships a `<title>` ending in two consecutive `| The Apolo Review`:

| Route | Current title |
|---|---|
| `/vi` | `The Apolo Review | Phân tích pháp lý chuyên sâu | The Apolo Review` |
| `/en` | `The Apolo Review | Vietnam Legal Analysis Review | The Apolo Review` |
| `/vi/thuc-tien-xet-xu` | `Thực tiễn xét xử | The Apolo Review | The Apolo Review` |
| `/vi/binh-luan-ban-an/...` | `Bình luận Án lệ số 09/2016/AL: ... | The Apolo Review | The Apolo Review` |
| `/vi/tac-gia/vo-thien-hien` | `LS. Võ Thiện Hiển | The Apolo Review` (single — uses per-page metadata override) |

Root cause: `src/app/layout.tsx` defines `title.template = '%s | The Apolo Review'`. The per-page `title` returned by `hubMetadata(...)` and `articleMetadata(...)` already includes ` | The Apolo Review` (because they read from `tSite('name')`). The template then appends a second one.

**Fix**: drop ` | ${tSite('name')}` from `hubMetadata` and `articleMetadata` in `src/lib/seo.ts` so per-page titles are bare (just `"Thực tiễn xét xử"`), and let the root template apply the brand once. Sanity-check the home page route which uses the locale layout's `generateMetadata` separately.

### CX-2 [P0] Two `<h1>` per page (three on article detail)

Every page has two `<h1>` elements:

- `H1: The Apolo Review` — the masthead wordmark in `SiteHeader.tsx` line ~50 (full magazine masthead).
- `H1: <page title>` — the hero headline.

Article-detail pages have a **third** `<h1>` that duplicates the article title (the ArticleHero component renders one, and somewhere else the title is repeating). Example: `/vi/binh-luan-ban-an/binh-luan-an-le-09-2016-...` has three H1s, two of which read `"Bình luận Án lệ số 09/2016/AL: Hợp đồng mua bán nhà ở chưa công chứng"`.

**Fix**:
- Demote the masthead wordmark `<h1>` in `SiteHeader.tsx` to `<p>` or `<span>` (it's a logo, not a heading). Keep visual styling.
- Find and remove the duplicate article-title `<h1>` (likely a leftover from when ArticleHero was refactored — search for the title rendered twice in `src/components/article/ArticleHero.tsx` or `ArticleDetail.tsx`).

### CX-3 [P1] Missing favicon

`/favicon.ico` → 404 on every page (only console error captured). The Media manifest has an `icon-favicon` asset already on R2; nothing maps it to `/favicon.ico`.

**Fix**: drop a `favicon.ico` (or `favicon.svg` + `icon.png` per Next 13+ conventions) into `src/app/` so Next handles `/favicon.ico` automatically. The `icon-favicon` R2 asset can be downloaded once and committed as `src/app/icon.png` (Next then auto-generates link tags).

### CX-4 [P1] Hero + thumbnail images ship with empty alt

| Route | Total imgs | Without alt |
|---|---|---|
| `/vi` | 2 | 2 |
| `/en` | 2 | 2 |
| `/vi/thuc-tien-xet-xu` (hub) | 7 | 6 |
| `/vi/chien-luoc-ho-so` (hub) | 6 | 5 |
| `/vi/binh-luan-ban-an` (hub) | 5 | 4 |
| `/vi/binh-luan-ban-an/...` (article) | 6 | 3 |
| `/vi/tac-gia/editorial-team` | 25 | 24 |

The pattern is clear: hero photo in `src/app/[locale]/page.tsx` line 117 uses `alt=""`, the hub-hero photo in `HubPage.tsx` does the same, and `ArticleCard.tsx` passes `alt=""` to its thumbnail. The author photo on `tac-gia/[slug]/page.tsx` correctly uses `alt={author.name}` — that's why `/vi/tac-gia/vo-thien-hien` shows 0/1.

**Fix**:
- Home hero `Image alt={t('heroEyebrow') + ': ' + t('heroTitle')}` (use the visible headline as alt — meaningful to a screen reader).
- HubPage hero `alt={section.description[locale]}` (or `${tNav(section.navKey)}: ${section.description.slice(0, 80)}`).
- `ArticleCard` thumbnail `alt={article.title}` — the visible card already shows the title, but a screen-reader walking image-only navigation gets nothing without this.
- Author photos already correct.

### CX-5 [P2] Thumbnail monotony on author-grid + hub pages

The editorial-team author page lists all 29 articles in a 3-column grid. Because every article in a category shares the same `thumb-template-{slug}` realistic photo, the grid shows:
- 6 identical "court practice / gavel" thumbnails in a row
- 5 identical "litigation strategy / file folders" thumbnails
- 4 identical "evidence" thumbnails
- … etc.

Visually monotonous; suggests there is only one image per section instead of a per-article hero. Same effect on hub pages, but bounded by ~5 per page.

**Fix path 1 (quick)** — randomize within a category. Add 2-3 alternate per-category R2 thumbnails to `image-assets.json` and rotate by article-slug hash so adjacent cards differ visually.

**Fix path 2 (right)** — per-article hero images (29 new R2 entries via image-generator-ui /batch). Bigger lift; defer to post-launch content investment.

### CX-6 [P2] Empty state on `/vi/tac-gia/vo-thien-hien` reads as broken

Post-F-002 reassignment, Hien personally authored 0 articles. The author detail page renders his bio block correctly but the "Bài viết đã đăng" section says only `"Chưa có bài viết."`. To a visitor, a Managing Lawyer's profile page that says "No articles yet" reads as a half-built site, not a deliberate editorial decision.

**Fix**: instead of an empty state, render a one-line clarifying caption:

> *"LS. Võ Thiện Hiển directs Apolo Lawyers' content desk. Bài phân tích trên chuyên trang được đăng dưới byline 'Apolo Editorial Team' và được rà soát biên tập trước khi đăng."* (or EN equivalent)

— and a `<Link>` to `/vi/tac-gia/editorial-team`. Turns an empty page into a path forward.

### CX-7 [P3] Vol. I issue stamp competes with hero headline at small viewports

On `/vi` mobile (390px), the gold `VOL. I · ISSUE 05 · MAY 2026` stamp sits inside the cover-hero photograph top-right, the same way the headline is bottom-left. The stamp's letter-spacing is tight (`tracking-[0.16em]`) but the photo behind it has a busy shaft of light — the stamp sometimes reads against light wood and sometimes against bookshelf. Not unreadable, but inconsistent.

**Fix**: add a subtle text-shadow (`drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]`) to the stamp, matching what's already on the headline.

---

## Per-route findings

### Route 1 — `/vi` (home, VN)

Screenshots: `01-home-vi-{mobile,tablet,desktop}.png` + `01-home-vi-desktop-slim-bar.png`

- **[P0]** CX-1 doubled title.
- **[P0]** CX-2 two `<h1>`.
- **[P1]** CX-3 favicon 404.
- **[P1]** CX-4 hero + featured thumb missing alt.
- **[P3]** CX-7 issue stamp legibility on mobile.
- **[P2]** Disclaimer block is present and well-positioned but the "LOẠI TRỪ TRÁCH NHIỆM" eyebrow runs against the body italic with no rule between them — would benefit from a thin gold hairline above the body para to echo the editorial rhythm seen elsewhere.

### Route 2 — `/en` (home, EN)

- Same as Route 1.
- **[P3]** "Where legal practice meets deep thinking." headline reads fine at desktop but on tablet (768px) the line breaks mid-phrase. Consider a `<br className="hidden md:inline"/>` to control the break.

### Routes 3–8 — `/vi/{6 hubs}` (VN)

- **[P0]** CX-1 doubled title.
- **[P0]** CX-2 two `<h1>`.
- **[P1]** CX-4 hub-hero alt + 4-6 article-card thumbnails missing alt.
- **[P2]** CX-5 thumbnail monotony.
- **[P3]** Hub-hero photograph height feels 5-10% too tall on desktop — pushes the lead-feature card below the fold on a 900px viewport. Consider `min-h-[44vh] max-h-[520px]` instead of the current `44vh`.

### Route 9 — `/en/case-commentary-vietnam`

- Same as VN hub bucket. EN parity intact.
- **[P3]** Body text "Commentary and analysis of notable Vietnamese judgments…" wraps to a single line at desktop and reads short / under-utilized. Consider a longer EN description in `sections.ts` to match the VN's visual weight.

### Route 10 — `/vi/binh-luan-ban-an/binh-luan-an-le-09-2016-hop-dong-mua-ban-nha`

- **[P0]** CX-1 doubled title.
- **[P0]** CX-2 **three** `<h1>` (article title duplicated).
- **[P1]** Article-hero photo + 2 related-rail thumbnails missing alt.
- **[P1]** The case-commentary disclaimer block (F-009) renders correctly with the gold-left-border treatment.
- **[P3]** The "BÌNH LUẬN BẢN ÁN" eyebrow above the title is the same exact style and color as the "LƯU Ý" eyebrow on the disclaimer block 600px below — they don't visually distinguish navigational from precautionary. Consider tinting the disclaimer eyebrow `gold-soft` instead of `burgundy`.

### Route 11 — `/en/case-commentary-vietnam/binh-luan-an-le-09-2016-hop-dong-mua-ban-nha`

- Same as Route 10.
- **[P2]** The EN article H1 has minor mismatch (a `No.` token in one of the dup'd h1s). After CX-2 is fixed and the duplicate goes away, double-check that the EN slug-vs-title-vs-meta agree.

### Route 12 — `/vi/tac-gia/vo-thien-hien`

- **[P0]** CX-2 two `<h1>` (header + author name).
- **[P2]** CX-6 empty-state phrasing reads as broken.
- **[P3]** Author photo is the symbolic stand-in (leather notebook + glasses) — fine. But it sits at ~140-180px wide next to a 720px bio column. Either go larger to give the photo equal weight, or move it inline-left at ~96px to feel like a byline portrait rather than a half-photo.

### Route 13 — `/vi/tac-gia/editorial-team`

- **[P0]** CX-2 two `<h1>`.
- **[P1]** CX-4 24 of 25 images missing alt (every article card).
- **[P2]** CX-5 thumbnail monotony at its worst on this page — 6 identical "gavel" thumbnails in court-practice block, 5 identical "files" in litigation-strategy block, etc.
- **[P3]** "PUBLISHED ANALYSIS / 29" counter is the right idea but renders very small (text-[11px]) and pale (`ink-muted`). Bump to `eyebrow text-[var(--color-burgundy)]` for parity with section eyebrows.

### Route 14 — `/vi/tac-gia` (authors index)

- **[P0]** CX-2 two `<h1>`.
- **[P3]** 2 author cards on a wide desktop look isolated — center the grid or constrain max-width on this page so the two cards feel like a designed page, not a sparse 2-column.

---

## Accessibility findings (DOM-derived)

- **A11y-1 [P0]**: 2 `<h1>` per page (3 on article details). Screen readers announce site structure incorrectly.
- **A11y-2 [P1]**: 90+ `<img>` across the site without `alt` text. The author detail (`vo-thien-hien`) and authors index are the only routes with full alt coverage.
- **A11y-3 [P2]**: no skip-link to bypass the header. With the new intelligent-header pattern this is more felt — a `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>` at the top of `[locale]/layout.tsx` is the standard fix.
- **A11y-4 [P3]**: focus rings — Tailwind's default ring is hidden on `editorial-link` (we override hover but not focus). Add `focus-visible:underline focus-visible:decoration-[var(--color-gold)]` to the `.editorial-link` rule in `globals.css` so keyboard navigation is visible.
- **A11y-5 [P3]**: the locale switcher (`LocaleSwitcher.tsx`) — check that the current locale is exposed with `aria-current="true"` and that the inactive locale link has a clearer accessible name than just `EN` / `VI` glyphs.

---

## Performance + technical hints

- **PERF-1 [P3]**: home hero `Image` uses `sizes="100vw"` but with `priority` — at 1440px the browser downloads a 3840w variant when 1920w would do. Add an explicit `sizes` ladder like `(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1920px`.
- **PERF-2 [P3]**: the slim sticky bar transition uses `translate-y` which is hardware-accelerated — good. The `transition-transform duration-300` is fine. Considering also adding `will-change: transform` to nudge the compositor; default is acceptable.
- **PERF-3 [P3]**: console.error spew on every page from the favicon 404 will count against CWV in some monitoring tools — fixing CX-3 cleans this up.

---

## Prioritized punch list

| Severity | ID | Area | Location | Suggested fix |
|---|---|---|---|---|
| **P0** | CX-1 | head hygiene | `src/app/layout.tsx`, `src/lib/seo.ts` | drop the trailing `\| ${tSite('name')}` from per-page titles in `hubMetadata` + `articleMetadata`; let the template add it once |
| **P0** | CX-2 | semantics | `src/components/layout/SiteHeader.tsx`, `src/components/article/ArticleHero.tsx`/`ArticleDetail.tsx` | demote masthead wordmark `<h1>` → `<p>` (logo, not heading); remove duplicate article-title h1 |
| **P0** | A11y-1 | a11y | same as CX-2 | resolved by CX-2 fix |
| **P1** | CX-3 | brand | `src/app/icon.png` (NEW) | download `icon-favicon` R2 asset → commit as `src/app/icon.png`; Next auto-emits link tags + serves `/favicon.ico` |
| **P1** | CX-4 | a11y + SEO | `src/app/[locale]/page.tsx`, `src/components/hub/HubPage.tsx`, `src/components/article/ArticleCard.tsx` | populate `alt` on hero + card thumbnails |
| **P1** | A11y-2 | a11y | as CX-4 | resolved by CX-4 fix |
| **P2** | CX-5 | imagery | `image-assets.json` + R2 batch | add 2-3 alt per-category thumbs, rotate by slug hash |
| **P2** | CX-6 | UX copy | `src/app/[locale]/tac-gia/[slug]/page.tsx` empty branch | replace `"Chưa có bài viết."` with a 2-sentence "byline-flows-through-editorial-team" note + link |
| **P2** | Route-11-h1 | semantics | `ArticleHero.tsx` | regression-check EN article h1 after CX-2 |
| **P2** | A11y-3 | a11y | `src/app/[locale]/layout.tsx` | add a skip-link to `#main` |
| **P3** | CX-7 | imagery | `src/app/[locale]/page.tsx` cover hero | drop-shadow on Vol. I stamp |
| **P3** | Route-1-disclaimer | rhythm | home disclaimer block | add a 1px gold hairline between eyebrow and body |
| **P3** | Route-2-EN-headline | typography | `messages/en.json` or page.tsx | controlled line break for the EN hero headline |
| **P3** | Hub-hero-height | rhythm | `HubPage.tsx` | `min-h-[44vh] max-h-[520px]` instead of fixed |
| **P3** | EN-case-hub-desc | copy | `src/lib/sections.ts` | longer EN description for case-commentary |
| **P3** | Article-disclaimer-eyebrow | color | `ArticleDetail.tsx` disclaimer block | tint to gold-soft so it distinguishes from navigational eyebrows |
| **P3** | Author-photo-size | imagery | `src/app/[locale]/tac-gia/[slug]/page.tsx` | bump photo to 240×240 OR move inline-left at 96px |
| **P3** | Editorial-count | typography | tac-gia/[slug]/page.tsx | restyle "PUBLISHED ANALYSIS / 29" as `eyebrow` |
| **P3** | Authors-index-sparsity | layout | `src/app/[locale]/tac-gia/page.tsx` | constrain grid max-width or center 2 cards |
| **P3** | A11y-4 | a11y | `globals.css` `.editorial-link` | `focus-visible:underline focus-visible:decoration-[var(--color-gold)]` |
| **P3** | A11y-5 | a11y | `LocaleSwitcher.tsx` | `aria-current` on active locale |
| **P3** | PERF-1 | perf | home page hero | explicit `sizes` ladder |
| **P3** | PERF-2 | perf | StickyNavBar.tsx | optional `will-change: transform` |

---

## Out of scope (PM-side / content-side)

- **Per-article hero photographs** — proper fix for CX-5 is generating 29 unique images via image-generator-ui /batch. ~$5 + ~30min generator time. Not a code task.
- **Real photographic portrait of LS. Võ Thiện Hiển** — symbolic stand-in is acceptable for now; replace when a vetted headshot is available.
- **Twitter Card / LinkedIn Post Inspector validation** — needs the live URL. Re-run after Netlify rebuilds with CX-1 + CX-3 fixes.
- **Color contrast audit** — currently sniff-tested. Full WCAG 2.2 AA pass needs a tool (axe-core, Lighthouse) and isn't part of this round.

---

## Verification after fix-pack

After the P0 + P1 items are fixed:

```bash
# 1. Build clean
npm run build

# 2. Re-run the DOM audit
node /tmp/lawprovn-screenshots/audit-dom.mjs

# 3. Check the new report
cat audit-screenshots/_dom-audit.json | grep -E "(h1Count|imgsNoAlt|title)"
# expect: every h1Count = 1; imgsNoAlt close to 0; titles single-branded
```

After all items land, re-screenshot the 14×3 matrix and diff against this baseline.
