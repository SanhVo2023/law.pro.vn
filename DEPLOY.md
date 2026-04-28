# Deployment & Handoff — law.pro.vn

Builder handoff: **2026-04-28**. Phase 1, site 4 of 4 on the Authority Supabase project (`vvzpvkjlkmjjnhapsrxq`).

## Pre-deploy checklist

- [ ] `.env.production` populated (do NOT commit) — see `.env.example` for required vars
- [ ] `NEXT_PUBLIC_SITE_URL=https://law.pro.vn`
- [ ] `DATABASE_URI` uses the Session Pooler URI (port 5432 on `*.pooler.supabase.com`) — same URI for runtime AND migrate
- [ ] `PAYLOAD_SECRET` is the production secret (rotate after handoff)
- [ ] `SEED_ADMIN_PASSWORD` rotated by Thach after first login
- [ ] `npm run build` succeeds locally
- [ ] `node scripts/import-articles.mjs` re-run after any new articles are generated in `tools/seo-content-writer/output/law.pro.vn/` — idempotent

## Netlify (production target)

Build config lives in `netlify.toml` — Netlify auto-detects it. The `@netlify/plugin-nextjs` plugin handles middleware, server actions, ISR, and the Payload admin server functions.

1. **Connect repo** in the Netlify UI. Base directory: `sites/phase-1/law.pro.vn`. Build command and publish dir are read from `netlify.toml` (do not override in the Netlify console).
2. **Install hook** runs `npm install` automatically — the `postinstall: patch-package` step applies `patches/payload+3.84.1.patch` (the `@next/env` loadEnv fix). Do not skip postinstall.
3. **Environment variables** (Site settings → Environment variables — mark all as "secrets" except the `NEXT_PUBLIC_*` ones):
   - `DATABASE_URI` (Session Pooler URI — port 5432 on `*.pooler.supabase.com`)
   - `PAYLOAD_SECRET` (32+ random chars; rotate after first deploy)
   - `NEXT_PUBLIC_SITE_URL=https://law.pro.vn`
   - `NEXT_PUBLIC_SUPABASE_URL=https://vvzpvkjlkmjjnhapsrxq.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT` — **REQUIRED for production**. Netlify is stateless; uploaded media must go to R2 not local disk. The `s3Storage` plugin in `payload.config.ts` activates only when all four are set; otherwise it falls back silently to local disk (the dev mode).
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (only used by local seed scripts, not by the Netlify runtime — leaving them out is fine)
4. **Custom domain**: `law.pro.vn` → SSL is automatic via Let's Encrypt. Add the `apex` and `www` records as Netlify directs; the proxy adapter auto-redirects `/` to `/vi`.
5. **Image domain** (R2 CDN): already declared in `next.config.ts` `images.remotePatterns` — Netlify's Next image runtime honours that.
6. **Function region**: choose `ap-northeast-2` (Seoul) to minimise latency to the Supabase project. Site → Functions → Deploy region.

Local Netlify check (optional): `npx netlify-cli build --offline` will simulate the Netlify build pipeline without deploying.

## Cloudflare R2 storage (one-time setup before first deploy)

Production media must be served from R2, not the Netlify ephemeral filesystem.

0. **Add the `prefix` column to `lpv.media` once** (the storage-s3 plugin tracks per-doc R2 path namespaces here; production runs with `push: false`, so the column must be created manually):
   ```bash
   node scripts/add-media-prefix-column.mjs
   ```
   Or in the Supabase SQL editor:
   ```sql
   ALTER TABLE lpv.media ADD COLUMN IF NOT EXISTS prefix VARCHAR;
   UPDATE lpv.media SET prefix = 'law.pro.vn' WHERE prefix IS NULL OR prefix = '';
   ```
1. Add the four `R2_*` env vars to your local `.env` (and to Netlify).
2. Wipe the local Media collection so files re-upload to R2 (existing rows still point at the dev-time `/api/media/file/...` paths):
   ```bash
   # via Payload admin → Media → select all → delete
   #   OR via psql:
   psql "$DATABASE_URI" -c 'DELETE FROM lpv.media; DELETE FROM lpv.media_sizes;'
   ```
