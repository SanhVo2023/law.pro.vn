/**
 * Render-time recovery for markdown that the original import flattened.
 *
 * Root cause (QA-LPRO-016/019/026/030/032/044/045/046/047/048/050/051/065):
 * `scripts/lib/markdown-to-lexical.mjs` split the source markdown into blocks
 * on BLANK lines only. Any block that mixed a heading with a list, a lead-in
 * sentence with a list, or a pipe table fell through to the default branch,
 * which joined all lines with single spaces into ONE paragraph. The Lexical
 * documents in the DB therefore contain paragraphs like:
 *
 *   "### 1. Email và tin nhắn - Email giao dịch thương mại - Tin nhắn SMS…"
 *   "Nguyên đơn (cá nhân): - Họ và tên đầy đủ - Năm sinh - …"
 *   "| Thời kỳ | Văn bản áp dụng | |---------|---| | Trước 15/10/1993 | … |"
 *
 * The durable fix is re-importing the articles from corrected markdown (see
 * scripts/import-articles.mjs) — but site writes are currently unsafe, so this
 * module conservatively reconstructs the block structure at render time. Every
 * transform requires an unambiguous marker (leading `###`, a colon followed by
 * ≥2 " - " separators, a leading pipe with a `---` separator row) so ordinary
 * prose is never touched. Once content is re-imported cleanly these transforms
 * simply stop matching.
 */

export type LexNode = {
  type: string
  version?: number
  children?: LexNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  start?: number
  value?: number
  fields?: Record<string, unknown>
  [key: string]: unknown
}

const FORMAT_CODE = 16

function textNode(text: string, format: number | string = 0): LexNode {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

/** Concatenated plain text of a node tree (used for meta descriptions too). */
export function lexicalPlainText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(lexicalPlainText).join(' ')
  if (typeof node === 'object') {
    const n = node as LexNode & { root?: { children?: unknown[] } }
    if (typeof n.text === 'string') return n.text
    if (n.root?.children) return lexicalPlainText(n.root.children)
    if (n.children) return lexicalPlainText(n.children)
  }
  return ''
}

/** Plain text of an inline-node sequence without recursing into structure. */
function inlineText(nodes: LexNode[]): string {
  return nodes.map((n) => lexicalPlainText(n)).join('')
}

function isTextNode(n: LexNode): boolean {
  return n.type === 'text' && typeof n.text === 'string'
}

function trimSegment(seg: LexNode[]): LexNode[] {
  const out = seg.map((n) => ({ ...n }))
  const first = out[0]
  if (first && isTextNode(first)) first.text = (first.text as string).replace(/^\s+/, '')
  const last = out[out.length - 1]
  if (last && isTextNode(last)) last.text = (last.text as string).replace(/\s+$/, '')
  return out.filter((n) => !(isTextNode(n) && n.text === ''))
}

/**
 * Split a sequence of inline nodes on a separator that may only occur inside
 * plain text nodes. Formatted runs / links are kept intact within a segment.
 */
function splitInline(nodes: LexNode[], sep: RegExp): LexNode[][] {
  const segments: LexNode[][] = [[]]
  for (const n of nodes) {
    if (isTextNode(n)) {
      const parts = (n.text as string).split(sep)
      parts.forEach((part, i) => {
        if (i > 0) segments.push([])
        if (part !== '') segments[segments.length - 1].push({ ...n, text: part })
      })
    } else {
      segments[segments.length - 1].push(n)
    }
  }
  return segments.map(trimSegment).filter((s) => s.length > 0)
}

/** " - " runs are how single-newline list items look after the space-join. */
const ITEM_SEP = /\s+-\s+/

function makeList(itemSegments: LexNode[][]): LexNode {
  return {
    type: 'list',
    tag: 'ul',
    listType: 'bullet',
    start: 1,
    children: itemSegments.map((seg, i) => ({
      type: 'listitem',
      value: i + 1,
      children: seg,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    })),
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function makeHeading(tag: 'h2' | 'h3' | 'h4', children: LexNode[]): LexNode {
  return { type: 'heading', tag, children, direction: null, format: '', indent: 0, version: 1 }
}

function makeParagraph(children: LexNode[]): LexNode {
  return { type: 'paragraph', children, direction: null, format: '', indent: 0, version: 1 }
}

/** Table recovered from a space-joined markdown pipe table. Rendered by
 *  LexicalContent's `md-table` case (plain text cells — formatting inside
 *  recovered tables is intentionally dropped). */
export type MdTableNode = LexNode & { type: 'md-table'; header: string[]; rows: string[][] }

function tryTable(children: LexNode[]): LexNode[] | null {
  if (!children.every(isTextNode)) return null
  const text = inlineText(children).trim()
  if (!text.startsWith('|') || !/\|\s*:?-{2,}/.test(text)) return null
  // Row boundary after the space-join: a closing pipe directly followed
  // (after whitespace) by the next row's opening pipe.
  const rawRows = text.split(/\|\s+(?=\|)/).map((r) => r.trim())
  const rows: string[][] = []
  for (const raw of rawRows) {
    const cells = raw
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim())
    if (cells.length === 0) continue
    // Drop markdown separator rows (|---|---|).
    if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === '')) continue
    rows.push(cells)
  }
  if (rows.length < 2) return null
  const [header, ...body] = rows
  const node: MdTableNode = {
    type: 'md-table',
    header,
    rows: body,
    version: 1,
  }
  return [node]
}

