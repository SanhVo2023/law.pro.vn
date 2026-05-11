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
- **Status**: open — blocked on Thach's decision (editorial-team vs new named individual)
- **Generalizable?**: yes — see `SITE_BUILD_FEEDBACK.md` Issue 10.
- **PM action on sign-off**: _(PM fills)_

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
- **Status**: open — awaiting Thach approval of govt allowlist
- **Generalizable?**: yes — see `SITE_BUILD_FEEDBACK.md` Issue 9.
- **PM action on sign-off**: _(PM fills)_
