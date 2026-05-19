import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { articles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Expat Health Insurance Guides for Thailand",
  description:
    "Practical guides to health insurance in Thailand — plans, claims, hospital visits, and advice for expats, digital nomads, and retirees. Written in plain English.",
  openGraph: {
    title: "Expat Health Insurance Guides for Thailand",
    description: "Practical, plain-English guides to health insurance in Thailand for expats, nomads, and retirees.",
    url: "https://www.thaicovercare.com/blog",
  },
  alternates: { canonical: "https://www.thaicovercare.com/blog" },
}

const TAG_COLORS: Record<string, string> = {
  Plans: "bg-sky-50 text-navy-700",
  Guide: "bg-blue-50 text-blue-700",
  Nomads: "bg-purple-50 text-purple-700",
  Claims: "bg-amber-50 text-amber-700",
  Retirees: "bg-green-50 text-green-700",
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-sky-50 to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
            <p className="text-xl text-gray-600">
              Practical guides to health insurance in Thailand — written for expats, not insurance experts.
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col gap-6">
              {articles.map(({ slug, title, excerpt, date, readTime, tag }) => (
                <article
                  key={slug}
                  className="border border-gray-200 rounded-xl p-6 hover:border-sky-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TAG_COLORS[tag]}`}>
                      {tag}
                    </span>
                    <span className="text-xs text-gray-400">{date} · {readTime} read</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/blog/${slug}`} className="hover:text-sky-600 transition-colors">
                      {title}
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">{excerpt}</p>
                  <Link href={`/blog/${slug}`} className="text-sm text-sky-600 font-medium hover:underline">
                    Read article →
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-12 bg-sky-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Have a specific question?</h3>
              <p className="text-gray-600 mb-4">
                Don&apos;t rely on generic articles — get personalised advice for your situation.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
              >
                Ask Me Directly
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