function tryHeadingWithList(children: LexNode[]): LexNode[] | null {
  const first = children[0]
  if (!first || !isTextNode(first)) return null
  const m = (first.text as string).match(/^(#{2,6})\s+/)
  if (!m) return null
  const depth = m[1].length
  const tag: 'h2' | 'h3' | 'h4' = depth <= 2 ? 'h2' : depth === 3 ? 'h3' : 'h4'
  const stripped = children.map((n, i) =>
    i === 0 ? { ...n, text: (n.text as string).slice(m[0].length) } : { ...n },
  )
  const segments = splitInline(stripped, ITEM_SEP)
  if (segments.length >= 3) {
    // heading + ≥2 items — the glued "### Heading - item - item" shape.
    return [makeHeading(tag, segments[0]), makeList(segments.slice(1))]
  }
  // Just a flattened heading (or one ambiguous " - " → keep it in the heading).
  return [makeHeading(tag, trimSegment(stripped))]
}

function tryColonList(children: LexNode[]): LexNode[] | null {
  const text = inlineText(children)
  // Pure inline list: "- item - item - item"
  if (/^-\s+/.test(text)) {
    const first = children[0]
    if (first && isTextNode(first)) {
      const stripped = children.map((n, i) =>
        i === 0 ? { ...n, text: (n.text as string).replace(/^-\s+/, '') } : { ...n },
      )
      const segments = splitInline(stripped, ITEM_SEP)
      if (segments.length >= 2) return [makeList(segments)]
    }
    return null
  }
  // Lead-in sentence ending with a colon, then ≥2 glued items.
  if (!/[:：]\s+-\s+/.test(text)) return null
  const segments = splitInline(children, ITEM_SEP)
  if (segments.length < 3) return null
  if (!/[:：]$/.test(inlineText(segments[0]).trim())) return null
  return [makeParagraph(segments[0]), makeList(segments.slice(1))]
}

/** Strip literal backticks that the import's inline-code regex left behind
 *  around code chips ("`` X ``" → text "`" + code " X " + text "`"). */
function cleanInline(children: LexNode[]): LexNode[] {
  const out = children.map((n) => ({ ...n }))
  const isCode = (n: LexNode | undefined) =>
    !!n && isTextNode(n) && typeof n.format === 'number' && (n.format & FORMAT_CODE) !== 0
  for (let i = 0; i < out.length; i++) {
    const n = out[i]
    if (!isTextNode(n)) continue
    if (isCode(n)) {
      n.text = (n.text as string).trim()
      continue
    }
    if (isCode(out[i + 1])) n.text = (n.text as string).replace(/`\s*$/, ' ').replace(/\s+$/, ' ')
    if (isCode(out[i - 1])) n.text = (n.text as string).replace(/^\s*`/, ' ').replace(/^\s+/, ' ')
  }
  return out.filter((n) => !(isTextNode(n) && (n.text as string) === ''))
}

/** Strip literal "[ ]" / "[x]" task-list markers at the start of a list item. */
function stripCheckbox(children: LexNode[]): LexNode[] {
  const first = children[0]
  if (first && isTextNode(first)) {
    const replaced = (first.text as string).replace(/^\s*\[(?:\s|x|X)?\]\s*/, '')
    if (replaced !== first.text) {
      return [{ ...first, text: replaced }, ...children.slice(1)]
    }
  }
  return children
}

function normalizeBlock(node: LexNode): LexNode[] {
  if (node.type === 'paragraph' && node.children?.length) {
    const cleaned = cleanInline(node.children)
    const asTable = tryTable(cleaned)
    if (asTable) return asTable
    const asHeading = tryHeadingWithList(cleaned)
    if (asHeading) return asHeading
    const asList = tryColonList(cleaned)
    if (asList) return asList
    return [{ ...node, children: cleaned }]
  }
  if (node.type === 'heading' && node.children?.length) {
    return [{ ...node, children: cleanInline(node.children) }]
  }
  if (node.type === 'list' && node.children?.length) {
    return [
      {
        ...node,
        children: node.children.map((li) =>
          li.type === 'listitem' && li.children?.length
            ? { ...li, children: stripCheckbox(cleanInline(li.children)) }
            : li,
        ),
      },
    ]
  }
  return [node]
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * Normalize a Lexical root's children before rendering.
 * `title` (when given) drops a leading heading that duplicates the page H1
 * (QA-LPRO-044/050/065 — imported bodies start with "# <title>").
 */
export function normalizeLexicalChildren(children: LexNode[], opts?: { title?: string }): LexNode[] {
  let out = children.flatMap(normalizeBlock)
  if (opts?.title) {
    const wanted = normalizeText(opts.title)
    const idx = out.findIndex((n) => lexicalPlainText(n).trim() !== '')
    if (idx !== -1 && out[idx].type === 'heading' && normalizeText(lexicalPlainText(out[idx])) === wanted) {
      out = [...out.slice(0, idx), ...out.slice(idx + 1)]
    }
  }
  return out
}
