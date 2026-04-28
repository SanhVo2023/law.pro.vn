import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug', 'title'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'title', type: 'text', localized: true, admin: { description: 'Professional title, e.g. "Managing Partner"' } },
    { name: 'bio', type: 'richText', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'credentials',
      type: 'array',
      labels: { singular: 'Credential', plural: 'Credentials' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'issuer', type: 'text', localized: true },
        { name: 'year', type: 'number' },
      ],
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [{ name: 'area', type: 'text', required: true, localized: true }],
    },
    { name: 'linkedin', type: 'text' },
    { name: 'email', type: 'email' },
  ],
}
