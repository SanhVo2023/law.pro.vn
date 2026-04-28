import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'article', 'approved', 'publishedDate'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { approved: { equals: true } }
    },
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'article', type: 'relationship', relationTo: 'articles', required: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorEmail', type: 'email' },
    { name: 'content', type: 'textarea', required: true },
    { name: 'approved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'publishedDate',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
