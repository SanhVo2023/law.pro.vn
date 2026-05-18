# PRD: law.pro.vn -- Professional Legal Analysis Portal

**Document Version**: 1.0
**Created**: 2026-04-03
**Project Owner**: Apolo Lawyers (CONG TY LUAT APOLO LAWYERS)
**Managing Lawyer**: LS. Vo Thien Hien (Henry Vo)
**Status**: Phase 1

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Domain** | law.pro.vn |
| **Role in Ecosystem** | Professional Authority -- practitioner-level legal analysis and commentary |
| **Language** | Bilingual: Vietnamese (primary) + English |
| **Target Audience** | Practicing lawyers, in-house counsel, law firm associates, legal academics, sophisticated clients researching legal strategy |
| **Core Function** | Deep legal practice analysis: court practice insights, litigation strategy, evidence assessment, procedural analysis, case commentary, and professional legal perspectives |
| **CMS** | Independent PayloadCMS v3 instance |
| **Database** | Supabase PostgreSQL |
| **Tech Stack** | Next.js 15 (App Router) + PayloadCMS v3 + Supabase PostgreSQL + Tailwind CSS v4 + GSAP + Framer Motion |
| **Content Target** | 100 SEO-optimized content pages |

### Strategic Purpose

law.pro.vn is the intellectual depth layer of the Apolo ecosystem. While law.org.vn provides foundational knowledge, law.pro.vn delivers practitioner-grade analysis that:

1. Positions Apolo Lawyers as thought leaders among legal professionals
2. Captures mid-funnel traffic from lawyers and sophisticated clients researching strategy
3. Bridges the gap between legal knowledge (law.org.vn) and legal services (luatsutructuyen.vn)
4. Earns backlinks and citations from legal professionals, law reviews, and academic publications

---

## 2. Design Direction

### Visual Identity: "Modern Legal Review Publication"

The design evokes a premium legal journal -- the kind of publication a senior partner reads with their morning coffee. Think **Harvard Law Review meets Medium meets The Economist** -- intellectually rigorous, beautifully typeset, with a quiet confidence that says "this is where serious analysis lives."

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Deep Burgundy | #6B1D2A |
| Secondary | Charcoal | #2D2D2D |
| Accent | Antique Gold | #C9A84C |
| Background | Warm Parchment | #FAF8F5 |
| Surface | Crisp White | #FFFFFF |
| Text Primary | Rich Black | #1C1C1C |
| Text Secondary | Warm Gray | #6B6B6B |
| Border/Divider | Soft Rose | #E8DDD5 |
| Highlight | Light Burgundy (for callouts) | #F5EAEC |

### Typography

- **Headings**: Cormorant Garamond (serif) -- elegant, scholarly authority
- **Body**: Lora or Merriweather (serif) -- optimized for long-form reading, warm personality
- **UI elements / Navigation**: Inter (sans-serif) -- clean functional contrast
- **Legal citations / Code**: IBM Plex Mono -- professional monospace
- **Pull quotes**: Cormorant Garamond Italic -- distinguished emphasis

### Mood & Tone

- Intellectual and contemplative
- Sophisticated but not pretentious
- Long-form focused -- designed for 15-minute reading sessions
- Professional peer-to-peer voice (lawyer writing for lawyers)
- Depth over breadth -- fewer topics, richer analysis

### Key Design Elements

- **Magazine-style article layouts** with large featured images, author bylines, estimated reading time
- **Dropcap first letters** on article opening paragraphs
- **Margin notes / sidenotes** for legal citations and cross-references (Tufte-style)
- **Reading progress indicator** -- subtle top bar
- **"Key Takeaways" summary box** at top of each article for scanners
- **Article series navigation** -- "Part 1 of 3" with series links
- **Author credential badges** showing expertise indicators
- **Footnote/endnote system** with hover-to-preview
- **Bookmark/save functionality** for return readers
- **Dark mode** with warm undertones (not pure black)

### Animations

- GSAP: Parallax on article hero images, smooth reading progress bar, footnote hover reveals
- Framer Motion: Article card hover lifts, page transitions with subtle fade, sidebar slide-in on scroll
- Typography animations: Dropcap letter gentle scale-in on page load
- All animations respect `prefers-reduced-motion`

