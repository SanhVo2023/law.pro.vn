import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  HeadingFeature,
  BlockquoteFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  InlineCodeFeature,
  HorizontalRuleFeature,
  UploadFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { FeaturedContent } from './globals/FeaturedContent'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'
import { Series } from './collections/Series'
import { Articles } from './collections/Articles'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Comments } from './collections/Comments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET required')
if (!process.env.DATABASE_URI) throw new Error('DATABASE_URI required')

// Origins allowed to send authenticated (cookie) requests to the Payload API.
// Without the live domain(s) here, the admin loads and reads (GET) succeed but
// every Save (POST/PATCH/DELETE) returns 403 on the custom domain: a browser
// attaches an Origin header, and Payload rejects cookie-authed mutations whose
// origin is neither serverURL nor in this whitelist (CSRF protection). Node
// fetch sends no Origin, which is why server-side scripts never tripped it.
// Diagnose: GET /api/users/me returns the user (cookie valid) while a Save 403s
// => CSRF/origin mismatch. Includes apex + www, NEXT_PUBLIC_SITE_URL, localhost.
const allowedOrigins = Array.from(
  new Set(
    [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://law.pro.vn',
      'https://www.law.pro.vn',
      process.env.NEXT_PUBLIC_SITE_URL,
    ].filter((o): o is string => Boolean(o)),
  ),
)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — The Apolo Review',
    },
  },
  collections: [
    Users, Media, Pages, Categories, Tags, Authors, Series, Articles, NewsletterSubscribers, Comments,
  ],
  globals: [SiteSettings, Header, Footer, FeaturedContent],
  localization: {
    locales: [
      { label: 'Vietnamese', code: 'vi' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  editor: lexicalEditor({
    features: () => [
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      InlineCodeFeature(),
      BlockquoteFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      HorizontalRuleFeature(),
      LinkFeature({ enabledCollections: ['pages', 'articles'] }),
      UploadFeature({ collections: { media: { fields: [] } } }),
      FixedToolbarFeature(),
    ],
  }),
  db: postgresAdapter({
    push: process.env.NODE_ENV !== 'production',
    schemaName: 'lpv',
    // max:2 caps each Node process's pool to 2 sessions so that Netlify's
    // parallel build workers (one Payload init per worker) stay well under
    // the Supabase Session Pooler's 15-session cap. idleTimeoutMillis low
    // so unused connections release quickly between prerender steps.
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 2,
      idleTimeoutMillis: 10_000,
    },
  }),
  plugins: [
    seoPlugin({
      collections: ['articles', 'pages', 'categories', 'series', 'authors'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        `${typeof doc?.title === 'string' ? doc.title : 'The Apolo Review'} | Phân tích pháp lý chuyên sâu`,
      generateDescription: ({ doc }) =>
        typeof doc?.excerpt === 'string' ? doc.excerpt : '',
    }),
    // Cloudflare R2 (S3-compatible) cloud storage. Activates only when all five
    // R2_* env vars are present — otherwise falls back to local disk (dev).
    // REQUIRED on Vercel, whose serverless FS is read-only: without this, signing
    // in works but saving an article with a NEW image upload fails (Payload can't
    // write to disk). The 74 pre-baked images render regardless (their URLs are
    // baked into the build via the r2-media-map), so R2 only gates fresh uploads.
    //
    // Unlike the bucket-root sibling sites, law.pro.vn keeps `prefix: 'law.pro.vn'`
    // so new uploads land at `apolowebsite/law.pro.vn/<file>` and serve from
    // `${R2_PUBLIC_URL}/law.pro.vn/<file>` — matching the baked images, the
    // `lpv.media.prefix` column (already migrated), and the next.config
    // remotePattern `/law.pro.vn/**`. generateFileURL is therefore prefix-aware.
    ...(process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_PUBLIC_URL
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'law.pro.vn',
                disablePayloadAccessControl: true,
                generateFileURL: ({ prefix, filename }) =>
                  `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
              },
            },
            bucket: process.env.R2_BUCKET_NAME,
            config: {
              region: 'auto',
              endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
              },
            },
          }),
        ]
      : []),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
})
