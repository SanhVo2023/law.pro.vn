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

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — law.pro.vn',
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
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  plugins: [
    seoPlugin({
      collections: ['articles', 'pages', 'categories', 'series', 'authors'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        `${typeof doc?.title === 'string' ? doc.title : 'law.pro.vn'} | Phân tích pháp lý chuyên sâu`,
      generateDescription: ({ doc }) =>
        typeof doc?.excerpt === 'string' ? doc.excerpt : '',
    }),
    // Cloudflare R2 (S3-compatible) cloud storage. Activates only when all
    // R2_* env vars are present — otherwise falls back to local disk (dev).
    // Required for Netlify production deploy: Netlify functions are stateless.
    ...(process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT
      ? [
          s3Storage({
            collections: { media: { prefix: 'law.pro.vn' } },
            bucket: process.env.R2_BUCKET,
            config: {
              endpoint: process.env.R2_ENDPOINT,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
              },
              region: process.env.R2_REGION || 'auto',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
})
