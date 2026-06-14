"use client"

import Link from "next/link"
import { Award, Building2, Clock, ArrowRight, MessageCircle } from "lucide-react"
import QuickRate from "@/components/QuickRate"

const trustStats = [
  { icon: Award, label: "Allianz Ayudhya Authorised" },
  { icon: Building2, label: "226+ Hospital Network" },
  { icon: Clock, label: "Direct billing — pay nothing upfront" },
]

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="orbs" aria-hidden="true">
        <span className="orb a" />
        <span className="orb b" />
        <span className="orb c" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest"
              style={{ background: "var(--navy-100)", color: "var(--navy-700)", border: "1px solid var(--navy-200)" }}
            >
              <Award size={11} /> Allianz Ayudhya · Authorised
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-[1.05]" style={{ color: "var(--navy-950)", letterSpacing: "-0.04em" }}>
              Health insurance for<br />
              <span className="gradient-text">foreigners in Thailand.</span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--ink-600)" }}>
              We&apos;re a small team — claims specialist, hospital nurse, Allianz-authorised advisor — who&apos;ve worked alongside foreigners in Thailand for years.
              Plan picked, claims paid, no hold music.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/plans"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
                style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}
              >
                See plans &amp; rates <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi! I'm interested in health insurance for foreigners in Thailand.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-150 text-navy-800"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "var(--blur-md)",
                  WebkitBackdropFilter: "var(--blur-md)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--glass-shadow)",
                }}
              >
                <MessageCircle size={15} /> WhatsApp Now
              </a>
            </div>

            <div className="flex flex-wrap gap-5">
              {trustStats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Icon size={14} style={{ color: "var(--sky-500)", flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: real quick rate */}
          <QuickRate compact />
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-3 mt-10 justify-center md:justify-start">
          {["Live · reply in 8 min", "226+ hospitals covered", "5+ yr claims team"].map((label, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-ink-700"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--blur-md)",
                WebkitBackdropFilter: "var(--blur-md)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {i === 0 && <span className="dot-live" />}
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
