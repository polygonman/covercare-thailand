import Link from "next/link"

export default function GuideBanner() {
  return (
    <section className="bg-teal-700 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <p className="text-teal-200 text-sm font-medium mb-1 uppercase tracking-wide">
            Free Resource
          </p>
          <h2 className="text-2xl font-bold mb-2">
            The Expat&apos;s Complete Guide to Health Insurance in Thailand
          </h2>
          <p className="text-teal-100 text-sm max-w-lg">
            Plain-English PDF covering plans, hospitals, claims, and visas — written by a licensed
            Allianz Ayudhya advisor.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/guide"
            className="inline-block bg-white text-teal-700 font-semibold px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
          >
            Download Free Guide →
          </Link>
        </div>
      </div>
    </section>
  )
}
