import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

export default function GuideBanner() {
  return (
    <section
      className="py-14 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))" }}
    >
      {/* Subtle orb */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 400, height: 400, top: -100, right: -80, borderRadius: "999px",
          background: "radial-gradient(circle, rgba(0,164,228,0.25), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex items-start gap-5">
          <div
            className="hidden md:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--sky-300)" }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--sky-300)" }}>
              Free Resource
            </p>
            <h2 className="text-2xl font-black text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              The Expat&apos;s Complete Guide to Health Insurance in Thailand
            </h2>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--navy-200)" }}>
              Plain-English PDF covering plans, hospitals, claims, and visas — written by a licensed Allianz Ayudhya advisor.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-150 hover:opacity-90 whitespace-nowrap"
            style={{ background: "var(--sky-500)", color: "#fff", boxShadow: "var(--glow-sky-soft)" }}
          >
            <BookOpen size={15} />
            Download Free Guide
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
