import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'The Apolo Review' },
    { name: 'tagline', type: 'text', localized: true, defaultValue: 'Phân tích chuyên sâu cho giới luật sư' },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        { name: 'gaId', type: 'text' },
        { name: 'gtmId', type: 'text' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      // Canonical post-2025 admin-merger contact block. SSOT is workspace-root
      // address.txt + src/lib/identity.ts — do not hand-edit defaults here.
      fields: [
        { name: 'companyName', type: 'text', defaultValue: 'Công ty Luật Apolo Lawyers' },
        {
          name: 'address',
          type: 'textarea',
          localized: true,
          defaultValue: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh',
        },
        { name: 'email', type: 'email', defaultValue: 'contact@apolo.com.vn' },
        { name: 'phone', type: 'text', defaultValue: '(028) 66.701.709' },
      ],
    },
  ],
}
