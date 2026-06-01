import type { GlobalConfig } from 'payload'

// Fully CMS-editable footer. The fields the frontend renders are: brandName,
// brandTagline, intro (brand description), linkColumns, offices, copyrightLine —
// each localized (vi/en). `linkColumns` and `offices` are localized arrays, so
// each locale's footer is edited independently. SiteFooter.tsx falls back to the
// built-in defaults when a field is empty, so an unseeded/partial footer still
// renders. Seeded from the canonical sources (identity.ts, SECTIONS, messages)
// via scripts/seed-footer.mjs.
//
// IMPORTANT — schema changes here run through Payload `db.push`, whose drizzle
// introspection prompts interactively (and hangs headless) on any table
// drop/rename. So this change is PURELY ADDITIVE: the legacy fields
// (columns / ecosystemLinks / newsletter) are KEPT but hidden — never remove
// them without a real migration, or push will block the deploy.
//
// Governance: the head-office/branch address originates from the canonical
// address.txt SSOT. By owner request (2026-06-01) it is editable here; keep it
// matching address.txt unless the firm's registered address changes. Ecosystem
// links follow the parent-brand split (Issue 13): vi → apolo.com.vn,
// en → apololawyers.com; never cross-link the two parent brands.
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  admin: {
    description:
      'Footer content — every field is per-locale (switch VI/EN top-right). Empty fields fall back to the built-in defaults.',
  },
  fields: [
    { name: 'brandName', type: 'text', localized: true, admin: { description: 'Masthead name shown top-left of the footer.' } },
    { name: 'brandTagline', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true, label: 'Brand description', admin: { description: 'Short descriptive paragraph under the brand name.' } },
    {
      name: 'linkColumns',
      type: 'array',
      localized: true,
      label: 'Link columns',
      admin: { description: 'Sections, About, Ecosystem, … Each column is a heading + a list of links.' },
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text', admin: { description: 'Internal path (e.g. /thuc-tien-xet-xu) or a full https:// URL for external links.' } },
            { name: 'external', type: 'checkbox', defaultValue: false, admin: { description: 'Opens in a new tab; rendered without a locale prefix.' } },
          ],
        },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      localized: true,
      label: 'Offices / address',
      admin: { description: 'Head office + branches. Canonical source: address.txt — keep in sync with the firm’s registered address.' },
      fields: [
        { name: 'label', type: 'text', admin: { description: 'e.g. “Trụ sở chính” / “Head Office”.' } },
        { name: 'name', type: 'text' },
        { name: 'address', type: 'textarea' },
        { name: 'email', type: 'text' },
        { name: 'phones', type: 'textarea', admin: { description: 'One phone number per line.' } },
      ],
    },
    { name: 'copyrightLine', type: 'text', localized: true },

    // ---- Legacy fields (pre-2026-06-01). Kept & hidden so push stays additive;
    // not rendered by the frontend. Remove only via a real migration. ----
    { name: 'columns', type: 'array', admin: { hidden: true }, fields: [
      { name: 'heading', type: 'text', localized: true },
      { name: 'links', type: 'array', fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
        { name: 'external', type: 'checkbox', defaultValue: false },
      ]},
    ]},
    { name: 'ecosystemLinks', type: 'array', admin: { hidden: true }, fields: [
      { name: 'label', type: 'text', localized: true },
      { name: 'href', type: 'text' },
    ]},
    { name: 'newsletter', type: 'group', admin: { hidden: true }, fields: [
      { name: 'enabled', type: 'checkbox', defaultValue: true },
      { name: 'heading', type: 'text', localized: true },
      { name: 'description', type: 'textarea', localized: true },
    ]},
  ],
}
