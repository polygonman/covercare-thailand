// Marketing content for the 4 headline plans (detail pages + sales cards).
// Numbers/limits are factual; premiums are computed live from the rate engine.
export interface PlanContent {
  slug: string
  engineId: string // matches PLANS[].id in quickRates.ts
  name: string
  shortName: string
  tagline: string
  positioning: string
  bestFor: string
  benefits: string[]
  considerations: string[]
  planBetter: string[]
  coverageLabel: string
  network: string
  image: string
  brochure: string
  accent: string // overlay gradient for the card/hero
}

export const PLAN_CONTENT: PlanContent[] = [
  {
    slug: "my-double-care-8m",
    engineId: "mdc8",
    name: "My Double Care ฿8M",
    shortName: "Double Care ฿8M",
    tagline: "Best for budget",
    positioning:
      "Solid, as-charged hospital protection at our most accessible price — with a built-in safety net that doubles your annual limit if a major critical illness ever strikes.",
    bestFor:
      "Ideal for expats who want dependable in-patient coverage without paying for the very top tier. A great fit if you're cost-conscious but still want real protection against a serious, expensive diagnosis.",
    benefits: [
      "฿8M annual limit that automatically doubles to ฿16M on first diagnosis of one of 10 major critical illnesses",
      "As-charged in-patient care: room & board, ICU, surgery, specialists, cancer treatment and dialysis",
      "Use any hospital in Thailand — you're not locked to a single network",
      "Direct billing at 226+ hospitals, so you can often avoid paying upfront",
      "Open to new applicants aged 11–70, renewable to high ages",
      "Optional OPD add-on for everyday doctor visits",
    ],
    considerations: [
      "Requires the main My Whole Life A99/20 (with dividend) contract at the minimum coverage for your age — this whole-life policy also builds some cash value over time",
      "OPD (out-patient) cover is an optional add-on, not included by default",
      "Focused on in-patient care; everyday clinic visits are covered only if you add OPD",
      "Lower annual limit than the higher tiers — generous for most needs, but compare if you expect very high-cost international treatment",
    ],
    planBetter: [
      "Add the OPD rider if you see doctors regularly — pick a per-visit limit that matches your habits",
      "Apply while you're younger to lock in a lower age band on your premium",
      "Choose this tier for strong, sensible cover at a friendlier price when you don't need ฿80M+ limits",
      "Ask about deductible options to bring the premium down further",
    ],
    coverageLabel: "฿8M / year",
    network: "All hospitals",
    image: "/plan-images/double-care.jpg",
    brochure: "/brochures/my-double-care.pdf",
    accent: "linear-gradient(120deg, rgba(2,132,122,0.82), rgba(8,47,73,0.88))",
  },
  {
    slug: "my-double-care-15m",
    engineId: "mdc15",
    name: "My Double Care ฿15M",
    shortName: "Double Care ฿15M",
    tagline: "Best overall · long-term",
    positioning:
      "Our popular middle tier — generous as-charged coverage and a doubling safety net, balanced for people who want long-term peace of mind without going to the very top.",
    bestFor:
      "Well-suited to expats who plan to stay in Thailand for years and want room-to-grow coverage. The sweet spot for anyone who finds the entry tier a little tight but doesn't need flagship limits.",
    benefits: [
      "฿15M annual limit that automatically doubles to ฿30M on first diagnosis of a major critical illness",
      "As-charged in-patient care: room & board, ICU, surgery, specialists, cancer and dialysis",
      "Use any hospital in Thailand — full freedom to choose where you're treated",
      "Direct billing at 226+ hospitals to skip large upfront payments",
      "Available for new applicants aged 11–70, renewable to high ages",
      "Optional OPD add-on for everyday out-patient visits",
    ],
    considerations: [
      "Requires the main My Whole Life A99/20 (with dividend) contract at the minimum coverage for your age — which also builds some cash value over time",
      "OPD (out-patient) cover is an optional add-on rather than standard",
      "Premiums sit above the entry tier, reflecting the higher annual limit",
      "For very high-cost or international treatment, the First Class Ultra tiers offer larger limits worth weighing up",
    ],
    planBetter: [
      "Pick this tier for a long-term home-base plan — it's the popular middle ground for a reason",
      "Add OPD if clinic visits are a regular part of your life",
      "Buy younger to secure a lower age band before premiums step up",
      "Explore deductible options to trim the premium while keeping the higher limit",
    ],
    coverageLabel: "฿15M / year",
    network: "All hospitals",
    image: "/plan-images/double-care.jpg",
    brochure: "/brochures/my-double-care.pdf",
    accent: "linear-gradient(120deg, rgba(0,66,128,0.82), rgba(8,30,66,0.9))",
  },
  {
    slug: "first-class-ultra-80m",
    engineId: "fc80",
    name: "My First Class Ultra — Platinum ฿80M",
    shortName: "First Class Ultra ฿80M",
    tagline: "Top tier · best OPD & coverage",
    positioning:
      "Premium, near-comprehensive protection with a very high annual limit, a private room and international coverage options — top-class care with minimal restrictions.",
    bestFor:
      "Designed for expats who want the reassurance of high limits and a private room, and who may travel or seek treatment internationally. A strong choice if comprehensive, worry-light coverage matters more than price.",
    benefits: [
      "฿80M annual limit for substantial protection against major medical costs",
      "As-charged in-patient care with very high or no sub-limits on core treatment",
      "Private room as standard for greater comfort during a stay",
      "Use any hospital in Thailand, with international coverage options available",
      "Direct billing at 226+ hospitals for smoother, cashless admissions",
      "Open to new applicants aged 11–70 and renewable to high ages",
    ],
    considerations: [
      "Requires the main My Whole Life A99/20 (with dividend) contract at the minimum coverage for your age — which also builds some cash value over time",
      "Premiums are higher than the Double Care tiers, reflecting the broader, higher-limit coverage",
      "OPD (out-patient) cover, where offered, is arranged as an add-on to tailor the plan",
      "More coverage than many people strictly need — best matched to those who value high limits and international options",
    ],
    planBetter: [
      "Add OPD if you see doctors often, so everyday care matches your strong in-patient cover",
      "Choose this tier if you travel or want international treatment options on the table",
      "Apply while younger to lock in a lower age band on a premium plan",
      "Ask about deductible options to help manage the premium on this higher tier",
    ],
    coverageLabel: "฿80M / year",
    network: "All hospitals · Platinum",
    image: "/plan-images/first-class.jpg",
    brochure: "/brochures/first-class-ultra-all.pdf",
    accent: "linear-gradient(120deg, rgba(120,86,20,0.78), rgba(10,22,46,0.92))",
  },
  {
    slug: "first-class-ultra-100m",
    engineId: "fc100",
    name: "My First Class Ultra — Beyond Platinum ฿100M",
    shortName: "First Class Ultra ฿100M",
    tagline: "Best of the best · flagship",
    positioning:
      "Our flagship plan — the highest annual limit we offer, a private room and dental cover added on top, for those who want our most complete protection.",
    bestFor:
      "Best for expats who want the most comprehensive coverage available and the comfort of knowing little is left out — including dental. A natural fit if you prefer maximum protection.",
    benefits: [
      "฿100M annual limit — the highest in our range",
      "As-charged in-patient care: room & board, ICU, surgery, specialists, cancer and dialysis",
      "Private room as standard for your hospital stays",
      "Dental cover included, adding everyday value beyond hospital care",
      "Use any hospital in Thailand, with direct billing at 226+ hospitals",
      "Available for new applicants aged 11–70 and renewable to high ages",
    ],
    considerations: [
      "Requires the main My Whole Life A99/20 (with dividend) contract at the minimum coverage for your age — which also builds some cash value over time",
      "As the flagship, this is our highest-premium plan, reflecting the top limits and added dental cover",
      "OPD (out-patient) cover, where offered, is arranged as an add-on to suit your needs",
      "The most comprehensive option we offer — more than many people need, best for those who specifically want the highest tier",
    ],
    planBetter: [
      "Choose this for the most complete protection in one plan, including dental",
      "Add OPD if frequent clinic visits are part of your routine",
      "Buy younger to secure a lower age band before stepping into the flagship tier",
      "Ask about deductible options to balance the top-tier premium",
    ],
    coverageLabel: "฿100M / year",
    network: "All hospitals · Beyond Platinum",
    image: "/plan-images/first-class.jpg",
    brochure: "/brochures/first-class-ultra-all.pdf",
    accent: "linear-gradient(120deg, rgba(67,40,120,0.8), rgba(8,16,40,0.92))",
  },
]

export const planBySlug = (slug: string) => PLAN_CONTENT.find((p) => p.slug === slug)
