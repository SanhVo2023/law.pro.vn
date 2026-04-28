import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true, admin: { description: 'Locale-relative path, e.g. /thuc-tien-xet-xu (without /vi or /en prefix)' } },
      ],
    },
    {
      name: 'languageSwitcher',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'viLabel', type: 'text', defaultValue: 'VI' },
        { name: 'enLabel', type: 'text', defaultValue: 'EN' },
      ],
    },
  ],
}
