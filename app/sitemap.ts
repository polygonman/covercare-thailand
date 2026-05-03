import { MetadataRoute } from "next"

const BASE = "https://www.thaicovercare.com"

const articles = [
  "best-expat-health-insurance-thailand-2025",
  "how-to-use-health-insurance-bangkok-hospital",
  "digital-nomad-health-insurance-thailand",
  "how-to-file-health-insurance-claim-thailand",
  "retirement-visa-health-insurance-thailand",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}
