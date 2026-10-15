import { MetadataRoute } from 'next'
import { getSiteUrl } from './lib/site'
import { getPublishedPostsFromDB } from './lib/database'

// 每小時重新產生一次，讓新文章出現在 sitemap
export const revalidate = 3600

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/equipment`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  const posts = await getPublishedPostsFromDB()
  const postPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: toDate(post.updatedAt) || toDate(post.date) || now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...postPages]
}
