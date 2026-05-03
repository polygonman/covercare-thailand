import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import GuideForm from "@/components/GuideForm"

export const metadata: Metadata = {
  title: "Free Guide: Expat Health Insurance in Thailand",
  description:
    "Download 'The Expat's Complete Guide to Health Insurance in Thailand' — free, plain-English PDF covering plans, hospitals, claims, and visas.",
  alternates: { canonical: "https://www.thaicovercare.com/guide" },
}

const chapters = [
  "How Thai private health insurance works",
  "Allianz Ayudhya plan tiers explained",
  "What's covered — and what's not",
  "How to use your insurance at a Thai hospital",
  "Filing a claim step by step",
  "Plans compatible with retirement & LTR visas",
  "Common mistakes expats make",
  "Questions to ask before you sign",
]

export default function GuidePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Free Download
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  The Expat&apos;s Complete Guide to Health Insurance in Thailand
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Everything you need to know before buying a policy — written in plain English by
                  Tonkla, an Allianz Ayudhya advisor based in Thailand.
                </p>
                <ul className="flex flex-col gap-2 mb-8">
                  {chapters.map((ch) => (
                    <li key={ch} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      {ch}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Get the free guide</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Enter your email and I&apos;ll send it straight to your inbox.
                </p>
                <GuideForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
