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
      fields: [
        { name: 'companyName', type: 'text', defaultValue: 'CÔNG TY LUẬT APOLO LAWYERS' },
        { name: 'address', type: 'textarea', localized: true, defaultValue: '108 Trần Đình Xu, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM' },
        { name: 'email', type: 'email', defaultValue: 'contact@apolo.com.vn' },
        { name: 'phone', type: 'text', defaultValue: '0903 419 479' },
      ],
    },
  ],
}
