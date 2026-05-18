#!/usr/bin/env node
/**
 * Apply Mr Hien's 17/5/2026 author feedback (xlsx items 11, 12, 13):
 *   - vo-thien-hien: name → "LS. Võ Thiện Hiển" (note dấu nặng on Thiện);
 *     bio rewritten ("hơn 20 năm" vs old "hơn 15 năm"; adds court practice).
 *   - editorial-team: bio rewritten — replaces "law.pro.vn" with
 *     "The Apolo Review", drops "peer review" / "fully cited" claims,
 *     adds the reference-only disclaimer.
 *
 * Direct-SQL UPDATE against lpv.authors + lpv.authors_locales. Same
 * fast-path pattern as scripts/reassign-non-hien-articles-sql.mjs —
 * Payload's PATCH pipeline is 5+ min per row under pool.max:2, SQL is <1s.
 * The only relevant hook would be on a beforeChange for `bio`, but no such
 * hook exists on Authors collection, so bypassing Payload is safe.
 *
 * Bio bodies are written as Lexical JSON via markdownToLexical.
 *
 * Usage:
 *   node scripts/apply-hien-feedback-author.mjs --dry-run
 *   node scripts/apply-hien-feedback-author.mjs
 */
import 'dotenv/config'
import pg from 'pg'
import { markdownToLexical } from './lib/markdown-to-lexical.mjs'

const URI = process.env.DATABASE_URI
if (!URI) {
  console.error('DATABASE_URI required')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

const HIEN_BIO_VI = `Luật sư Võ Thiện Hiển (Henry Vo) là Luật sư Điều hành Công ty Luật Apolo Lawyers, với hơn 20 năm kinh nghiệm trong lĩnh vực tố tụng dân sự, tranh chấp thương mại, tranh chấp doanh nghiệp và tư vấn pháp lý cho các cá nhân, tổ chức trong và ngoài nước tại Việt Nam.

Ông đã tham gia nhiều vụ việc tranh tụng ở cấp sơ thẩm và phúc thẩm, đặc biệt trong các lĩnh vực hợp đồng thương mại, đất đai và doanh nghiệp. Các bài viết của ông tập trung vào chiến lược tố tụng, đánh giá chứng cứ, thực tiễn xét xử và bình luận án lệ.`

const HIEN_BIO_EN = `Lawyer Vo Thien Hien (Mr. Henry Vo) is the Managing Lawyer of Apolo Lawyers, with more than 20 years of experience in civil litigation, commercial disputes, corporate disputes and legal advisory work for individuals and organizations in Vietnam and abroad.

He has been involved in numerous first-instance and appellate proceedings, particularly in matters concerning commercial contracts, land and corporate disputes. His writings focus on litigation strategy, evidence assessment, court practice and case commentary.`

const EDITORIAL_BIO_VI = `Ban Biên tập The Apolo Review gồm các luật sư và nhân sự chuyên môn pháp lý của Công ty Luật Apolo Lawyers, cùng các cộng tác viên chuyên môn khi phù hợp. Nội dung được biên tập theo định hướng phân tích pháp lý, có tham khảo nguồn pháp luật và thực tiễn áp dụng tại thời điểm biên soạn, chỉ có giá trị tham khảo và không thay thế cho ý kiến tư vấn pháp lý trong từng trường hợp cụ thể.`

const EDITORIAL_BIO_EN = `The Apolo Review Editorial Team comprises lawyers and legal professionals of Apolo Lawyers, together with specialist contributors where appropriate. The content is prepared for legal analysis purposes, with reference to applicable law and practice at the time of writing. It is for reference purposes only and does not substitute for legal advice in any specific case.`

const client = new pg.Client({ connectionString: URI })

try {
  await client.connect()

  // Confirm the locales table name.
  const tbls = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='lpv' AND table_name LIKE 'authors%' ORDER BY table_name`,
  )
  const tableNames = tbls.rows.map((r) => r.table_name)
  console.log('Discovered tables:', tableNames.join(', '))

  // Figure out the locales-row table name (Payload v3 uses `authors_locales` typically).
  const localesTable = tableNames.find((n) => n === 'authors_locales') ?? 'authors_locales'

  // Inspect a row to know the column names.
  const cols = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_schema='lpv' AND table_name=$1 ORDER BY ordinal_position`,
    [localesTable],
  )
  const colNames = cols.rows.map((r) => r.column_name)
  console.log(`${localesTable} columns:`, colNames.join(', '))

  const before = await client.query(
    `SELECT id, slug, name FROM lpv.authors WHERE slug IN ('vo-thien-hien','editorial-team') ORDER BY slug`,
  )
  console.log('\nBefore:')
  before.rows.forEach((r) => console.log(`  ${r.slug} (id=${r.id}) → name="${r.name}"`))

  if (DRY_RUN) {
    console.log('\nDry run — no changes made.')
    process.exit(0)
  }

  // 1. Update author display name on vo-thien-hien.
  const u1 = await client.query(
    `UPDATE lpv.authors SET name = $1, updated_at = now() WHERE slug = 'vo-thien-hien' RETURNING id`,
    ['LS. Võ Thiện Hiển'],
  )
  console.log(`\nUPDATED lpv.authors name: ${u1.rowCount} row(s)`)

  const hienId = (await client.query(`SELECT id FROM lpv.authors WHERE slug='vo-thien-hien'`)).rows[0]?.id
  const editorialId = (await client.query(`SELECT id FROM lpv.authors WHERE slug='editorial-team'`)).rows[0]?.id

  // 2. Update bios in authors_locales (parent FK column is usually `_parent_id`).
  const hienBioVi = JSON.stringify(markdownToLexical(HIEN_BIO_VI))
  const hienBioEn = JSON.stringify(markdownToLexical(HIEN_BIO_EN))
  const edBioVi = JSON.stringify(markdownToLexical(EDITORIAL_BIO_VI))
  const edBioEn = JSON.stringify(markdownToLexical(EDITORIAL_BIO_EN))

  for (const [authorId, slug, viBio, enBio] of [
    [hienId, 'vo-thien-hien', hienBioVi, hienBioEn],
    [editorialId, 'editorial-team', edBioVi, edBioEn],
  ]) {
    for (const [locale, bio] of [
      ['vi', viBio],
      ['en', enBio],
    ]) {
      const res = await client.query(
        `UPDATE lpv.${localesTable} SET bio = $1::jsonb WHERE _parent_id = $2 AND _locale = $3 RETURNING id`,
        [bio, authorId, locale],
      )
      if (res.rowCount === 0) {
        // Row doesn't exist yet for this locale — INSERT.
        const ins = await client.query(
          `INSERT INTO lpv.${localesTable} (_parent_id, _locale, bio) VALUES ($1, $2, $3::jsonb) RETURNING id`,
          [authorId, locale, bio],
        )
        console.log(`  INSERTED ${slug} [${locale}] bio → row id=${ins.rows[0].id}`)
      } else {
        console.log(`  UPDATED ${slug} [${locale}] bio (${res.rowCount} row)`)
      }
    }
  }

  // 3. Verify
  const after = await client.query(
    `SELECT id, slug, name FROM lpv.authors WHERE slug IN ('vo-thien-hien','editorial-team') ORDER BY slug`,
  )
  console.log('\nAfter:')
  after.rows.forEach((r) => console.log(`  ${r.slug} (id=${r.id}) → name="${r.name}"`))
} catch (e) {
  console.error('FAIL:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
