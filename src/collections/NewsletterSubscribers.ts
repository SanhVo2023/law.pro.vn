import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'locale', 'subscribedDate'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'vi',
      options: [
        { label: 'Vietnamese', value: 'vi' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      name: 'subscribedDate',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
