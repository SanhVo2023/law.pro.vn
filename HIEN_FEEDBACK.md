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
