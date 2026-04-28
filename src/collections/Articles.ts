import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'publishedDate', 'readingTime'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slugEn',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'EN-locale slug when it differs from the VI slug (e.g., court-practice-vietnam vs thuc-tien-xet-xu)',
      },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'keyTakeaways',
      type: 'array',
      labels: { singular: 'Takeaway', plural: 'Key takeaways' },
      localized: true,
      admin: { description: '3–5 bullet summary shown in the "Key Takeaways" box at the top of the article' },
      fields: [{ name: 'point', type: 'textarea', required: true }],
    },
    {
      name: 'footnotes',
      type: 'array',
      labels: { singular: 'Footnote', plural: 'Footnotes' },
      localized: true,
      admin: { description: 'Endnote / citation list referenced from body copy by index' },
      fields: [
        { name: 'label', type: 'text', admin: { description: 'Optional short label shown on hover' } },
        { name: 'body', type: 'textarea', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      admin: { position: 'sidebar' },
    },
    {
      name: 'seriesOrder',
      type: 'number',
      admin: { position: 'sidebar', description: 'Position within the series (1, 2, 3…)' },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: { description: '3–5 related articles shown in the sidebar / end-of-article rail' },
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', description: 'Minutes — auto-calculated on save (vi: 200 wpm, en: 250 wpm)' },
    },
    {
      name: 'contentType',
      type: 'select',
      defaultValue: 'analysis',
      options: [
        { label: 'Deep analysis', value: 'analysis' },
        { label: 'Case commentary', value: 'case-commentary' },
        { label: 'Practice note', value: 'practice-note' },
        { label: 'Professional essay', value: 'essay' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data) return data
        // Compute reading time from Lexical content text. VI default 200 wpm, EN 250 wpm.
        const locale = (req as { locale?: string })?.locale || 'vi'
        const wpm = locale === 'en' ? 250 : 200
        const text = extractText(data.content)
        const words = text.split(/\s+/).filter(Boolean).length
        if (words > 0) {
          data.readingTime = Math.max(1, Math.round(words / wpm))
        }
        return data
      },
    ],
  },
}

type LexicalLike = { root?: { children?: unknown[] } } | null | undefined
function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (typeof node === 'object') {
    const n = node as { text?: string; children?: unknown[]; root?: { children?: unknown[] } }
    if (typeof n.text === 'string') return n.text
    if (n.root?.children) return extractText(n.root.children)
    if (n.children) return extractText(n.children)
  }
  return ''
}
// Suppress unused warning; LexicalLike kept for future strict typing.
export type _ReadingTimeInput = LexicalLike
