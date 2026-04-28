import type { CollectionConfig } from 'payload'

export const Series: CollectionConfig = {
  slug: 'series',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'in-progress',
      options: [
        { label: 'In progress', value: 'in-progress' },
        { label: 'Complete', value: 'complete' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
  ],
}
