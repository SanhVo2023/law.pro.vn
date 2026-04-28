import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    { name: 'intro', type: 'textarea', localized: true, admin: { description: 'Short descriptive block shown in the footer' } },
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true, localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'href', type: 'text', required: true },
            { name: 'external', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'ecosystemLinks',
      type: 'array',
      admin: { description: 'Outbound links to other Apolo ecosystem properties. Allowed targets: luatsutructuyen.vn, vothienhien.com, law.org.vn, apololegal.com.' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'heading', type: 'text', localized: true, defaultValue: 'Nhận bài phân tích mới' },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    { name: 'copyrightLine', type: 'text', localized: true },
  ],
}
