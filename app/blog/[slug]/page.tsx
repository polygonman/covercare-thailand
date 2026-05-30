import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { marked } from "marked"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { getArticle, getAllSlugs } from "@/lib/articles"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  const url = `https://www.thaicovercare.com/blog/${slug}`
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
    },
    alternates: { canonical: url },
  }
}

const TAG_COLORS: Record<string, string> = {
  Plans: "bg-sky-50 text-navy-700",
  Guide: "bg-blue-50 text-blue-700",
  Nomads: "bg-purple-50 text-purple-700",
  Claims: "bg-amber-50 text-amber-700",
  Retirees: "bg-green-50 text-green-700",
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const html = await marked(article.content)

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <article>
          <header className="py-12 bg-gradient-to-br from-sky-50 to-white">
            <div className="max-w-3xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/blog" className="text-sm text-gray-500 hover:text-sky-600 transition-colors">
                  ← All articles
                </Link>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TAG_COLORS[article.tag] ?? "bg-gray-100 text-gray-600"}`}>
                  {article.tag}
                </span>
                <span className="text-xs text-gray-400">{article.date} · {article.readTime} read</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>
            </div>
          </header>

          <div className="py-10 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <div
                className="prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-table:text-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </article>

        <section className="py-12 bg-sky-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to get covered?</h2>
            <p className="text-gray-600 mb-6">
              Every situation is different. Get personalised advice — free, no obligation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
              >
                Book Free Consultation
              </Link>
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent(`Hi! I just read your article "${article.title}" and have a question.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                WhatsApp our team
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
