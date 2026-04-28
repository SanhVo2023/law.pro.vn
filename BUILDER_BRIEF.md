# Builder Brief — law.pro.vn

**Site**: law.pro.vn — Professional Authority (Phase 1)
**Language**: VN + EN (bilingual; Vietnamese primary)
**Supabase project**: `vvzpvkjlkmjjnhapsrxq` (region ap-northeast-2)
**Table prefix**: `lpv_` — **MUST** appear in `postgresAdapter({ tablePrefix: 'lpv_' })`
**Audience**: practicing lawyers, in-house counsel, law firm associates, legal academics, sophisticated clients

## Role in ecosystem
Intellectual depth layer. Long-form analysis for legal professionals. Bridges knowledge (law.org.vn) to services (luatsutructuyen.vn, vothienhien.com).

## Reading order (do not skip)
1. `./PRD.md`
2. `./CLAUDE.md` (PM NOTICE at top)
3. `../../shared-assets/PAYLOAD_SETUP_SPEC.md`
4. `../../shared-assets/SUPABASE_CONFIG.md`
5. `../../shared-assets/SITE_BUILD_CHECKLIST.md`
6. `../../shared-assets/SITE_BUILD_FEEDBACK.md`
7. `../../shared-assets/LEXICAL_FORMAT_REFERENCE.md`
8. `../../shared-assets/CONTENT_GENERATION_GUIDE.md`
9. `../../shared-assets/IMAGE_MANIFEST_SCHEMA.md`
10. `../../shared-assets/HIEN_FEEDBACK_PROTOCOL.md` (at owner review)

## Design direction summary (full spec in PRD.md)
- **Feel**: Harvard Law Review meets Medium meets The Economist — premium legal journal, long-form reading.
- **Colors**: Burgundy `#6B1D2A` primary, charcoal `#2D2D2D` secondary, antique gold `#C9A84C` accent, parchment `#FAF8F5` bg.
- **Type**: Cormorant Garamond (headings, pull quotes italic), Lora / Merriweather (body), Inter (UI), IBM Plex Mono (citations).
- **Must-haves**: magazine-style article layouts, dropcaps, Tufte-style margin notes, reading progress bar, "Key Takeaways" summary box, article series nav, author credential badges.

## Pre-migrate safety check
1. `postgresAdapter({ tablePrefix: 'lpv_' })` set.
2. PM runs Supabase MCP `list_tables` on `vvzpvkjlkmjjnhapsrxq`; confirms no `lpv_*` tables.
3. Swap to direct URI (5432, no pgbouncer) for migrate; swap back to pooled after.
4. Verify: new tables all `lpv_*`; other site tables (vothienhien unprefixed, `lid_`, `lov_`) untouched.

## Image workflow
Same as law.org.vn — `./image-assets.json` is scaffolded (editorial photography + antique-gold icons on transparent PNG). User runs image-generator-ui `/batch`.

## Contact strategy
**MINIMAL** — optional contact form, footer block. No floating CTA.

## Internal linking
- **Link TO**: luatsutructuyen.vn, vothienhien.com (preferred over direct conversion sites)
- **Supported BY**: law.org.vn

## Exit criteria
1–8 same as law.org.vn brief, adjusted for magazine aesthetic.

## Status reporting
One-line updates to PM after each checklist item.
