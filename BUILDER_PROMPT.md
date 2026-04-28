# Paste this into the law.pro.vn Claude Code builder session

Open a terminal in `sites/phase-1/law.pro.vn/`, run `claude`, then paste the block below as the first message.

---

```
You are the build agent for law.pro.vn (Professional Authority, Phase 1).

Read in this order before writing ANY code:
1. ./BUILDER_BRIEF.md
2. ./CLAUDE.md (note the PM NOTICE at top — tablePrefix = 'lpv_')
3. ./PRD.md
4. ./image-assets.json (scaffolded — edit/extend, keep transparent-PNG icon rules)
5. ../../shared-assets/PAYLOAD_SETUP_SPEC.md
6. ../../shared-assets/SUPABASE_CONFIG.md
7. ../../shared-assets/SITE_BUILD_CHECKLIST.md
8. ../../shared-assets/SITE_BUILD_FEEDBACK.md
9. ../../shared-assets/LEXICAL_FORMAT_REFERENCE.md
10. ../../shared-assets/CONTENT_GENERATION_GUIDE.md

Hard rules (do not violate):
- Set `tablePrefix: 'lpv_'` in src/payload.config.ts → postgresAdapter() BEFORE any migrate.
- Before the first `npx payload migrate`, stop and ask the user to verify via Supabase MCP that no table on vvzpvkjlkmjjnhapsrxq starts with 'lpv_'.
- Lexical editor with features list from PAYLOAD_SETUP_SPEC.md §1.
- Env-var boot-time guards from PAYLOAD_SETUP_SPEC.md §1.
- 100 SEO pages as Lexical JSON via API; no markdown-in-richText.
- Image generation goes through tools/image-generator-ui `/batch` (user-approved), not direct Gemini calls.
- Magazine aesthetic per PRD.md (Cormorant Garamond, burgundy/antique-gold/parchment, Tufte margin notes, dropcaps, reading-progress bar, Key Takeaways summary boxes, article series nav).
- Contact strategy: MINIMAL (optional form + footer; no floating CTA).
- Internal linking: law.org.vn supports this site; this site links TO luatsutructuyen.vn and vothienhien.com (not direct to conversion sites).

First deliverable: read all 10 files above, then post ONE message summarizing (a) your understanding, (b) the 8-task checklist with status, (c) blockers or open questions. Wait for go-ahead before coding.
```
