"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react"
import { PLANS, annualPremium, thb, type Gender } from "@/lib/quickRates"

const WA = "66611965363"

export default function QuickRate({ compact = false }: { compact?: boolean }) {
  const [product, setProduct] = useState<"mdc" | "fc">("mdc")
  const tiers = PLANS.filter((p) => p.product === product)
  const [planId, setPlanId] = useState("mdc15")
  const [age, setAge] = useState(35)
  const [gender, setGender] = useState<Gender>("m")

  const plan = PLANS.find((p) => p.id === planId) ?? tiers[0]
  const activePlan = plan.product === product ? plan : tiers[Math.min(1, tiers.length - 1)]
  const premium = annualPremium(activePlan.id, age, gender)

  const wa =
    `https://wa.me/${WA}?text=` +
    encodeURIComponent(
      `Hi! I'd like a real quote for ${activePlan.productName} ${activePlan.tier} ` +
      `(${activePlan.coverageLabel.replace(" / year", "/yr")}, ${activePlan.network}) — ` +
      `age ${age}, ${gender === "m" ? "male" : "female"}.` +
      (premium ? ` Indicative annual premium I saw: ${thb(premium)}.` : "")
    )

  function switchProduct(p: "mdc" | "fc") {
    setProduct(p)
    setPlanId(p === "mdc" ? "mdc15" : "fc80")
  }

  const pill = (active: boolean): React.CSSProperties =>
    active
      ? { background: "var(--sky-500)", color: "#fff", boxShadow: "var(--glow-sky-soft)" }
      : { background: "var(--ink-100)", color: "var(--ink-700)" }

  return (
    <div
      className="rounded-[28px] p-6 flex flex-col gap-5"
      style={{
        background: "var(--glass-bg-strong)",
        backdropFilter: "var(--blur-lg)",
        WebkitBackdropFilter: "var(--blur-lg)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow-lg)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-800">
          <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--sky-100)", color: "var(--sky-600)" }}>
            <ShieldCheck size={13} strokeWidth={2.5} />
          </span>
          Real Quick Rate
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500"><span className="dot-live" /> Annual price</span>
      </div>

      {/* Product toggle */}
      <div className="flex gap-1.5">
        <button onClick={() => switchProduct("mdc")} className="flex-1 text-xs px-3 py-2 rounded-full font-semibold transition-all border-0 cursor-pointer" style={pill(product === "mdc")}>My Double Care</button>
        <button onClick={() => switchProduct("fc")} className="flex-1 text-xs px-3 py-2 rounded-full font-semibold transition-all border-0 cursor-pointer" style={pill(product === "fc")}>First Class Ultra</button>
      </div>

      {/* Tier pills */}
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Coverage / year</span>
        <div className="flex flex-wrap gap-1.5">
          {tiers.map((t) => (
            <button key={t.id} onClick={() => setPlanId(t.id)} className="text-xs px-3 py-1.5 rounded-full font-medium transition-all border-0 cursor-pointer" style={pill(activePlan.id === t.id)}>
              {t.coverageLabel.replace(" / year", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Gender + Age */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Gender</span>
          <div className="flex gap-1.5">
            <button onClick={() => setGender("m")} className="text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer" style={pill(gender === "m")}>Male</button>
            <button onClick={() => setGender("f")} className="text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer" style={pill(gender === "f")}>Female</button>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-baseline">
            <span className="eyebrow">Age</span>
            <span className="text-lg font-bold text-navy-700" style={{ fontFamily: "var(--font-geist-mono)" }}>{age}</span>
          </div>
          <input type="range" min={11} max={70} value={age} onChange={(e) => setAge(+e.target.value)} className="slider" style={{ "--fill": `${((age - 11) / (70 - 11)) * 100}%` } as React.CSSProperties} />
        </div>
      </div>

      {/* Premium */}
      <div className="rounded-2xl p-4 flex flex-col gap-1" style={{ background: "var(--navy-50, rgba(0,0,0,0.03))", border: "1px solid var(--glass-border)" }}>
        <span className="eyebrow" style={{ color: "var(--ink-400)", fontSize: 10 }}>EST. ANNUAL PREMIUM · {activePlan.network}</span>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-navy-800" style={{ fontFamily: "var(--font-jakarta)", letterSpacing: "-0.03em" }}>{premium ? thb(premium) : "—"}</span>
          <span className="text-sm text-ink-500 mb-1">/ year</span>
        </div>
        <span className="text-xs text-ink-500">{activePlan.productName} · {activePlan.tier} · {activePlan.coverageLabel}</span>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(160deg, #2EDF74, #25D366)" }}>
          <MessageCircle size={15} strokeWidth={2.5} /> Get my real quote on WhatsApp
        </a>
        {!compact && (
          <Link href="/#contact" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold text-navy-800 transition-all hover:opacity-90" style={{ background: "var(--ink-100)" }}>
            Or request a callback <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        )}
      </div>
      <p className="text-xs" style={{ color: "var(--ink-400)", lineHeight: 1.5 }}>
        Indicative annual premium for a standard healthy applicant (new business, age 11–70). Final premium is confirmed after underwriting. We do not bill monthly — full annual premium only.
      </p>
    </div>
  )
}
