"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Do I need a work permit to get health insurance in Thailand?",
    a: "No. Allianz Ayudhya plans are available to any foreigner legally residing in Thailand, including tourist visa holders, retirement visa holders, and digital nomads.",
  },
  {
    q: "Can I use my insurance at any hospital?",
    a: "Yes, for emergency reimbursement. For direct billing (cashless treatment), I'll help you find the nearest in-network hospital — Allianz covers 50+ major hospitals across Thailand.",
  },
  {
    q: "How does the claims process work?",
    a: "I help you at every step: submitting the claim, gathering documents, following up with Allianz, and ensuring payment is issued correctly. Most claims are settled within 7–14 days.",
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
    a: "Basic plans start from around 15,000 THB/year. Comprehensive plans with OPD range from 40,000–100,000+ THB/year. I'll find the best value for your budget.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Everything you need to know before getting covered.</p>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{q}</span>
                <ChevronDown
                  size={18}
                  className={`text-teal-600 transition-transform flex-shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