3. Re-seed: `node scripts/seed-media.mjs` — files now upload to R2 via the `s3Storage` plugin.
4. Backfill: `node scripts/assign-featured-images.mjs && node scripts/backfill-author-photos.mjs`.
5. Verify: `curl -s "$SITE/api/media?limit=1" | head` — `url` should be the R2 CDN URL, not a `/api/media/file/...` path.

The `s3Storage` plugin is wired in `src/payload.config.ts` and activates only when all four `R2_*` env vars are present. Without them Payload falls back to local-disk storage (dev mode).

## Supabase

- Schema `lpv` on project `vvzpvkjlkmjjnhapsrxq` (Apolo lawyer's Project, ap-northeast-2/Seoul). Created automatically on first `npm run dev` via Payload's `push: true` (dev-only). In production, `push: false` — schema changes require explicit `npx payload migrate`.
- Table count: ~33 (matches sibling sites `lid`, `lov`).

## Patches

- `patches/payload+3.84.1.patch` — fixes `payload/dist/bin/loadEnv.js` `@next/env` default-import bug. Applied automatically via `postinstall: patch-package`. **Do not delete.** Re-test on Payload upgrade.

## Post-deploy smoke tests

```bash
curl -sI https://law.pro.vn/admin                                    # 200
curl -sI https://law.pro.vn/                                         # 307 → /vi
curl -sI https://law.pro.vn/vi                                       # 200
curl -sI https://law.pro.vn/vi/thuc-tien-xet-xu                       # 200
curl -sI https://law.pro.vn/en/court-practice-vietnam                 # 200
curl -sI "https://law.pro.vn/vi/thuc-tien-xet-xu/thuc-tien-xet-xu-tranh-chap-hop-dong"   # 200
curl -s   https://law.pro.vn/sitemap.xml | head -10                  # XML, hreflang vi/en pairs
curl -s   https://law.pro.vn/robots.txt | head                        # AI bots allowed
```

Then run a Lighthouse audit on `/vi/thuc-tien-xet-xu/{slug}` and verify:
- Performance ≥ 95
- Accessibility = 100
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

Submit `https://law.pro.vn/sitemap.xml` to Google Search Console and Bing Webmaster Tools after first deploy.

## Filling in the remaining ~75 articles

1. Run `tools/seo-content-writer` with the additional title list (especially the case-commentary section, which has 0 articles right now).
2. New article JSONs land in `tools/seo-content-writer/output/law.pro.vn/`.
3. From this site folder: `node scripts/import-articles.mjs` (idempotent — skips slugs that exist).
4. Verify count via `curl -s "$SITE/api/articles?limit=1" | grep -oE '"totalDocs":[0-9]+'`.

## Owner review (Mr Hien)

`HIEN_FEEDBACK.md` is the live log. Anything Hien comments on lands there as a numbered F-### item, builder fixes it, PM rolls generalizable lessons into shared-assets at sign-off.

## Files generated by this build (git status reference)

```
.env.example              # public template
.gitignore
package.json, package-lock.json, tsconfig.json
next.config.ts, postcss.config.mjs, eslint.config.mjs
patches/payload+3.84.1.patch
messages/{vi,en}.json
src/payload.config.ts
src/i18n/{routing,navigation,request}.ts
src/middleware.ts
src/lib/{fonts,payload,queries,sections}.ts
src/collections/*.ts (10 collections)
src/globals/*.ts (4 globals)
src/components/{seo,layout,article,hub}/*.tsx
src/app/(payload)/...
src/app/[locale]/...   (home + 6 hubs + 6 [slug] details + not-found)
src/app/{layout.tsx,globals.css,robots.ts,sitemap.ts}
scripts/{seed-media,seed-taxonomy,import-articles,backfill-reading-time,assign-featured-images,backfill-author-photos}.mjs
scripts/lib/markdown-to-lexical.mjs
netlify.toml
HIEN_FEEDBACK.md
DEPLOY.md (this file)
```
