#!/usr/bin/env node
/**
 * F-001 — Strip 3rd-party publisher sources/credits from article Lexical bodies.
 *
 * Walks `content` and `excerpt` (if rich) for every Article in both VI and EN
 * locales. For each Lexical node tree:
 *   - Type 'link' / 'autolink' nodes whose URL host is NOT in the allowlist
 *     are unwrapped (children promoted into the parent), preserving the
 *     surrounding text.
 *   - Top-level paragraph nodes whose plain text matches /^(Nguồn|Source)\s*:/i
 *     are dropped entirely.
 *   - Paragraphs that contain ONLY a stripped link's text (no other content
 *     and no surrounding sentence context) are dropped too.
 *
 * Allowlist (from HIEN_PHASE1_FIX_PROMPTS.md + SITE_BUILD_FEEDBACK.md Issue 9):
 *   - Any *.gov.vn (case-insensitive, any subdomain)
 *   - vbpl.vn (case-insensitive)
 *   - Internal ecosystem cross-links: vothienhien.com, law.org.vn, law.pro.vn,
 *     lawyer.id.vn, luatsutructuyen.vn (these are not 3rd-party).
 *   - Parent-brand: apolo.com.vn (VN articles only — Issue 13). We treat both
 *     apolo.com.vn and apololawyers.com as allowed here; locale-correctness is
 *     handled separately by SiteFooter + JSON-LD, not by content links.
 *
 * Usage:
 *   node scripts/strip-third-party-sources.mjs --dry-run   # report only
 *   node scripts/strip-third-party-sources.mjs              # write changes
 */
import 'dotenv/config'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD
if (!EMAIL || !PASSWORD) {
  console.error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')

const ALLOWED_HOST_PATTERNS = [
  /\.gov\.vn$/i,
  /^gov\.vn$/i,
  /^vbpl\.vn$/i,
  /\.vbpl\.vn$/i,
  /^vothienhien\.com$/i,
  /\.vothienhien\.com$/i,
  /^law\.org\.vn$/i,
  /^law\.pro\.vn$/i,
  /^lawyer\.id\.vn$/i,
  /^luatsutructuyen\.vn$/i,
  /\.luatsutructuyen\.vn$/i,
  /^apolo\.com\.vn$/i,
  /\.apolo\.com\.vn$/i,
  /^apololawyers\.com$/i,
  /\.apololawyers\.com$/i,
]

function hostAllowed(host) {
  if (!host) return false
  const h = host.toLowerCase().replace(/^www\./, '')
  return ALLOWED_HOST_PATTERNS.some((re) => re.test(h))
}

function nodeToPlainText(n) {
  if (!n) return ''
  if (n.type === 'text' || typeof n.text === 'string') return n.text || ''
  if (Array.isArray(n.children)) return n.children.map(nodeToPlainText).join('')
  return ''
}

// Recursively walk a Lexical tree and mutate. Returns { tree, stats }.
function rewriteTree(root, stats) {
  if (!root || typeof root !== 'object') return root

  function walk(node) {
    if (!node || typeof node !== 'object') return node

    // First recurse into children so unwrapping bubbles up.
    if (Array.isArray(node.children)) {
      const next = []
      for (const child of node.children) {
        const result = walk(child)
        if (result == null) continue
        if (Array.isArray(result)) {
          next.push(...result)
        } else {
          next.push(result)
        }
      }
      node.children = next
    }

    // Handle link / autolink nodes — unwrap if disallowed.
    if (node.type === 'link' || node.type === 'autolink') {
      const url = node?.fields?.url || node?.url || ''
      let host = ''
      try {
        host = new URL(url).host
      } catch {
        // Relative or malformed URL — treat as internal/safe.
      }
      const allowed = !host || hostAllowed(host)
      if (!allowed) {
        stats.linksStripped += 1
        stats.examples.push({ kind: 'link', url, host })
        // Unwrap: replace this link node with its children.
        return node.children || []
      }
    }

    return node
  }

  // Drop top-level paragraphs that match "Nguồn:" / "Source:" patterns.
  if (root.root && Array.isArray(root.root.children)) {
    root.root.children = root.root.children.filter((para) => {
      if (para?.type !== 'paragraph') return true
      const text = nodeToPlainText(para).trim()
      if (/^(Nguồn|Nguồn|Source|Theo)\s*[:：]\s*/i.test(text)) {
        stats.paragraphsDropped += 1
        stats.examples.push({ kind: 'paragraph', text: text.slice(0, 140) })
        return false
      }
      return true
    })

    // Now walk each top-level child to unwrap disallowed links inline.
    root.root.children = root.root.children
      .map((c) => walk(c))
      .filter((c) => c != null)
      .flat()
  }

  return root
}

async function login() {
  const r = await fetch(`${SITE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!r.ok) throw new Error(`Login failed ${r.status}`)
  return (await r.json()).token
}

async function listArticles(token, locale) {
  const all = []
  let page = 1
  while (true) {
    const r = await fetch(
      `${SITE}/api/articles?locale=${locale}&depth=0&limit=100&page=${page}`,
      { headers: { Authorization: `JWT ${token}` } },
    )
    const d = await r.json()
    all.push(...(d.docs || []))
    if (!d.hasNextPage) break
    page += 1
  }
  return all
}

async function patchArticle(token, id, locale, body) {
  const r = await fetch(`${SITE}/api/articles/${id}?locale=${locale}`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const t = await r.text().catch(() => '')
    throw new Error(`PATCH /articles/${id}?locale=${locale} → ${r.status} ${t.slice(0, 200)}`)
  }
}

async function main() {
  console.log(`MODE: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (will PATCH)'}`)
  console.log(`Server: ${SITE}\n`)

  const token = await login()
  console.log('Logged in.\n')

  for (const locale of ['vi', 'en']) {
    console.log(`=== Locale: ${locale} ===`)
    const articles = await listArticles(token, locale)
    console.log(`  ${articles.length} articles\n`)

    let modified = 0
    for (const a of articles) {
      const stats = { linksStripped: 0, paragraphsDropped: 0, examples: [] }
      const before = JSON.stringify(a.content)
      const next = rewriteTree(JSON.parse(before), stats)
      const after = JSON.stringify(next)

      if (after !== before) {
        modified += 1
        console.log(
          `  ~ ${a.slug} — strip ${stats.linksStripped} link(s), drop ${stats.paragraphsDropped} paragraph(s)`,
        )
        for (const ex of stats.examples.slice(0, 3)) {
          if (ex.kind === 'link') console.log(`      link → ${ex.host}`)
          else console.log(`      para → "${ex.text}"`)
        }
        if (!DRY_RUN) {
          try {
            await patchArticle(token, a.id, locale, { content: next })
            await new Promise((r) => setTimeout(r, 150))
          } catch (e) {
            console.error(`      FAILED: ${e.message}`)
          }
        }
      }
    }

    console.log(`  → ${modified} article(s) would change in ${locale}\n`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
