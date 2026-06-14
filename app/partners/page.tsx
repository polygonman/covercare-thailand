import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { Handshake, TrendingUp, HeartHandshake, Workflow, Stamp, Calculator, Home, Briefcase, MessageCircle, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Partner With Us — Earn by Referring Health Insurance | CoverCare Thailand",
  description:
    "Visa agencies, bookkeepers, relocation and other expat-facing businesses: partner with CoverCare Thailand. Your clients need health insurance — refer them, we handle everything, and you earn ongoing income.",
  alternates: { canonical: "https://www.thaicovercare.com/partners" },
}

const wa = (t: string) => `https://wa.me/66611965363?text=${encodeURIComponent(t)}`

const who = [
  { icon: Stamp, label: "Visa & immigration services" },
  { icon: Calculator, label: "Bookkeeping & accounting firms" },
  { icon: Home, label: "Relocation & property agents" },
  { icon: Briefcase, label: "Legal, HR & business-setup services" },
]

const why = [
  { icon: TrendingUp, title: "Ongoing referral income", desc: "Earn a share when your referrals take out a policy — and as they renew year after year. A real, recurring revenue stream alongside your core business." },
  { icon: HeartHandshake, title: "Your clients are looked after", desc: "Every foreigner you work with needs health cover. Hand them to a team that treats them well — it makes you look good and keeps your clients loyal." },
  { icon: Workflow, title: "Zero extra workload", desc: "You make a warm intro; we do the quoting, paperwork, claims and ongoing support. No insurance licence or training needed on your side." },
]

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-14 overflow-hidden">
          <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest" style={{ background: "var(--navy-100)", color: "var(--navy-700)", border: "1px solid var(--navy-200)" }}>
              <Handshake size={12} /> Partner programme
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-[1.05]" style={{ color: "var(--navy-950)", letterSpacing: "-0.04em" }}>
              Your clients need health cover.<br /><span className="gradient-text">Let&apos;s earn together.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--ink-600)" }}>
              If you serve foreigners in Thailand — visas, bookkeeping, relocation, anything — your clients all face the same question: &ldquo;what about health insurance?&rdquo; Partner with us, send them our way, and earn while we take great care of them.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-7">
              <a href={wa("Hi! I run a business serving foreigners in Thailand and I'd like to explore partnering with you.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
                <MessageCircle size={16} strokeWidth={2.5} /> Talk on WhatsApp
              </a>
              <Link href="/#contact" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-navy-800" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                Send an enquiry
              </Link>
            </div>
          </div>
        </section>

        {/* Who */}
        <section className="py-10">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl md:text-3xl font-black mb-8" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>Great partners include</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {who.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl p-6 flex flex-col items-center text-center gap-3" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--sky-50)", border: "1px solid var(--sky-100)", color: "var(--sky-700)" }}><Icon size={22} /></div>
                  <span className="text-sm font-semibold text-navy-800">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4" style={{ color: "var(--ink-500)" }}>Not on the list? If you work with foreigners in Thailand, let&apos;s talk anyway.</p>
          </div>
        </section>

        {/* Why */}
        <section className="py-12">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {why.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-3xl p-7 flex flex-col gap-4" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}><Icon size={22} /></div>
                  <h3 className="font-bold text-navy-900 text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works + CTA */}
        <section className="py-12">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl p-8 md:p-10" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-2xl md:text-3xl font-black mb-6 text-center" style={{ color: "#fff", letterSpacing: "-0.02em" }}>How it works</h2>
              <div className="grid sm:grid-cols-3 gap-5 mb-8">
                {[
                  { n: "1", t: "We agree the terms", d: "A quick chat on how referrals and rewards work for your business." },
                  { n: "2", t: "You introduce clients", d: "A name and a hello — by message, a shared link, or a warm intro." },
                  { n: "3", t: "You earn, they're cared for", d: "We quote, enrol, and support them; you earn on the policy and renewals." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col gap-2">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--sky-500)", color: "#fff" }}>{s.n}</span>
                    <span className="font-bold text-white">{s.t}</span>
                    <span className="text-sm" style={{ color: "var(--navy-300)" }}>{s.d}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center items-center">
                <div className="flex flex-wrap gap-4 text-xs mr-2" style={{ color: "var(--navy-200)" }}>
                  {["No licence needed", "No upfront cost", "We handle the insurance"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5"><Check size={14} style={{ color: "var(--sky-300)" }} /> {t}</span>
                  ))}
                </div>
                <a href={wa("Hi! I'd like to become a referral partner. Here's what my business does:")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
                  <MessageCircle size={16} strokeWidth={2.5} /> Become a partner
                </a>
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