### Reference Sites

- lawreview.uchicago.edu -- legal review publication feel
- medium.com -- reading experience and typography
- aeon.co -- intellectual long-form layout
- stratechery.com -- premium analysis blog structure
- lrb.co.uk (London Review of Books) -- editorial design quality

---

## 3. Sitemap & Page Structure

### Vietnamese Routes (/vi/)

| URL | Page | Purpose |
|---|---|---|
| `/vi/` | Trang chu | Homepage: latest analysis, featured articles, section navigation |
| `/vi/thuc-tien-xet-xu` | Thuc tien xet xu | Court practice insights hub |
| `/vi/thuc-tien-xet-xu/[slug]` | Bai viet thuc tien xet xu | Individual court practice articles |
| `/vi/chien-luoc-ho-so` | Chien luoc ho so | Litigation strategy & case file preparation hub |
| `/vi/chien-luoc-ho-so/[slug]` | Bai viet chien luoc | Individual strategy articles |
| `/vi/danh-gia-chung-cu` | Danh gia chung cu | Evidence assessment hub |
| `/vi/danh-gia-chung-cu/[slug]` | Bai viet chung cu | Individual evidence articles |
| `/vi/ky-nang-tranh-tung` | Ky nang tranh tung | Litigation skills hub |
| `/vi/ky-nang-tranh-tung/[slug]` | Bai viet ky nang | Individual skills articles |
| `/vi/goc-nhin-nghe-luat` | Goc nhin nghe luat | Professional perspective hub |
| `/vi/goc-nhin-nghe-luat/[slug]` | Bai viet goc nhin | Individual perspective articles |
| `/vi/binh-luan-ban-an` | Binh luan ban an | Case commentary hub |
| `/vi/binh-luan-ban-an/[slug]` | Binh luan cu the | Individual case commentary |
| `/vi/tac-gia` | Danh sach tac gia | Author directory |
| `/vi/tac-gia/[slug]` | Trang tac gia | Individual author profile |

### English Routes (/en/)

| URL | Page | Purpose |
|---|---|---|
| `/en/` | Home | English homepage |
| `/en/court-practice-vietnam` | Court Practice | Court practice insights hub |
| `/en/court-practice-vietnam/[slug]` | Article | Individual court practice articles |
| `/en/litigation-strategy-vietnam` | Litigation Strategy | Strategy hub |
| `/en/litigation-strategy-vietnam/[slug]` | Article | Individual strategy articles |
| `/en/evidence-assessment-vietnam` | Evidence Assessment | Evidence analysis hub |
| `/en/evidence-assessment-vietnam/[slug]` | Article | Individual evidence articles |
| `/en/procedural-practice-vietnam` | Procedural Practice | Litigation skills hub |
| `/en/procedural-practice-vietnam/[slug]` | Article | Individual practice articles |
| `/en/professional-perspective` | Professional Perspective | Perspectives hub |
| `/en/professional-perspective/[slug]` | Article | Individual perspective articles |
| `/en/case-commentary-vietnam` | Case Commentary | Commentary hub |
| `/en/case-commentary-vietnam/[slug]` | Commentary | Individual case commentary |
| `/en/authors` | Authors | Author directory |
| `/en/authors/[slug]` | Author profile | Individual author |

### Utility Pages

| URL | Page | Purpose |
|---|---|---|
| `/vi/tim-kiem` / `/en/search` | Search | Full-text article search |
| `/vi/chu-de` / `/en/topics` | Topics/Tags | Topic tag index |
| `/sitemap.xml` | XML Sitemap | SEO |
| `/robots.txt` | Robots | Crawl rules |
| `/rss.xml` | RSS Feed | Article syndication |

---

## 4. SEO Strategy

### Primary Keywords

