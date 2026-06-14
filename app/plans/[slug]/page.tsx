import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import RateTable from "@/components/RateTable"
import { PLAN_CONTENT, planBySlug } from "@/lib/planContent"
import { Check, AlertCircle, Lightbulb, FileDown, MessageCircle, Phone, Mail, ArrowLeft } from "lucide-react"

const wa = (t: string) => `https://wa.me/66611965363?text=${encodeURIComponent(t)}`

export function generateStaticParams() {
  return PLAN_CONTENT.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = planBySlug(slug)
  if (!p) return { title: "Plan not found | CoverCare Thailand" }
  return {
    title: `${p.name} — Benefits, Rates & Details | CoverCare Thailand`,
    description: `${p.positioning} Real all-in annual rates by age, brochure and how to plan better.`,
    alternates: { canonical: `https://www.thaicovercare.com/plans/${p.slug}` },
  }
}

export default async function PlanDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = planBySlug(slug)
  if (!p) notFound()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-28">
          <div className="relative" style={{ aspectRatio: "21 / 8", minHeight: 320, backgroundImage: `${p.accent}, url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0">
              <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-10">
                <Link href="/plans" className="inline-flex items-center gap-1.5 text-sm mb-4 self-start" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <ArrowLeft size={15} /> All plans
                </Link>
                <span className="self-start text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3" style={{ background: "rgba(255,255,255,0.92)", color: "var(--navy-800)" }}>{p.tagline}</span>
                <h1 className="text-3xl md:text-5xl font-black text-white max-w-3xl" style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}>{p.name}</h1>
                <p className="text-base md:text-lg mt-3 max-w-2xl" style={{ color: "rgba(255,255,255,0.9)" }}>{p.positioning}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="py-6">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-wrap gap-3">
            <a href={wa(`Hi! I'd like a real quote for ${p.name}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
              <MessageCircle size={16} strokeWidth={2.5} /> Get my real quote
            </a>
            <a href={p.brochure} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--navy-700)", background: "var(--ink-100)" }}>
              <FileDown size={15} /> Download brochure (PDF)
            </a>
          </div>
        </section>

        {/* Best for */}
        <section className="pb-4">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="rounded-2xl p-6" style={{ background: "var(--sky-50)", border: "1px solid var(--sky-100)" }}>
              <span className="eyebrow" style={{ color: "var(--sky-700)" }}>Who it&apos;s best for</span>
              <p className="text-base mt-2" style={{ color: "var(--navy-800)" }}>{p.bestFor}</p>
            </div>
          </div>
        </section>

        {/* Benefits / considerations / plan better */}
        <section className="py-8">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
            <Col icon={<Check size={18} />} color="var(--sky-700)" bg="var(--sky-50)" title="Benefits" items={p.benefits} />
            <Col icon={<AlertCircle size={18} />} color="#b07a00" bg="rgba(255,176,32,0.08)" title="Things to know" items={p.considerations} />
            <Col icon={<Lightbulb size={18} />} color="var(--navy-700)" bg="var(--navy-50, rgba(0,30,77,0.04))" title="How to plan better" items={p.planBetter} />
          </div>
        </section>

        {/* Rate table */}
        <section className="py-8">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>Real rates by age</h2>
            <p className="text-sm mb-5" style={{ color: "var(--ink-600)" }}>Indicative all-in annual premium (this plan + the minimum required main contract). Your exact figure depends on health declaration and options.</p>
            <RateTable engineId={p.engineId} />
          </div>
        </section>

        {/* Contact — feeling it's a lot? */}
        <section className="py-12">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl p-8" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "#fff", letterSpacing: "-0.02em" }}>A lot to take in? Just ask us.</h2>
              <p className="text-sm mb-6 max-w-2xl" style={{ color: "var(--navy-300)" }}>You don&apos;t have to decide alone. Tell us about you and we&apos;ll walk you through whether {p.shortName} is the right fit — on whichever channel you prefer.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Channel href={wa(`Hi! I have questions about ${p.name}.`)} icon={<MessageCircle size={17} />} label="WhatsApp" sub="~8-min reply" />
                <Channel href="https://line.me/ti/p/~@covercareTH" icon={<Phone size={17} />} label="LINE" sub="@covercareTH" />
                <Channel href="mailto:covercareTH@gmail.com" icon={<Mail size={17} />} label="Email" sub="covercareTH@gmail.com" />
                <Channel href="/#contact" icon={<ArrowLeft size={17} style={{ transform: "rotate(-90deg)" }} />} label="Contact form" sub="Book a call" />
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

function Col({ icon, color, bg, title, items }: { icon: React.ReactNode; color: string; bg: string; title: string; items: string[] }) {
  return (
    <div className="rounded-3xl p-6" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>{icon}</span>
        <h3 className="font-bold text-navy-900">{title}</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm" style={{ color: "var(--ink-600)" }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} /> {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Channel({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  const ext = href.startsWith("http")
  return (
    <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)", color: "var(--sky-300)" }}>{icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs truncate" style={{ color: "var(--navy-300)" }}>{sub}</div>
      </div>
    </a>
  )
}
