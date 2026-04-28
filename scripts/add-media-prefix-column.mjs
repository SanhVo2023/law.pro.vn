#!/usr/bin/env node
/**
 * One-shot migration: add the `prefix` column to lpv.media.
 *
 * The @payloadcms/storage-s3 plugin (configured with `collections.media.prefix`)
 * adds a `prefix` text field to the Media collection so it can store the
 * per-doc R2 path namespace. In dev (`push: true`) Payload auto-creates the
 * column; in production (`push: false` on Netlify) it does not — and the
 * SELECT during prerender fails with "column media.prefix does not exist".
 *
 * Run once before the next Netlify deploy:
 *   node scripts/add-media-prefix-column.mjs
 */
import 'dotenv/config'
import pg from 'pg'

const URI = process.env.DATABASE_URI
if (!URI) {
  console.error('DATABASE_URI required')
  process.exit(1)
}

const client = new pg.Client({ connectionString: URI })
try {
  await client.connect()
  const before = await client.query(
    `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'lpv' AND table_name = 'media' AND column_name = 'prefix'`,
  )
  if (before.rowCount > 0) {
    console.log('SKIP — lpv.media.prefix already exists')
  } else {
    await client.query(`ALTER TABLE lpv.media ADD COLUMN prefix VARCHAR`)
    console.log('CREATED — lpv.media.prefix VARCHAR')
  }

  // Backfill the prefix for existing rows so they line up with the new
  // s3Storage config (`collections: { media: { prefix: 'law.pro.vn' } }`).
  const upd = await client.query(
    `UPDATE lpv.media SET prefix = 'law.pro.vn' WHERE prefix IS NULL OR prefix = ''`,
  )
  console.log(`Backfilled prefix on ${upd.rowCount} existing rows`)
} catch (e) {
  console.error('FAIL:', e.message)
  process.exit(1)
} finally {
  await client.end()
}
