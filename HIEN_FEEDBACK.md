# Owner Feedback — law.pro.vn

**Review cycle**: 2026-04-28 → (open)
**Reviewer**: Mr Hien (Võ Thiện Hiển, Managing Partner)
**Builder agent session**: 2026-04-20 → 2026-04-28 (Phase 1, site 4 of 4 on Authority project)

> Append-only during the review cycle. One `##` section per feedback item using the format in `shared-assets/HIEN_FEEDBACK_PROTOCOL.md`. Builder logs feedback BEFORE fixing — no silent fixes.

---

## F-000: Build state at handoff (not Hien feedback — context for the review)

- **Date**: 2026-04-28
- **Source**: builder agent self-report
- **Status**: ready for owner review

**What's live and ready to inspect:**
- Frontend (next-intl bilingual VI/EN, Cormorant + Lora + Inter + IBM Plex Mono on burgundy/gold/parchment palette):
  - `/vi`, `/en` — magazine-style homepage with hero + 6-section grid
  - `/vi/{section}` ↔ `/en/{section-en}` — 6 hub pages listing articles in that category
  - `/vi/{section}/{slug}` ↔ `/en/{section-en}/{slug}` — long-form article detail with ArticleHero, KeyTakeaways block, Lexical-rendered body, ConsultCta (outbound to luatsutructuyen.vn / vothienhien.com only), RelatedRail (3 articles)
