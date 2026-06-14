import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { PLAN_CONTENT } from "@/lib/planContent"
import { annualPremium, mainContract, thb } from "@/lib/quickRates"
import { ArrowRight, FileDown, MessageCircle, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "The Best Allianz Health Plans for Foreigners in Thailand — Plans & Rates | CoverCare",
  description:
    "Our four best Allianz Ayudhya health plans for expats: My Double Care ฿8M (budget), ฿15M (overall), and My First Class Ultra ฿80M & ฿100M. Real all-in annual rates, brochures and full details.",
  alternates: { canonical: "https://www.thaicovercare.com/plans" },
}

const wa = (t: string) => `https://wa.me/66611965363?text=${encodeURIComponent(t)}`

function refPrice(engineId: string): number {
  const ipd = annualPremium(engineId, 35, "m") ?? 0
  const m = mainContract(35, "m")
  return ipd + (m?.premium ?? 0)
}

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-36 pb-12">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ Plans &amp; rates</span>
            <h1 className="text-4xl md:text-5xl font-black mt-3 mb-5 leading-[1.05]" style={{ color: "var(--navy-950)", letterSpacing: "-0.04em" }}>
              The plans we&apos;d <span className="gradient-text">actually recommend.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--ink-600)" }}>
              Out of the full Allianz Ayudhya range, these are the four we put foreigners in most often — one for every priority. Real all-in annual rates. We never bill monthly.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {PLAN_CONTENT.map((p) => (
                <div key={p.slug} className="rounded-3xl overflow-hidden flex flex-col" style={{ border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
                  {/* Promo header */}
                  <Link href={`/plans/${p.slug}`} className="relative block" style={{ aspectRatio: "16 / 7", backgroundImage: `${p.accent}, url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="self-start text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.92)", color: "var(--navy-800)" }}>{p.tagline}</span>
                      <div>
                        <div className="text-2xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>{p.shortName}</div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{p.coverageLabel} · {p.network}</div>
                      </div>
                    </div>
                  </Link>
                  {/* Body */}
                  <div className="p-6 flex flex-col gap-4 flex-1" style={{ background: "var(--glass-bg)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{p.positioning}</p>
                    <div>
                      <div className="text-xs text-ink-400">All-in from, e.g. age 35 male</div>
                      <div className="text-xl font-bold text-navy-800">{thb(refPrice(p.engineId))} <span className="text-sm font-medium text-ink-500">/ year</span></div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <Link href={`/plans/${p.slug}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--sky-500)" }}>
                        See full details <ArrowRight size={14} strokeWidth={2.5} />
                      </Link>
                      <div className="flex gap-2">
                        <a href={p.brochure} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--navy-700)", background: "var(--ink-100)" }}>
                          <FileDown size={13} /> Brochure
                        </a>
                        <a href={wa(`Hi! I'm interested in ${p.name}. Could you send a real quote?`)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
                          <MessageCircle size={13} /> Quote
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Not sure */}
            <div className="mt-10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-5" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <h2 className="text-2xl font-black mb-1" style={{ color: "#fff", letterSpacing: "-0.02em" }}>Not sure which fits you?</h2>
                <p className="text-sm" style={{ color: "var(--navy-300)" }}>Tell us your age and what matters most — we&apos;ll recommend the right plan and send a real, all-in quote. No pressure.</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: "var(--navy-200)" }}>
                  {["Real all-in annual rates", "Honest advice", "~8-min WhatsApp reply"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5"><Check size={14} style={{ color: "var(--sky-300)" }} /> {t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href={wa("Hi! Help me pick the right health plan — here's my age and what matters to me:")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
                  <MessageCircle size={16} strokeWidth={2.5} /> WhatsApp us
                </a>
                <Link href="/#contact" className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
                  Contact form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
