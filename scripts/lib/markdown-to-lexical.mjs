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
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+?)`|\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\))/g
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

export function markdownToLexical(markdown) {
  if (!markdown) return undefined
  const blocks = String(markdown).replace(/\r\n/g, '\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  const children = []
  for (const block of blocks) {
    const lines = block.split('\n')

    // Heading
    const heading = lines[0].match(/^(#{1,4})\s+(.+)$/)
    if (heading && lines.length === 1) {
      children.push({
        type: 'heading',
        tag: `h${heading[1].length}`,
        children: parseInline(heading[2]),
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Horizontal rule
    if (block === '---' || block === '***') {
      children.push({ type: 'horizontalrule', version: 1 })
      continue
    }

    // Block quote (one or more lines starting with > )
    if (lines.every((l) => l.startsWith('> '))) {
      const text = lines.map((l) => l.slice(2)).join(' ')
      children.push({
        type: 'quote',
        children: parseInline(text),
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Unordered list
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      children.push({
        type: 'list',
        tag: 'ul',
        listType: 'bullet',
        start: 1,
        children: lines.map((l, i) => ({
          type: 'listitem',
          value: i + 1,
          children: parseInline(l.replace(/^[-*]\s+/, '')),
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        })),
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Ordered list
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      children.push({
        type: 'list',
        tag: 'ol',
        listType: 'number',
        start: 1,
        children: lines.map((l, i) => ({
          type: 'listitem',
          value: i + 1,
          children: parseInline(l.replace(/^\d+\.\s+/, '')),
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        })),
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      })
      continue
    }

    // Default: paragraph (collapse soft line breaks into spaces)
    const paragraphText = lines.join(' ')
    children.push({
      type: 'paragraph',
      children: parseInline(paragraphText),
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    })
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
