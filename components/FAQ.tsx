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
    a: "Yes, for emergency reimbursement. For direct billing (cashless treatment), I'll help you find the nearest in-network hospital — Allianz covers 50+ major hospitals across Thailand.",
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
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg">Everything you need to know before getting covered.</p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-teal-200 transition-colors">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{q}</span>
                <ChevronDown
                  size={18}
                  className={`text-teal-700 transition-transform flex-shrink-0 ml-4 duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
