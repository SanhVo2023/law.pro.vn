/**
 * Convert a markdown string to PayloadCMS Lexical JSON.
 * Supports: # / ## / ### headings, paragraphs, **bold**, *italic*, `code`,
 * [text](url) links, - / * unordered lists, 1. ordered lists, > block quotes,
 * --- horizontal rules.
 *
 * Returns the full root object: { root: { ... } }.
 *
 * Reference: shared-assets/LEXICAL_FORMAT_REFERENCE.md.
 */

function textNode(text, format = 0) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function parseInline(text) {
  const nodes = []
  // Order matters: bold-italic first, then bold, italic, code, link.
  // Code supports single AND double backticks (``x``) so stray literal
  // backticks never leak into the rendered body (QA-LPRO-046/047).
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`{1,2}\s*([^`]+?)\s*`{1,2}|\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\))/g
  let last = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(textNode(text.slice(last, m.index)))
    if (m[2]) nodes.push(textNode(m[2], 3))
    else if (m[3]) nodes.push(textNode(m[3], 1))
    else if (m[4]) nodes.push(textNode(m[4], 2))
    else if (m[5]) nodes.push(textNode(m[5], 16))
    else if (m[6] && m[7]) {
      nodes.push({
        type: 'link',
        fields: { url: m[7], linkType: 'custom', newTab: false },
        children: [textNode(m[6])],
        direction: null,
        format: '',
        indent: 0,
        version: 3,
      })
    }
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(textNode(text.slice(last)))
  return nodes.length > 0 ? nodes : [textNode(text)]
}

function headingNode(depth, text) {
  return {
    type: 'heading',
    tag: `h${Math.min(depth, 4)}`,
    children: parseInline(text),
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function listNode(tag, listType, items) {
  return {
    type: 'list',
    tag,
    listType,
    start: 1,
    children: items.map((text, i) => ({
      type: 'listitem',
      value: i + 1,
      children: parseInline(text),
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

function paragraphNode(text) {
  return {
    type: 'paragraph',
    children: parseInline(text),
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

/**
 * Classify a single markdown line. QA-LPRO-016/019/026/030/032/045/048/051:
 * the previous implementation only split on BLANK lines, so a heading
 * followed directly by a list (single newline) — or a lead-in sentence
 * followed by "- item" lines — collapsed into one space-joined paragraph
 * with literal "###" and " - " markers. Segmentation is now line-level.
 */
function classifyLine(line) {
  if (/^(#{1,6})\s+/.test(line)) return 'heading'
  if (/^[-*]\s+/.test(line)) return 'ul'
  if (/^\d+\.\s+/.test(line)) return 'ol'
  if (/^>\s?/.test(line)) return 'quote'
  if (/^\|/.test(line)) return 'table'
  if (line === '---' || line === '***') return 'hr'
  return 'text'
}

export function markdownToLexical(markdown) {
  if (!markdown) return undefined
  const blocks = String(markdown).replace(/\r\n/g, '\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  const children = []

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    let i = 0
    while (i < lines.length) {
      const kind = classifyLine(lines[i])

      if (kind === 'heading') {
        const m = lines[i].match(/^(#{1,6})\s+(.+)$/)
        children.push(headingNode(m[1].length, m[2]))
        i += 1
        continue
      }

      if (kind === 'hr') {
        children.push({ type: 'horizontalrule', version: 1 })
        i += 1
        continue
      }

      if (kind === 'ul' || kind === 'ol') {
        const items = []
        while (i < lines.length && classifyLine(lines[i]) === kind) {
          items.push(
            lines[i]
              .replace(kind === 'ul' ? /^[-*]\s+/ : /^\d+\.\s+/, '')
              // Task-list markers render as literal "[ ]" (QA-LPRO-030) — strip.
              .replace(/^\[(?:\s|x|X)?\]\s*/, ''),
          )
          i += 1
        }
        children.push(listNode(kind === 'ul' ? 'ul' : 'ol', kind === 'ul' ? 'bullet' : 'number', items))
        continue
      }

      if (kind === 'quote') {
        const parts = []
        while (i < lines.length && classifyLine(lines[i]) === 'quote') {
          parts.push(lines[i].replace(/^>\s?/, ''))
          i += 1
        }
        children.push({
          type: 'quote',
          children: parseInline(parts.join(' ')),
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        })
        continue
      }

      if (kind === 'table') {
        // Keep the pipe-table lines as one space-joined paragraph — the
        // frontend renderer (lexical-normalize.ts tryTable) reconstructs a
        // real <table> from this shape.
        const parts = []
        while (i < lines.length && classifyLine(lines[i]) === 'table') {
          parts.push(lines[i])
          i += 1
        }
        children.push(paragraphNode(parts.join(' ')))
        continue
      }

      // Plain text: consume consecutive text lines into one paragraph.
      const parts = []
      while (i < lines.length && classifyLine(lines[i]) === 'text') {
        parts.push(lines[i])
        i += 1
      }
      children.push(paragraphNode(parts.join(' ')))
    }
  }

  return {
    root: {
      type: 'root',
      children,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