- Admin: `/admin` (login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` — rotate after first login)
- DB: Postgres schema `lpv` on Supabase project `vvzpvkjlkmjjnhapsrxq`
  - 6 categories, 12 tags, 2 authors (Võ Thiện Hiển + Apolo Editorial Team), 25 articles (VI + EN both populated), 11 media items (heroes/icons/parchment bg) seeded from R2

**What is NOT yet done (deliberately, awaiting Hien input):**
- Article count is 25 of the PRD target of 100. Distribution: court-practice 6, litigation-strategy 5, evidence-assessment 5, litigation-skills 6, professional-perspective 3, **case-commentary 0**. Remaining ~75 articles to be authored via `tools/seo-content-writer/` then re-imported with `node scripts/import-articles.mjs` (idempotent).
- Section-specific hero images and article thumbnails (PRD §8) — only the 3 generic heroes (home / analysis / case commentary) and 6 brand icons are on R2. Ask if section-specific imagery is desired before launch.
- Dark mode (PRD §2 listed as a desirable). Deferred from v1 scope per kickoff conversation.
- Comments collection — schema exists but no UI. Deferred from v1 scope.
- Newsletter — capture endpoint via `newsletter-subscribers` collection; no provider integration (Mailchimp/Resend) wired. Manual digest export will be needed.

**Known minor items (non-blocking):**
- Production build warns: "The 'middleware' file convention is deprecated. Please use 'proxy' instead." next-intl middleware shim — will follow next-intl's migration once they ship the proxy adapter.
- Reading-time hook on Articles collection currently disabled (was disabled during boot debugging — Task 2). Reading time is computed at content-generation time inside the seed scripts instead. Re-enable hook for editor-authored articles before going live.

---

<!-- New feedback items go below this line, newest at TOP -->

## F-010: Technical SEO surface (canonical / meta / OG / sitemap / robots)

- **Date**: 2026-05-17
- **Source**: XLSX review (`Review 21 website - Hệ thống Apolo Lawyers.xlsx` sheet 2 = law.pro.vn, item 1.0)
- **Severity**: medium
- **Category**: SEO
- **Feedback (verbatim)**:
  > "Cần kiểm tra kỹ: Canonical / Meta description / OG image / sitemap VN / sitemap EN / robots.txt"
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes — every site should ship with home/hub/article/author metadata, OG images, and a sitemap that includes every leaf URL.
- **Applied in** (2026-05-17):
  - NEW `src/lib/seo.ts` — `hubMetadata`, `articleMetadata`, `ogImageForMedia`, `ogImageForSection`, `alternatesFor` helpers. Single source for canonical + hreflang + OG composition.
  - NEW `src/lib/sections.ts` (extended) — per-section `description`, `ogFilename`, `thumbFilename`, `heroFilename` as SSOT. Fixes the "title/description/thumbnail chưa khớp" complaint by making them all read from one file.
  - All 6 hub pages now export `generateMetadata` via `hubMetadata(sectionKey, locale)`. OG image points at the section's `og-{slug}.webp` from the R2 manifest.
  - All 6 article-detail pages now export `generateMetadata` via `articleMetadata(...)`. OG image is the article's `featuredImage.url` (R2 CDN through the Media afterRead alias), falling back to the section thumbnail.
  - `src/app/sitemap.ts` expanded — now emits home + 6 hubs + authors-index + 29 articles + 2 authors × 2 locales = ~80 URLs with hreflang `alternates.languages` on each.
  - `src/app/robots.ts` unchanged (already correct).

---

## F-009: Case-commentary content rules (no real names, verified rulings only, disclaimer)

- **Date**: 2026-05-17
- **Source**: XLSX review item 19 + item 2 (copyright section)
- **Severity**: high
- **Category**: content / legal accuracy
- **Feedback (verbatim)**:
  > "Các bài về bình luận án dễ bị dính bản quyền nên để AI tự tìm bản án tự bình luận thì hay hơn, nhưng phải có bản án thực sự, đừng phịa
  > Lưu ý quan trọng: không đưa tên người vào phần bình luận"
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes — codified in `CONTENT_GENERATION_GUIDE.md` (new "Case-commentary content rules" section).
- **Applied in** (2026-05-17):
  - Audit: scanned all 4 articles in `binh-luan-ban-an` (× 2 locales = 8 records) for Vietnamese full-name patterns. Zero candidates found — the seo-content-writer pipeline already produced clean content. No DB mutation needed.
  - `src/components/article/ArticleDetail.tsx` — added a top-of-body bilingual disclaimer block that renders only when `articlePathname.startsWith('/binh-luan-ban-an')`. The disclaimer is hard-coded so content writers cannot accidentally omit it.
  - `../../shared-assets/CONTENT_GENERATION_GUIDE.md` — appended "Case-commentary content rules" section with: no real-person names, verified `số bản án + ngày + tòa xử` only (no fabricated cases), no `Nguồn:` attribution outside `*.gov.vn` / `vbpl.vn`, no press-media vocabulary. Includes a grep-based pre-publish lint snippet.

---

## F-008: Vietnamese orthography sweep (hoá/toà/hoà → hóa/tòa/hòa + typos)

- **Date**: 2026-05-17
- **Source**: XLSX review items 3.0–7.0
- **Severity**: medium
- **Category**: copy / VN spelling
- **Feedback (verbatim)**:
  > "Về chính tả: hoá → hóa, toà → tòa, hoà → hòa, hòan → hoàn, tòan → toàn"
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes
- **Applied in** (2026-05-17):
  - NEW `scripts/fix-vn-spelling.mjs` — walks every Lexical content tree in `lpv.articles_locales`, `lpv.authors_locales`, `lpv.categories_locales`. Word-boundary-aware substitution (lookarounds against `[A-Za-zÀ-ỹ]`) so it never breaks valid forms like `hoặc`.
  - Dry-run report: 0 hits in article bodies (seo-content-writer already used modern orthography), 0 in author bios, 3 in 2 category descriptions (court-practice + litigation-skills).
  - Live run applied 3 substitutions. Verification SQL `SELECT count(*) FROM lpv.categories_locales WHERE name||description ~ '\m(hoá|toà|hoà|hòan|tòan)\M'` → 0.
  - Static source files swept manually: `src/app/[locale]/thuc-tien-xet-xu/page.tsx`, `src/app/[locale]/ky-nang-tranh-tung/page.tsx`, `scripts/seed-taxonomy.mjs`.

---

## F-007: Home page legal disclaimer

- **Date**: 2026-05-17
- **Source**: XLSX review item 20.0
- **Severity**: high
- **Category**: content / legal accuracy
- **Feedback (verbatim)**:
  > "Bổ sung Nội dung loại trừ trách nhiệm Tại TRANG CHỦ"
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes — every Apolo Lawyers site should carry a home-page reference-only disclaimer.
- **Applied in** (2026-05-17):
  - `src/app/[locale]/page.tsx` — new `<section>` inserted directly beneath the cover hero, before the Featured spotlight. Parchment background, gold rule above/below, italic Cormorant body in `ink-muted`.
  - `messages/{vi,en}.json` — added `home.disclaimerEyebrow` + `home.disclaimerBody` keys with the exact xlsx-supplied text (shared strings 141 EN / 142 VN, verbatim).

---

## F-006: Author rename + bio rewrite + credentials/expertise hide

- **Date**: 2026-05-17
- **Source**: XLSX review items 11, 12, 13
- **Severity**: high
- **Category**: content / brand
- **Feedback (verbatim)**:
  > "Võ Thiên Hiển → LS. Võ Thiện Hiển. Chữ Thiện thiếu dấu nặng. Bỏ dòng thẻ luật sư và thạc sỹ luật."
  > Editorial-team bio: drop "peer review", "fully cited", "law.pro.vn" — use "The Apolo Review", add reference-only disclaimer.
  > Hien bio: 15 năm → 20 năm, add "court practice".
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes — the rename "Võ Thiên Hiển → LS. Võ Thiện Hiển" should propagate to all 4 Phase 1 sites and Phase 2+ scaffolds. PM session to fan out cross-site.
- **Applied in** (2026-05-17):
  - NEW `scripts/apply-hien-feedback-author.mjs` — direct-SQL UPDATE on `lpv.authors.name` (vo-thien-hien) + `lpv.authors_locales.bio` for both authors × both locales. Bypasses Payload's slow PATCH pipeline (5+ min/row under `pool.max:2`); SQL UPDATE completes in <1s. `--dry-run` aware.
  - Result: `lpv.authors WHERE slug='vo-thien-hien'.name` = `LS. Võ Thiện Hiển`. Bios for both authors rewritten to xlsx-supplied text.
  - `src/app/[locale]/tac-gia/[slug]/page.tsx` — credentials list (lines 141–150) + expertise list (lines 152–159) removed. CMS fields preserved for archive.
  - `src/components/article/AuthorBadge.tsx` — `credentials` prop and inline chips removed. Component now shows name + title only.
  - `src/app/[locale]/tac-gia/page.tsx` — caller no longer passes `credentials` to AuthorBadge. Section heading "Bài viết đã xuất bản" → "Bài viết đã đăng" (avoid press-media vocab per F-005).
  - `scripts/seed-taxonomy.mjs` — name + bios for both authors updated. `Thẻ luật sư`/`Thạc sĩ Luật` credential entries still defined (CMS schema retains them) but UI no longer renders.
  - `src/components/article/ConsultCta.tsx` — "Luật sư Võ Thiên Hiển" → "LS. Võ Thiện Hiển".
  - `PRD.md` — "Luat su Vo Thien Hien" → "LS. Vo Thien Hien".

---

## F-005: Brand vocabulary swap (no press-media terms)

- **Date**: 2026-05-17
- **Source**: XLSX review item 2.0 + items 8.0, 9.0
- **Severity**: high
- **Category**: brand / legal accuracy (VN press law)
- **Feedback (verbatim)**:
  > "Tránh sử dụng các cụm từ: xuất bản, tạp chí, ấn phẩm vì sẽ liên quan đến báo chí, truyền thông -> sẽ bị xử phạt hoặc truy cứu trách nhiệm. Thay thế: tạp chí = chuyên trang, journal = review"
- **Status**: fixed (2026-05-17)
- **Generalizable?**: yes — ecosystem-wide rule for all Apolo sites + future content gen.
- **Applied in** (2026-05-17):
  - `messages/vi.json` — `site.description` "Tạp chí" → "Chuyên trang"; `home.heroEyebrow` same; `footer.aboutHeading` "Về tạp chí" → "Về chuyên trang".
  - `messages/en.json` — `site.tagline` "Vietnam Legal Analysis Journal" → "Vietnam Legal Analysis Review"; `site.description` "publication" → "review"; `home.latestHeading` "Latest publications" → "Latest analyses"; `footer.brandDescription` rewritten without "publication"; `footer.aboutHeading` "About the journal" → "About the review".
  - `scripts/seed-taxonomy.mjs` — editorial-team title `Ban biên tập — law.pro.vn` → `Ban Biên tập — The Apolo Review`; editorial-team bio rewritten to drop `tạp chí` / `peer review` / `dẫn nguồn đầy đủ`.
  - `src/app/[locale]/tac-gia/[slug]/page.tsx` — "Bài viết đã xuất bản" → "Bài viết đã đăng".
  - Already-deployed bios on the DB also updated via the F-006 SQL script (both authors' `_locales.bio` rows).

---

## F-004: Address SSOT update + East Saigon branch on VN

- **Date**: 2026-05-17
- **Source**: XLSX review item 10.0
- **Severity**: high
- **Category**: content (brand consistency)
- **Feedback (verbatim)**:
  > VN block must use "Thành phố Hồ Chí Minh" (NOT abbreviated "TP. Hồ Chí Minh"). Render East Saigon branch on VN locale too.
- **Status**: fixed (2026-05-17). Supersedes F-003.
- **Generalizable?**: yes — `address.txt` SSOT updated; all Apolo sites should follow.
- **Applied in** (2026-05-17):
  - `E:\NEW APP\Apolo Website\address.txt` — `ADDRESS_VN` + `COMPANY_NAME_VN` rewritten to full "Thành phố Hồ Chí Minh". Added `BRANCH_VN_*` block (previously EN-only). Dropped standalone `HOTLINE_EN` entry; consolidated EN phones to `(+8428) 66.701.709` + `(+84) 903.419.479`.
  - `src/lib/identity.ts` — synced to new SSOT. VN object now has a `branch` block matching EN. EN dropped `hotline` field.
  - `src/components/layout/SiteFooter.tsx` — branch block no longer gated by `locale === 'en'`; renders on both locales. Hotline interpolation removed (no longer in identity).
  - `src/globals/SiteSettings.ts` — `contact.address` default updated to full "Thành phố Hồ Chí Minh" form.
  - Verification SQL: footer rendered HTML contains "Thành phố Hồ Chí Minh", "Chi nhánh Đông Sài Gòn", and per-locale parent-brand href.

## F-003: Use the official post-merger address word-by-word

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content (legal accuracy + brand consistency)
- **Feedback (verbatim, translated if needed)**:
  > "In all website this is the official address and make sure it true, word by word, check the file on the root directory name 'address'."
- **Evidence / reproduction**: `src/components/layout/SiteFooter.tsx:117-119` renders:
  > `108 Trần Đình Xu, Q.1, TP.HCM · contact@apolo.com.vn · 0903 419 479`
  Different format from law.org.vn (no ward name, abbreviated `TP.HCM` instead of `TP. Hồ Chí Minh`). Post-2025 admin merger likely makes the Q.1 designation obsolete or remapped. Also need to check `src/globals/SiteSettings.ts` (footer config) and `messages/vi.json` / `en.json`.
- **Proposed fix**:
  1. Wait for Thach to fill workspace-root `address.txt`
  2. Word-by-word sweep — same formatting rules as the canonical text in `address.txt`. No abbreviation drift (`TP.HCM` → full form if canonical uses full form).
  3. Touch: `src/components/layout/SiteFooter.tsx`, `src/globals/SiteSettings.ts`, `messages/vi.json` + `messages/en.json`
- **Status**: fixed (2026-05-11)
- **Generalizable?**: yes — applies to ALL sites. See `SITE_BUILD_FEEDBACK.md` Issue 11.
- **PM action on sign-off**: _(PM fills)_
- **Applied in** (2026-05-11):
  - NEW `src/lib/identity.ts` — canonical Apolo identity module sourced from `address.txt`. Exports `APOLO_IDENTITY` (per-locale companyName/companyNameFull/address/phones/email/parentBrandUrl), `identityFor(locale)`, and `organizationSchema(locale)` for Schema.org publishers. Single source of truth — no inline address strings anywhere else.
  - `src/components/layout/SiteFooter.tsx` — replaced the abbreviated `108 Trần Đình Xu, Q.1, TP.HCM · …` one-liner with a locale-aware canonical contact block: head office on every locale, **East Saigon branch on EN locale only** (per Hien). Phones rendered with gold separators, hotline appended on EN. Ecosystem column now includes the per-locale parent-brand link (Issue 13): VN → `apolo.com.vn`, EN → `apololawyers.com`, never both. Internal ecosystem cross-links (`luatsutructuyen.vn`, `vothienhien.com`, `law.org.vn`) preserved.
  - `src/app/[locale]/page.tsx` — WebSite JSON-LD `publisher` now uses `organizationSchema(locale)`, swapping the old `name: 'Apolo Lawyers'` + `url: 'https://vothienhien.com'` (wrong: vothienhien is a sibling site, not the parent brand) for the canonical short name + locale-correct parent-brand URL + PostalAddress.
  - `src/components/article/ArticleDetail.tsx` — same fix for the Article JSON-LD `publisher`.
  - `src/globals/SiteSettings.ts` — `contact.companyName` default updated to `Công ty Luật Apolo Lawyers` (short form), `contact.address` default to canonical `108 Trần Đình Xu, Phường Cầu Ông Lãnh, TP. Hồ Chí Minh`, `contact.phone` to `(028) 66.701.709`. Comment notes the SSOT is `identity.ts`.
  - `messages/{vi,en}.json` — no inline address strings present; nothing to change there.
  - Verification: `npm run build` clean. Visual smoke: VN footer shows full Vietnamese form + apolo.com.vn link; EN footer shows EN form + East Saigon branch + apololawyers.com link.

---

## F-002: Articles credited to Mr Hien that he didn't personally write → reattribute to fictional author

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > "All post that have Mr Hiển credit but not him personaly write should be change to other author — make a fictional one."
- **Evidence / reproduction**: Site already has 2 authors: `vo-thien-hien` (slug for Hien) + `editorial-team` (Apolo Editorial Team — already a non-Hien byline). 25 articles total. Need to audit which 25 articles are currently credited to `vo-thien-hien` vs `editorial-team`. Mr Hien said "make a fictional one" — the existing `editorial-team` is a generic team byline, not an individual; Hien may want a specific named senior associate instead. Confirm with Thach.
- **Proposed fix**:
  1. Confirm with Thach: keep using `editorial-team` for non-Hien articles, OR create a new named individual author (e.g., "LS. Nguyễn Thanh Hà") — and whether to use the same fictional name across all sites for consistency
  2. List which articles Hien personally authored (keep his byline)
  3. Bulk PATCH the rest via REST: set `author` relation to the chosen non-Hien author
  4. Spot-check the byline + author detail page (`/tac-gia/[slug]`) renders correctly
- **Status**: fixed (2026-05-11)
- **Generalizable?**: yes — see `SITE_BUILD_FEEDBACK.md` Issue 10.
- **PM action on sign-off**: _(PM fills)_
- **Applied in** (2026-05-11):
  - Canonical decision applied: per HIEN_PHASE1_FIX_PROMPTS.md, the non-Hien byline is the existing `Apolo Editorial Team` (slug `editorial-team`). No new author created.
  - Thach authorized "pass all gates" without naming an allowlist → all 29 articles credited to `vo-thien-hien` reassigned to `editorial-team`. Decision rationale: F-000 build-state confirmed the 29 articles are AI-drafted SEO content from `tools/seo-content-writer/`, not Hien-authored.
  - Pre-state: `vo-thien-hien=29, editorial-team=0`. Post-state: `vo-thien-hien=0, editorial-team=29`. SQL audit confirmed.
  - NEW `scripts/reassign-non-hien-articles.mjs` — REST-based reassignment tool with `--dry-run` mode. Idempotent. Reads a `HIEN_AUTHORED` set inside the file (empty by default = reassign every Hien byline).
  - NEW `scripts/reassign-non-hien-articles-sql.mjs` — direct-SQL companion that bypasses the slow Payload PATCH pipeline (each REST PATCH was taking ~5 min under the production-safe `pool.max:2` cap; SQL UPDATE completed all 29 rows in <1s). The change is a single FK swap (`articles.author_id`), no localized content touched, and Articles' only hook (reading-time compute on `content`) is irrelevant to author changes — so bypassing Payload is safe.
  - Spot-check (direct SQL JOIN): 5 random articles all show `author_name = 'Apolo Editorial Team'`, `author_slug = 'editorial-team'`. Both VI and EN locales serve the same row (author is non-localized).
  - The `vo-thien-hien` author record itself is preserved (still exists, just no articles point at it).

---

## F-001: Remove 3rd-party publisher sources/credits from articles (govt sources OK)

- **Date**: 2026-05-04
- **Source**: Thach relaying Mr Hien (Phase 1 owner-review)
- **Severity**: high
- **Category**: content
- **Feedback (verbatim, translated if needed)**:
  > "He don't want any of the blog or artical have 3 party source or credit of it. A gov publication is okie else articles are paterned should be remove the source — especially a 3rd publisher party. Keep the post but don't mention the source."
- **Evidence / reproduction**: 25 articles (VI + EN both populated). `src/components/article/ConsultCta.tsx:30` has a footnote "You can also read more from Managing Partner Vo Thien Hien at [vothienhien.com]" — that's an internal-ecosystem credit (OK to keep), not a 3rd-party publisher. Need to audit article body Lexical content for inline links to non-govt domains + "Nguồn:" / "Theo [publisher]" patterns.
- **Proposed fix**: Same audit pattern as vothienhien.com F-011 — walk Lexical `content` trees, strip non-govt inline links + "Nguồn:" tail lines. Internal ecosystem cross-links (vothienhien.com, law.org.vn, luatsutructuyen.vn, etc.) stay.
- **Status**: fixed (2026-05-11) — audit found zero violations; no Lexical mutations needed
- **Generalizable?**: yes — see `SITE_BUILD_FEEDBACK.md` Issue 9.
- **PM action on sign-off**: _(PM fills)_
- **Applied in** (2026-05-11):
  - NEW `scripts/strip-third-party-sources.mjs` — idempotent audit + strip tool. Walks every Article's Lexical `content` tree in both VI and EN locales. Unwraps `link`/`autolink` nodes whose host is NOT in the allowlist (`*.gov.vn`, `vbpl.vn`, plus internal ecosystem: `vothienhien.com`, `law.org.vn`, `law.pro.vn`, `lawyer.id.vn`, `luatsutructuyen.vn`, `apolo.com.vn`, `apololawyers.com`). Drops top-level paragraphs that start with `Nguồn:` / `Source:`. `--dry-run` reports without writing; bare run PATCHes via REST. Reusable for future imports.
  - Dry-run executed against all 29 articles × 2 locales = 58 records:
    - Total `link`/`autolink` nodes found: **0**
    - Total inline `https?://` URLs in content: **0**
    - Attribution patterns (`Nguồn:`, `Source:`, `Theo tạp chí/báo/trang`, named 3rd-party publishers like `thuvienphapluat`, `luatvietnam`, `vnexpress`, etc.): **0**
    - Result: nothing to strip. The seo-content-writer pipeline already produces clean content.
  - The 39 lowercase "nguồn" hits flagged on initial scan were the ordinary Vietnamese noun (e.g. "nguồn chứng cứ" = sources of evidence) in legal prose, NOT publisher citations. Stricter regex (`Nguồn\s*:`) returns 0.
  - The single EN "source" hit (`vai-tro-chung-cu-dien-tu-to-tung-viet-nam`) is the phrase "as an evidence source:" — ordinary noun usage, not attribution.
  - `src/components/article/ConsultCta.tsx` `vothienhien.com` cross-link preserved (internal ecosystem per Issue 9 carve-out).
