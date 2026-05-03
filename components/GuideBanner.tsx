import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function GuideBanner() {
  return (
    <section className="bg-teal-700 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex items-start gap-5">
          <div className="hidden md:flex w-12 h-12 bg-teal-600 border border-teal-500 rounded-xl items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <p className="text-teal-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Free Resource
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">
              The Expat&apos;s Complete Guide to Health Insurance in Thailand
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed max-w-lg">
              Plain-English PDF covering plans, hospitals, claims, and visas — written by a licensed
              Allianz Ayudhya advisor.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <BookOpen size={16} />
            Download Free Guide
          </Link>
        </div>
      </div>
    </section>
  )
}
