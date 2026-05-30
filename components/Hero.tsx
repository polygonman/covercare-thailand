"use client"

import { useState } from "react"
import Link from "next/link"
import { Award, Building2, Clock, ArrowRight, MessageCircle, Zap, Check } from "lucide-react"

const tiers = ["Basic IPD", "IPD + OPD", "Comprehensive", "Executive"]
const tierBases = [15000, 42800, 68000, 98000]

function HeroCalc() {
  const [age, setAge] = useState(32)
  const [cover, setCover] = useState(60)
  const [tier, setTier] = useState(1)

  const annual = Math.round(tierBases[tier] + (age - 30) * 600 + (cover - 60) * 280)
  const monthly = Math.round(annual / 12)

  return (
    <div
      className="rounded-[32px] p-6 flex flex-col gap-5"
      style={{
        background: "var(--glass-bg-strong)",
        backdropFilter: "var(--blur-lg)",
        WebkitBackdropFilter: "var(--blur-lg)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow-lg)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-800">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--sky-100)", color: "var(--sky-600)" }}
          >
            <Zap size={13} strokeWidth={2.5} />
          </span>
          Quick Quote
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <span className="dot-live" />
          Live
        </span>
      </div>

      {/* Age */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-ink-600">Age</span>
          <span className="text-lg font-bold text-navy-700" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {age}
          </span>
        </div>
        <input
          type="range" min={22} max={75} value={age}
          onChange={(e) => setAge(+e.target.value)}
          className="slider"
          style={{ "--fill": `${((age - 22) / (75 - 22)) * 100}%` } as React.CSSProperties}
        />
      </div>

      {/* Coverage */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-ink-600">Coverage level</span>
          <span className="text-lg font-bold text-navy-700" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {cover}%
          </span>
        </div>
        <input
          type="range" min={40} max={100} value={cover}
          onChange={(e) => setCover(+e.target.value)}
          className="slider"
          style={{ "--fill": `${((cover - 40) / (100 - 40)) * 100}%` } as React.CSSProperties}
        />
      </div>

      {/* Tier pills */}
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Plan tier</span>
        <div className="flex flex-wrap gap-1.5">
          {tiers.map((t, i) => (
            <button
              key={t}
              onClick={() => setTier(i)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 cursor-pointer border-0"
              style={
                tier === i
                  ? { background: "var(--sky-500)", color: "#fff", boxShadow: "var(--glow-sky-soft)" }
                  : { background: "var(--ink-100)", color: "var(--ink-700)" }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quote block */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", color: "#fff" }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-navy-300">Annual premium</span>
          <span className="text-2xl font-black" style={{ fontFamily: "var(--font-jakarta)", letterSpacing: "-0.04em" }}>
            ฿{annual.toLocaleString()}
            <span className="text-base font-medium ml-1 text-navy-300">/yr</span>
          </span>
          <span className="text-xs text-navy-400">~ ฿{monthly.toLocaleString()} / month</span>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ background: "var(--success-soft)", color: "var(--success)" }}
        >
          <Check size={11} strokeWidth={3} /> Best fit
        </span>
      </div>

      {/* CTA */}
      <Link
        href="/#contact"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
        style={{ background: "linear-gradient(135deg, var(--navy-700), var(--navy-800))", boxShadow: "var(--glow-navy)" }}
      >
        Continue to plan <ArrowRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  )
}

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
                href="/#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
                style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}
              >
                Talk to our team <ArrowRight size={14} strokeWidth={2.5} />
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

          {/* Right: calculator */}
          <HeroCalc />
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
