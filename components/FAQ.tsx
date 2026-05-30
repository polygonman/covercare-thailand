"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Do I need a work permit to get health insurance in Thailand?",
    a: "No. Allianz Ayudhya plans are available to foreigners on most visa types — retirement, LTR, tourist, and work visas. In most cases no work permit is needed. If you're planning to stay long-term, a proper long-stay visa opens up the best plan options. Visitors can also get short-term insurance. Tell me your situation and I'll find the right fit.",
  },
  {
    q: "Can I use my insurance at any hospital?",
    a: "Yes, for emergency reimbursement. For direct billing (cashless treatment), our team will help you find the nearest in-network hospital — Allianz covers 226+ hospitals across Thailand.",
  },
  {
    q: "How does the claims process work?",
    a: "For most OPD and IPD treatments at in-network hospitals, we use fax claim / direct billing — Allianz pays the hospital directly and you pay nothing out of pocket. If reimbursement is needed, our team helps you gather documents and submit correctly. Most claims are settled within 3–7 days.",
  },
  {
    q: "Are pre-existing conditions covered?",
    a: "Coverage depends on the plan and your medical history. I'll walk you through the medical disclosure process and find plans with the best terms for your situation — honestly.",
  },
  {
    q: "What's the difference between IPD and OPD coverage?",
    a: "IPD (In-patient department) covers hospitalisation. OPD (Out-patient department) covers doctor visits and outpatient treatment. I'll explain which combination makes sense for your lifestyle.",
  },
  {
    q: "How much does expat health insurance cost in Thailand?",
    a: "Basic plans start from around 15,000 THB/year. Comprehensive plans with OPD range from 40,000–100,000+ THB/year depending on age and coverage level. I'll give you an exact quote for your situation.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-14">
          <span className="eyebrow">/ FAQ</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
            Everything before you commit.
          </h2>
          <p className="text-lg" style={{ color: "var(--ink-600)" }}>
            Every question you should ask before getting covered.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="rounded-[22px] overflow-hidden transition-all duration-200"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--blur-md)",
                WebkitBackdropFilter: "var(--blur-md)",
                border: `1px solid ${open === i ? "var(--sky-200)" : "var(--glass-border)"}`,
                boxShadow: open === i ? "var(--glass-shadow-lg)" : "var(--glass-shadow)",
              }}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-navy-900 cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                style={{ background: "transparent", border: "none" }}
              >
                <span className="flex items-start gap-3 pr-4">
                  <span
                    className="text-xs font-medium flex-shrink-0 mt-0.5 pt-0.5"
                    style={{ fontFamily: "var(--font-geist-mono)", color: "var(--sky-500)", minWidth: 24 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-snug">{q}</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  style={{ color: "var(--sky-500)" }}
                />
              </button>
              {open === i && (
                <div
                  className="px-6 pb-5 text-sm leading-relaxed"
                  style={{
                    color: "var(--ink-600)",
                    borderTop: "1px solid var(--glass-border)",
                    paddingTop: 16,
                    marginLeft: 24,
                  }}
                >
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