| Keyword | Language | Search Intent | Target Page |
|---|---|---|---|
| thuc tien xet xu Viet Nam | VI | Informational/Professional | /vi/thuc-tien-xet-xu |
| Vietnam law practice | EN | Informational | /en/ |
| chien luoc tranh tung | VI | Informational | /vi/chien-luoc-ho-so |
| litigation strategy Vietnam | EN | Informational | /en/litigation-strategy-vietnam |
| danh gia chung cu trong to tung | VI | Informational | /vi/danh-gia-chung-cu |
| civil procedure Vietnam analysis | EN | Informational | /en/procedural-practice-vietnam |
| binh luan ban an dan su | VI | Informational | /vi/binh-luan-ban-an |
| Vietnam case commentary | EN | Informational | /en/case-commentary-vietnam |

### Secondary Keywords

- xu huong xet xu dan su / civil court practice trends Vietnam
- chuan bi ho so kien / preparing litigation files Vietnam
- ky nang tranh tung tai toa / courtroom advocacy skills Vietnam
- danh gia chung cu dien tu / electronic evidence assessment Vietnam
- luat su tranh tung gioi / expert litigation lawyer Vietnam
- phan tich ban an / legal judgment analysis Vietnam
- chien luoc phuc tham / appellate strategy Vietnam
- legal compliance Vietnam / phap ly doanh nghiep

### Schema.org Markup

| Page Type | Schema Types |
|---|---|
| Homepage | WebSite, Organization, CollectionPage |
| Section hub pages | CollectionPage, BreadcrumbList |
| Articles | Article, ScholarlyArticle, author (Person), datePublished, dateModified |
| Case commentary | Article, LegalCase (custom), Review |
| Author profiles | Person, ProfilePage |
| All pages | BreadcrumbList |

### Technical SEO

- Hreflang tags for VI <-> EN pairs
- Canonical URLs per language
- Article structured data with author, date, word count
- Automatic internal linking suggestions in CMS
- RSS feed for article syndication
- Open Graph with article-specific images
- Reading time calculation in meta

---

## 5. Content Plan for 100 SEO Pages

### Content Distribution

| Category | Vietnamese | English | Total |
|---|---|---|---|
| Thuc tien xet xu / Court Practice | 10 | 8 | 18 |
| Chien luoc ho so / Litigation Strategy | 8 | 8 | 16 |
| Danh gia chung cu / Evidence Assessment | 8 | 7 | 15 |
| Ky nang tranh tung / Litigation Skills | 8 | 7 | 15 |
| Goc nhin nghe luat / Professional Perspective | 7 | 7 | 14 |
| Binh luan ban an / Case Commentary | 8 | 6 | 14 |
| Hub & Author pages | 4 | 4 | 8 |
| **Total** | **53** | **47** | **100** |

### Thuc tien xet xu / Court Practice (18 pages)

1. Xu huong xet xu tranh chap dan su 2025-2026 / Civil Dispute Court Practice Trends
2. Thuc tien ap dung Luat Dat dai moi tai toa / New Land Law Court Application in Practice
3. Toa an xu ly tranh chap hop dong nhu the nao / How Courts Handle Contract Disputes
4. Xu huong xet xu vu an lao dong / Labor Case Adjudication Trends
5. Thuc tien xet xu tranh chap hon nhan co yeu to nuoc ngoai / Foreign Element Marriage Dispute Practice
6. An le va vai tro cua an le tai Viet Nam / Precedent and Its Role in Vietnam
7. Xu huong boi thuong thiet hai ngoai hop dong / Non-Contractual Damages Trends
8. Thuc tien giai quyet tranh chap bat dong san / Real Estate Dispute Resolution Practice
9. So sanh xu ly tranh chap tai toa va trong tai / Court vs Arbitration: Practical Comparison
10. Court Practice in Foreign Investment Disputes

### Chien luoc ho so / Litigation Strategy (16 pages)

11. Xay dung chien luoc to tung hieu qua / Building Effective Litigation Strategy
12. Chien luoc khoi kien hay bi kien / Plaintiff vs Defendant Strategy
13. Chien luoc ho so trong vu an dat dai / Case Strategy in Land Disputes
14. Chuan bi ho so phuc tham / Preparing the Appellate Case File
15. Chien luoc giai quyet ngoai toa / Out-of-Court Settlement Strategy
16. Chien luoc trong vu an co nhieu ben / Multi-Party Litigation Strategy
17. Litigation Strategy for Foreign-Invested Enterprises in Vietnam
18. Strategic Use of Interim Measures in Vietnamese Courts

