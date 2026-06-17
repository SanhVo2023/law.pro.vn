# law.pro.vn — Picky-Owner Audit & Fixes (2026-06-17)

A page-by-page audit run as **Mr Võ Thiện Hiển** (the demanding owner), focused on
footer, text wrapping, wording, consistency, image style, UI, and the layout of
text + images. Findings were fixed in the same pass.

## Mr Hiển's criteria — what he wants to see

1. **Authority, not a magazine.** This is a *chuyên trang phân tích pháp lý* (a legal
   analysis page), NOT a periodical. Zero magazine/journal framing: no "Vol./Issue"
   stamps, no "monthly/weekly" cadence, no "tạp chí / journal / publication / xuất bản
   / ấn phẩm / peer review / subscribe-to-an-issue".
2. **His name, exactly.** "LS. Võ Thiện Hiển" with full diacritics (dấu nặng on
   Thiện/Hiển). Never "Vo Thien Hien". Non-personal pieces use "Apolo Editorial Team".
   No fictional individual authors, no fake credential chips.
3. **Canonical identity.** "Công ty Luật Apolo Lawyers" (VI) / "APOLO LAWYERS -
   Solicitors & Litigators" (EN). Address verbatim from `address.txt`; city always spelled
   "Thành phố Hồ Chí Minh" — never "TP.HCM".
4. **Ecosystem discipline (Issue 13).** VI → apolo.com.vn, EN → apololawyers.com; the two
   parent brands never co-appear. Shared email contact@apolo.com.vn is allowed on both.
5. **Editorial aesthetic.** Harvard-Law-Review / Economist restraint — burgundy #6B1D2A,
   antique gold #C9A84C, charcoal, parchment; Cormorant headings, Lora body, Inter
   eyebrows. Generous whitespace, confident hierarchy, gold hairline accents.
6. **Imagery = documentary editorial photography**, warm burgundy/gold/charcoal grade,
   no readable text/logos/faces; consistent style across the grid.
7. **No wrapping/overflow, clean rhythm.** Especially the footer and on mobile.
8. **Bilingual parity & correct VN diacritics** (hóa not hoá, tòa not toà…).

## Fixed this pass

| # | Area | Fix |
|---|---|---|
| 1 | **Magazine framing (P0)** | Removed the "Vol. I · Issue N · Month" stamp from the masthead utility bar and the homepage hero/aside; deleted the auto-month logic. Replaced the masthead kicker with a firm-attribution line ("Thuộc Công ty Luật Apolo Lawyers" / "By Apolo Lawyers"). |
| 2 | **Owner's name** | "Managing Partner Vo Thien Hien" → "Managing Lawyer Võ Thiện Hiển" in the consult CTA; fixed the EN author bio in the DB ("Vo Thien Hien" → "Võ Thiện Hiển"). |
| 3 | **Periodical cadence** | Removed "Cập nhật hàng tuần / Updated weekly" from hub pages; de-periodicalized the (hidden) newsletter copy ("monthly / hàng tháng / once a month" dropped). |
| 4 | **Banned vocabulary** | "…before publication" → "…before it is posted" on the author page. Scrubbed "magazine" from Media alt/captions in the DB (hero, divider, cover). |
| 5 | **City abbreviation** | "TP.HCM" → "Thành phố Hồ Chí Minh" in Media alt text. |
| 6 | **Consistency** | Standardized the EN footer copyright to "© 2026 APOLO LAWYERS - Solicitors & Litigators" (was "…LAW FIRM"); "Managing Partner" → "Managing Lawyer". |
| 7 | **Image a11y** | Symbolic author avatars (a still-life, not a portrait) made decorative (`alt=""`) where the name is already shown adjacent — screen readers no longer announce a notebook as a person. |
| 8 | **Social sharing** | Wired the default OG image + Twitter `summary_large_image` card on the homepage/author-index (was a blank social card). |
| 9 | **Footer (prior pass)** | Branch names shortened, gold contact icons, tightened hierarchy/gaps (commit ff65402). |

## Verified
- Build passes; `/vi` + `/en` render with the new masthead kicker, no Vol/Issue anywhere.
- Footer (desktop + mobile) clean; Issue-13 parent-brand split intact.
- DB: 0 remaining "magazine"/"TP.HCM" in Media, 0 remaining "Vo Thien Hien" in bios.

## Deferred (needs new assets / owner call — not done)
- **Article hero sharpness**: per-article images are 1024×768 (4:3); shown full-bleed they
  upscale slightly and crop to a wide band. A real fix needs wider hero renditions
  (~1600–2400px) generated via the headless image tool. Tracked, not done here.
- **"Luật Sư Trực Tuyến"** is left untranslated on EN (it's the proper brand of
  luatsutructuyen.vn) — flagged for owner sign-off.
- Per-article images cap at 29 (post-1..29); articles beyond #29 fall back to the
  typographic card/hero. Generate more as content grows.
