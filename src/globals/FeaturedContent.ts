import type { GlobalConfig } from 'payload'

export const FeaturedContent: GlobalConfig = {
  slug: 'featured-content',
  access: { read: () => true },
  fields: [
    {
      name: 'heroArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: { description: 'Lead feature on the homepage hero' },
    },
    {
      name: 'featuredArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: { description: 'Up to 6 additional featured articles on the homepage' },
    },
    {
      name: 'editorsPick',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: { description: 'Editor\'s pick rail — deep analysis the editorial team recommends' },
    },
    {
      name: 'featuredSeries',
      type: 'relationship',
      relationTo: 'series',
      hasMany: true,
    },
  ],
}
