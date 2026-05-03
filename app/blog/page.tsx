import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"

export const metadata: Metadata = {
  title: "Expat Health Insurance Resources — CoverCare Thailand",
  description: "Guides and articles about health insurance in Thailand for expats, digital nomads, and retirees.",
}

const articles = [
  {
    slug: "best-expat-health-insurance-thailand-2025",
    title: "Best Health Insurance Plans for Expats in Thailand 2025",
    excerpt: "A practical breakdown of Allianz Ayudhya options for foreigners — what's covered, what's not, and how to choose.",
    date: "April 2025",
    readTime: "8 min",
    tag: "Plans",
  },
  {
    slug: "how-to-use-health-insurance-bangkok-hospital",
    title: "How to Use Your Health Insurance at a Bangkok Hospital",
    excerpt: "Step-by-step guide from arriving at the hospital to getting discharged — direct billing vs. reimbursement explained.",
    date: "March 2025",
    readTime: "6 min",
    tag: "Guide",
  },
  {
    slug: "digital-nomad-health-insurance-thailand",
    title: "Digital Nomad Health Insurance in Thailand: What You Need to Know",
    excerpt: "Visa-compatible plans, OPD coverage, and why being underinsured in Thailand is a bigger risk than you think.",
    date: "March 2025",
    readTime: "7 min",
    tag: "Nomads",
  },
  {
    slug: "how-to-file-health-insurance-claim-thailand",
    title: "How to File a Health Insurance Claim in Thailand",
    excerpt: "Documents you need, deadlines to remember, and common mistakes that delay reimbursement.",
    date: "February 2025",
    readTime: "5 min",
    tag: "Claims",
  },
  {
    slug: "retirement-visa-health-insurance-thailand",
    title: "Health Insurance for Retirees on a Thailand Retirement Visa",
    excerpt: "What the 50,000 THB bank deposit requirement means for your insurance, and the best coverage options for seniors.",
    date: "February 2025",
    readTime: "6 min",
    tag: "Retirees",
  },
]

const TAG_COLORS: Record<string, string> = {
  Plans: "bg-teal-50 text-teal-700",
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
        <section className="py-16 bg-gradient-to-br from-teal-50 to-white">
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
                  className="border border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TAG_COLORS[tag]}`}>
                      {tag}
                    </span>
                    <span className="text-xs text-gray-400">{date} · {readTime} read</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                    {title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">{excerpt}</p>
                  <Link
                    href={`/#contact`}
                    className="text-sm text-teal-600 font-medium hover:underline"
                  >
                    Ask Tonkla about this →
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-12 bg-teal-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Have a specific question?</h3>
              <p className="text-gray-600 mb-4">
                Don&apos;t rely on generic articles — get personalised advice for your situation.
              </p>
              <a
                href="/#contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Ask Me Directly
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
