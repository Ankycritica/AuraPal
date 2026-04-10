import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aurapal.org'
  
  const routes = [
    '',
    '/dashboard',
    '/resume-builder',
    '/cover-letter',
    '/linkedin-optimizer',
    '/interview-prep',
    '/roast-resume',
    '/side-hustle',
    '/business-plan',
    '/linkedin-roast'
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