### Danh gia chung cu / Evidence Assessment (15 pages)

19. Nguyen tac danh gia chung cu trong to tung dan su / Evidence Assessment Principles in Civil Procedure
20. Chung cu dien tu: thu thap va su dung / Electronic Evidence: Collection and Use
21. Vai tro cua giam dinh trong to tung / Role of Expert Assessment in Litigation
22. Chung cu bang van ban: xac thuc va phan bac / Documentary Evidence: Authentication and Rebuttal
23. Ganh nang chung minh trong cac loai tranh chap / Burden of Proof Across Dispute Types
24. Thu thap chung cu hop phap / Legal Methods of Evidence Gathering
25. Chung cu loi khai nhan chung / Witness Testimony as Evidence
26. Digital Evidence in Vietnamese Courts: A Practical Guide

### Ky nang tranh tung / Litigation Skills (15 pages)

27. Ky nang trinh bay tai phien toa / Courtroom Presentation Skills
28. Ky nang hoi va doi chat / Examination and Cross-Examination Skills
29. Ky nang viet ban luan cu / Writing Effective Legal Arguments
30. Ky nang dam phan hoa giai / Negotiation and Mediation Skills
31. Ky nang phan tich van ban phap luat / Legal Text Analysis Skills
32. Quan ly thoi gian to tung / Managing Litigation Timelines
33. Ky nang giao tiep voi than chu / Client Communication Skills
34. Effective Advocacy in Vietnamese Courts

### Goc nhin nghe luat / Professional Perspective (14 pages)

35. Nghe luat su tai Viet Nam: thuc trang va tuong lai / The Legal Profession in Vietnam: Present and Future
36. Dao duc nghe nghiep luat su / Professional Ethics for Lawyers
37. Cong nghe va nghe luat / Technology and the Legal Profession
38. Xay dung thuong hieu ca nhan cho luat su / Personal Branding for Lawyers
39. Luat su tre: thach thuc va co hoi / Young Lawyers: Challenges and Opportunities
40. Quan he luat su - than chu / The Lawyer-Client Relationship
41. The Evolving Role of Lawyers in Vietnam's Legal System

### Binh luan ban an / Case Commentary (14 pages)

42. Binh luan an le ve tranh chap hop dong / Commentary on Contract Dispute Precedents
43. Phan tich ban an lao dong tieu bieu / Analysis of Notable Labor Judgments
44. Binh luan vu an hon nhan gia dinh phuc tap / Commentary on Complex Family Cases
45. Phan tich ban an dat dai gay tranh cai / Analysis of Controversial Land Decisions
46. Binh luan an le ve boi thuong thiet hai / Damages Award Commentary
47. Phan tich vu tranh chap doanh nghiep / Corporate Dispute Case Analysis
48. Commentary on Vietnam Supreme Court Decisions
49. Analysis of Cross-Border Dispute Judgments in Vietnam

(Remaining pages: Hub pages, author profiles, topic indexes, and additional articles in underrepresented categories to reach 100)

### Content Types

- **Deep Analysis Articles** (3,000-6,000 words): Flagship long-form analysis with footnotes and citations
- **Case Commentary** (2,000-4,000 words): Structured analysis of specific judgments
- **Practice Notes** (1,500-2,500 words): Practical guidance for practitioners
- **Professional Essays** (1,500-3,000 words): Opinion and perspective pieces
- **Article Series**: Multi-part deep dives (3-5 parts) on complex topics

---

## 6. Contact Strategy

### Approach: Minimal / Professional

law.pro.vn is a professional analysis site. Contact should feel like reaching out to a journal editor, not a sales team.

| Element | Included | Notes |
|---|---|---|
| Footer contact info | Yes | Office address, email, phone |
| Contact form | Yes (optional) | Simple "Contact the editorial team" form at bottom of author profiles |
| Floating CTA button | No | |
| Zalo widget | No | |
| WhatsApp | No | |
| Phone in header | No | |
| Newsletter signup | Yes | "Receive new analysis" -- email capture for article notifications |
| "By Apolo Lawyers" attribution | Yes | Footer attribution with link |

### Footer Contact Block

