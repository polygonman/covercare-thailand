import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { Headset, CreditCard, FileText, Stethoscope, Sparkles, Users, MessageCircle, Globe, Clock, ShieldCheck, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "What You Get as Our Client — Concierge, Cashless Claims & More | CoverCare Thailand",
  description:
    "Being our client means a 24/7 concierge, cashless direct-billing claims across Thailand, full document handling, doctor & hospital guidance, Allianz member events, and a team who has worked in the industry for years.",
  alternates: { canonical: "https://www.thaicovercare.com/services" },
}

const benefits = [
  { icon: Headset, title: "24/7 Concierge", desc: "A real person on call any time — medical questions, appointment booking, or an emergency at 3am. You're never navigating the Thai healthcare system alone." },
  { icon: CreditCard, title: "Cashless Claims Across Thailand", desc: "Direct billing at 226+ hospitals nationwide. Show your card, get treated, walk out — we settle with the hospital so you pay nothing upfront." },
  { icon: FileText, title: "Document Handling", desc: "Forms, receipts, medical reports, translations — we prepare and submit every claim document on your behalf. No paperwork headaches in a second language." },
  { icon: Stethoscope, title: "Doctor & Hospital Consulting", desc: "Not sure where to go or who to see? We help you choose the right hospital and specialist for your condition while you're here, not just at sign-up." },
  { icon: Sparkles, title: "Premium Allianz Events & Perks", desc: "Invitations to Allianz Ayudhya member activities, wellness events and partner perks — benefits beyond the policy itself." },
  { icon: Users, title: "A Team Who Knows You", desc: "A claims specialist, a hospital nurse and an authorised advisor — people who've worked inside this industry for years and treat you like a person, not a policy number." },
]

const promises = [
  { icon: MessageCircle, label: "~8-minute reply on WhatsApp" },
  { icon: Globe, label: "English-speaking, expat-focused" },
  { icon: Clock, label: "Support for as long as you're in Thailand" },
  { icon: ShieldCheck, label: "Honest advice — we win when you stay covered" },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ What you get as our client</span>
            <h1 className="text-4xl md:text-5xl font-black mt-3 mb-5 leading-[1.05]" style={{ color: "var(--navy-950)", letterSpacing: "-0.04em" }}>
              The policy is the start.<br /><span className="gradient-text">The service is the difference.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--ink-600)" }}>
              Anyone can sell you an Allianz Ayudhya plan. What you actually feel — every hospital visit, every claim, every late-night worry — is the service around it. Here&apos;s what being our client really means.
            </p>
          </div>
        </section>

        {/* Benefits grid */}
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-3xl p-7 flex flex-col gap-4" style={{ background: "var(--glass-bg)", backdropFilter: "var(--blur-md)", WebkitBackdropFilter: "var(--blur-md)", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--sky-50)", border: "1px solid var(--sky-100)", color: "var(--sky-700)" }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promise strip (dark, light text) */}
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl p-8 md:p-10" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 className="text-2xl md:text-3xl font-black mb-6 text-center" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
                What you can count on
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {promises.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--sky-300)" }}>
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#eaf1ff" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Company consulting (B2B) */}
        <section className="py-12">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}>
                <Building2 size={30} />
              </div>
              <div className="flex-1">
                <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ For companies</span>
                <h2 className="text-2xl md:text-3xl font-black mt-2 mb-2" style={{ color: "var(--navy-950)", letterSpacing: "-0.02em" }}>Company insurance planning &amp; consulting</h2>
                <p className="text-base" style={{ color: "var(--ink-600)" }}>Running a business in Thailand? We also advise companies on group health and employee-benefit planning at scale — not just individual policies. From a handful of staff to a full team, we design and manage the right Allianz Ayudhya setup for your people.</p>
              </div>
              <a href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi! I'd like to discuss company insurance planning for my business.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap flex-shrink-0 transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg,#2EDF74,#25D366)" }}>
                <MessageCircle size={16} strokeWidth={2.5} /> Talk to me directly
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
              Looking after foreigners in Thailand, <span className="gradient-text">end to end.</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--ink-600)" }}>
              See the plans and real rates, or message us and we&apos;ll handle the rest.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/plans" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}>
                See plans &amp; rates
              </a>
              <a href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi! I'd like to know more about your service and the right plan for me.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(160deg, #2EDF74, #25D366)" }}>
                <MessageCircle size={16} strokeWidth={2.5} /> Chat on WhatsApp
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
