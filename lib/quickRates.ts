// Plan catalogue + helpers. All premiums come from the ported Allianz engine
// (allianzCalc.ts) reading the real rate tables — identical to the QuickRate tool.
// ANNUAL premium only. OPD is priced by per-visit cap for My Double Care.
import { calcPrem, OPD_MDC_CAPS, mainContractMin, type Cfg } from "./allianzCalc"

export type Gender = "m" | "f"
export { OPD_MDC_CAPS }

// Required main contract (Whole Life A99/20) at the lowest qualifying coverage for this age.
export function mainContract(age: number, gender: Gender): { sa: number; premium: number } | null {
  return mainContractMin(age, gender)
}

export interface Plan {
  id: string
  product: "mdc" | "fc"
  productName: string
  tier: string
  coverage: number
  coverageLabel: string
  network: string
  badge?: string
  blurb: string
  prod: string          // rate-engine product key
  cfg: Cfg              // engine config for IPD
  opdProd: string       // OPD product key for this plan
}

export const PLANS: Plan[] = [
  { id:"mdc8",  product:"mdc", productName:"My Double Care", tier:"Plan 1", coverage:8_000_000,  coverageLabel:"฿8M / year",  network:"All hospitals", blurb:"Entry into comprehensive cover — doubles to ฿16M on first critical illness.", prod:"HSMHPDC", cfg:{ hsmhpdc_plan:"1" }, opdProd:"OPDMDC" },
  { id:"mdc15", product:"mdc", productName:"My Double Care", tier:"Plan 2", coverage:15_000_000, coverageLabel:"฿15M / year", network:"All hospitals", badge:"Best seller", blurb:"The popular middle tier — doubles to ฿30M on first critical illness.", prod:"HSMHPDC", cfg:{ hsmhpdc_plan:"2" }, opdProd:"OPDMDC" },
  { id:"mdc30", product:"mdc", productName:"My Double Care", tier:"Plan 3", coverage:30_000_000, coverageLabel:"฿30M / year", network:"All hospitals", blurb:"Top Double Care tier — doubles to ฿60M on first critical illness.", prod:"HSMHPDC", cfg:{ hsmhpdc_plan:"3" }, opdProd:"OPDMDC" },
  { id:"fc60",  product:"fc", productName:"My First Class Ultra", tier:"Platinum", coverage:60_000_000,  coverageLabel:"฿60M / year",  network:"BDMS network", blurb:"Premium cover across the BDMS hospital group (Bangkok, Samitivej, BNH…).", prod:"HSMFCPN@BDMS", cfg:{}, opdProd:"OPDMFCPN_BDMS" },
  { id:"fc80",  product:"fc", productName:"My First Class Ultra", tier:"Platinum", coverage:80_000_000,  coverageLabel:"฿80M / year",  network:"All hospitals", blurb:"Platinum cover usable at any hospital in Thailand.", prod:"HSMFCPN@ALL", cfg:{}, opdProd:"OPDMFCPN_ALL" },
  { id:"fc100", product:"fc", productName:"My First Class Ultra", tier:"Beyond Platinum", coverage:100_000_000, coverageLabel:"฿100M / year", network:"All hospitals", badge:"Flagship", blurb:"Beyond Platinum — ฿100M a year, any hospital, plus dental.", prod:"HSMFCBN@ALL", cfg:{}, opdProd:"OPDMFCPN_ALL" },
  { id:"fc120", product:"fc", productName:"My First Class Ultra", tier:"Beyond Platinum", coverage:120_000_000, coverageLabel:"฿120M / year", network:"BDMS network", blurb:"Highest tier — ฿120M a year across the BDMS network.", prod:"HSMFCBN@BDMS", cfg:{}, opdProd:"OPDMFCPN_BDMS" },
]

export function annualPremium(planId: string, age: number, gender: Gender): number | null {
  const p = PLANS.find((x) => x.id === planId)
  if (!p) return null
  return calcPrem(p.prod, age, gender, p.cfg)
}

// OPD annual premium. Double Care = per-visit cap (opd_plan). First Class = flat (opd_mf).
export function opdPremium(plan: Plan, age: number, gender: Gender, cap?: number): number | null {
  if (plan.product === "mdc") return calcPrem("OPDMDC", age, gender, { opd_plan: cap ?? 1000 })
  return calcPrem(plan.opdProd, age, gender, {})
}

export const BROCHURES: Record<string, string> = {
  mdc8: "/brochures/my-double-care.pdf", mdc15: "/brochures/my-double-care.pdf", mdc30: "/brochures/my-double-care.pdf",
  fc60: "/brochures/first-class-ultra-bdms.pdf", fc80: "/brochures/first-class-ultra-all.pdf",
  fc100: "/brochures/first-class-ultra-all.pdf", fc120: "/brochures/first-class-ultra-bdms.pdf",
}

export const BENEFITS: Record<"mdc" | "fc", string[]> = {
  mdc: [
    "As-charged in-patient care at any hospital in Thailand",
    "Annual limit doubles on first critical illness (e.g. ฿15M → ฿30M)",
    "Room & board, ICU, surgery and specialist fees",
    "Cancer treatment and kidney dialysis covered",
    "Direct billing — pay nothing upfront",
  ],
  fc: [
    "Ultra-high annual limit — ฿60M to ฿120M",
    "As-charged in-patient, any hospital or the BDMS network",
    "Private room, no sub-limits on core treatment",
    "Dental cover on Beyond Platinum tiers",
    "Dedicated claims support and direct billing",
  ],
}

export const RIDERS = ["Critical Illness", "Hospital Cash", "Personal Accident", "Dental", "Premium Waiver"]

export const thb = (n: number) => "฿" + n.toLocaleString("en-US")