```
CONG TY LUAT APOLO LAWYERS
108 Tran Dinh Xu, Phuong Nguyen Cu Trinh, Quan 1, TP.HCM
Email: contact@apolo.com.vn
Dien thoai: 0903 419 479
```

---

## 7. CMS Collections (PayloadCMS v3)

### Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `articles` | All analysis articles | title, slug, language, category, content (rich text with footnotes), excerpt, author (relation), publishedDate, lastModified, readingTime (auto), seo, series (relation), relatedArticles, tags, featuredImage, keyTakeaways (array) |
| `authors` | Author profiles | name, slug, title_vi, title_en, bio_vi, bio_en, photo, credentials, expertise (array), linkedArticles |
| `categories` | Content sections | name_vi, name_en, slug, description_vi, description_en, featuredImage, order |
| `tags` | Topic tags | name_vi, name_en, slug |
| `series` | Article series | title_vi, title_en, slug, description, articles (ordered relation), status |
| `pages` | Static pages | title, slug, language, content, seo |
| `media` | Images and files | file, alt_text_vi, alt_text_en, caption, credit |
| `newsletter-subscribers` | Email captures | email, subscribedDate, preferences |
| `comments` | Article comments (moderated) | article (relation), author_name, content, approved, publishedDate |

### Globals

| Global | Purpose |
|---|---|
| `site-settings` | Site config, default SEO, analytics |
| `footer` | Footer content, ecosystem links |
| `header` | Navigation, language switcher |
| `featured-content` | Homepage featured article selections |

---

## 8. AI Image Asset List (Nano Banana 2)

### Hero & Featured Images

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-001 | "Dramatic close-up of lawyer's hands reviewing legal documents at dark mahogany desk, warm desk lamp lighting, burgundy and gold tones, shallow depth of field, intellectual atmosphere" | Homepage hero | 1920x1080 |
| IMG-002 | "Vietnamese courtroom interior during proceedings, view from the back of the room, judges bench elevated, formal atmosphere, warm natural light from high windows, no identifiable faces" | Court Practice section hero | 1600x900 |
| IMG-003 | "Overhead view of an organized legal case file on dark leather desk, tabbed sections, highlighted documents, sticky notes, meticulous arrangement, professional preparation" | Litigation Strategy section hero | 1600x900 |
| IMG-004 | "Magnifying glass over legal evidence documents, forensic analysis feel, dramatic side lighting, charcoal and burgundy tones, detailed and serious mood" | Evidence Assessment section hero | 1600x900 |
| IMG-005 | "Silhouette of a lawyer standing at a podium in a courtroom, backlit by tall windows, dramatic chiaroscuro lighting, powerful and authoritative stance" | Litigation Skills section hero | 1600x900 |
| IMG-006 | "Thoughtful legal professional looking out floor-to-ceiling office window at city skyline, twilight, reflective mood, back view, premium office interior" | Professional Perspective section hero | 1600x900 |
| IMG-007 | "Close-up of open legal judgment document with red stamp, fountain pen beside it, dark wood desk surface, scholarly attention to detail" | Case Commentary section hero | 1600x900 |

### Article Thumbnail Templates

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-008 | "Abstract burgundy and charcoal geometric composition suggesting legal scales, modern art style, rich textures, warm tones" | Article thumbnail - general | 800x600 |
| IMG-009 | "Stack of Vietnamese law books with gold embossed titles, dramatic library lighting, rich wood shelves background, classical scholarly feel" | Article thumbnail - legal analysis | 800x600 |
| IMG-010 | "Close-up of brass scales of justice on dark marble, perfectly balanced, warm golden light, bokeh background, luxurious professional feel" | Article thumbnail - court practice | 800x600 |
| IMG-011 | "Chessboard with pieces mid-game, dramatic lighting, strategic planning metaphor, burgundy and black color grading" | Article thumbnail - strategy | 800x600 |
| IMG-012 | "Hand writing with fountain pen on legal notepad, elegant penmanship visible, warm light, close-up with shallow depth of field" | Article thumbnail - professional skills | 800x600 |

### Decorative Elements

| ID | Prompt | Usage | Size |
|---|---|---|---|
| IMG-013 | "Subtle parchment texture with faint legal watermark pattern, warm cream tones, suitable as website background texture" | Background texture | 1920x1080 |
| IMG-014 | "Elegant line divider ornament, burgundy and gold, classical legal publication style, horizontal decorative rule" | Article section divider | 1200x100 |
| IMG-015 | "Abstract dark moody background with subtle burgundy gradient, leather texture undertones, premium feel" | Dark mode background | 1920x1080 |

---

## 9. Internal Linking Strategy

### Outbound Links (law.pro.vn links TO)

| Target Site | Link Context | Link Type |
|---|---|---|
| **luatsutructuyen.vn** | "Consult with a lawyer about this topic" -- at end of applicable articles | Contextual CTA (subtle) |
| **luatsutructuyen.vn** | "Schedule a consultation on litigation strategy" | Sidebar widget (select pages) |

### Inbound Links (sites linking TO law.pro.vn)

| Source Site | Link Context |
|---|---|
| **law.org.vn** | "For practitioner-level analysis..." contextual links |
| **law.org.vn** | Related articles sidebar |

### Internal Cross-Linking Rules

1. Every article links to its parent category hub
2. Every article links to 3-5 related articles within law.pro.vn
3. Articles in a series link to all other parts in the series
4. Case commentary articles link to relevant court practice and strategy articles
5. Author profiles link to all their published articles
6. Tag pages aggregate all content for a given topic
7. Vietnamese articles link to English equivalents via hreflang and visible toggle
8. Hub pages display articles sorted by recency with "Most Read" sidebar

---

## 10. Conversion Funnel

### Primary Conversion: Reader to Consultation Lead

law.pro.vn's conversion funnel is subtle and trust-based, appropriate for a professional audience.

```
Stage 1: Discovery
  Lawyer/client searches "chien luoc tranh tung dat dai"
  --> Lands on law.pro.vn deep analysis article

Stage 2: Engagement
  --> Reads 3,000+ word analysis (avg. 8-12 min)
  --> Impressed by depth and expertise
  --> Clicks to related articles (2-3 pages per session)

Stage 3: Trust Building
  --> Subscribes to newsletter for future analysis
  --> Returns for 2-3 more articles over weeks
  --> Recognizes Apolo Lawyers brand

Stage 4: Conversion
  --> When facing actual litigation need, clicks "Consult with a lawyer"
  --> Redirected to luatsutructuyen.vn for consultation booking
```

### Secondary Conversion: Newsletter Subscriber

- Newsletter signup form at bottom of each article
- "Nhan bai phan tich moi / Receive new analysis" -- simple email capture
- Monthly digest of new published analysis
- Builds remarketing audience for the ecosystem

### KPIs

| Metric | Target (12 months) |
|---|---|
| Monthly organic sessions | 5,000+ |
| Average time on page | 6+ minutes |
| Pages per session | 2.5+ |
| Newsletter subscribers | 500+ |
| Referral clicks to luatsutructuyen.vn | 200+ monthly |
| Backlinks from legal professionals | 30+ referring domains |
| Returning visitor rate | 25%+ |

### Content Quality Standards

- Every article must include minimum 5 legal citations
- Case commentary must reference specific judgment numbers
- All analysis must be reviewed by a practicing lawyer before publication
- Content calendar: 2 new articles per week minimum
- Article freshness: updated within 30 days of relevant legal changes

---

## Appendix: Technical Notes

### Article Rendering

- Rich text with footnote support (hover-to-preview, click-to-jump)
- Automatic table of contents generation from H2/H3 headings
- Reading time calculation (Vietnamese: 200 wpm, English: 250 wpm)
- Syntax highlighting for legal citations
- Print stylesheet for clean article printing

### Search Implementation

- Full-text search across all articles using Supabase full-text search
- Search suggestions with article titles and excerpts
- Filter by category, tag, author, language, date range
- Search analytics to inform content strategy

### RSS Feed

- Full article feed: `/rss.xml`
- Per-category feeds: `/vi/thuc-tien-xet-xu/rss.xml`, etc.
- Include full article content in feed for maximum syndication value

### Performance Targets

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Core Web Vitals: All green
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
