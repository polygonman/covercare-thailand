// Real Allianz Ayudhya annual premiums (THB) — sourced from the team's rate tables
// (allianz-api/data/rates.json). My Double Care = HSMHPDC (8M/15M/30M).
// My First Class Ultra = HSMFC family (60M/80M/100M/120M). ANNUAL price only.
// Premiums vary by age band + gender. New-business age 11–70.

export type Gender = "m" | "f"

// Age bands (index 0..11), new business 11–70
export const BANDS = [
  "11–15", "16–20", "21–25", "26–30", "31–35", "36–40",
  "41–45", "46–50", "51–55", "56–60", "61–65", "66–70",
] as const

export function bandIndex(age: number): number {
  const a = Math.max(11, Math.min(70, Math.round(age)))
  return Math.min(11, Math.floor((a - 11) / 5))
}

export interface Plan {
  id: string
  product: "mdc" | "fc"
  productName: string
  tier: string
  coverage: number // annual sum insured THB
  coverageLabel: string
  network: string
  badge?: string
  blurb: string
}

// [maleAnnual, femaleAnnual] per age band (index 0..11)
type Table = readonly (readonly [number, number])[]

const RATES: Record<string, Table> = {
  // ---- My Double Care (HSMHPDC), no deductible ----
  mdc8: [[19992,18404],[18326,20245],[18326,22084],[18326,23006],[19992,25764],[21658,27605],[23323,31286],[29154,36807],[36650,40486],[50727,52172],[66635,64411],[91621,87416]],
  mdc15: [[29916,26576],[27424,29234],[27424,31892],[27424,33220],[29916,37207],[32409,39864],[34903,45178],[43629,53153],[54846,58467],[68684,68168],[99721,88365],[137116,126236]],
  mdc30: [[49937,43136],[45777,47449],[45777,51763],[45777,53917],[49937,60388],[54098,64700],[58258,73328],[72824,86267],[91548,94896],[120677,116462],[166452,150972],[228872,204887]],
  // ---- My First Class Ultra (HSMFC) ----
  fc60: [[37771,34782],[30619,29995],[30711,35531],[36004,44115],[38334,47456],[41344,50031],[42593,53383],[47046,58882],[59384,60453],[72519,71380],[104108,94181],[151241,132043]],
  fc80: [[41968,38646],[34021,33328],[34123,39479],[40004,49017],[42593,52729],[45938,55590],[47325,59314],[52273,65424],[65982,67170],[80577,79311],[115676,104646],[168045,146714]],
  fc100: [[97406,102453],[82618,103016],[81734,110653],[94933,131031],[102527,142285],[117412,153011],[129617,168975],[149087,189058],[178554,207414],[217162,247540],[278845,298587],[362011,365048]],
  fc120: [[113965,119870],[96662,120528],[95629,129464],[111072,153306],[119957,166474],[137371,179023],[151651,197701],[174432,221198],[208908,242674],[254080,289622],[326249,349346],[423553,427106]],
}

export const PLANS: Plan[] = [
  { id:"mdc8",  product:"mdc", productName:"My Double Care", tier:"Plan 1", coverage:8_000_000,  coverageLabel:"฿8M / year",  network:"All hospitals", blurb:"Entry into comprehensive cover — doubles to ฿16M on first critical illness." },
  { id:"mdc15", product:"mdc", productName:"My Double Care", tier:"Plan 2", coverage:15_000_000, coverageLabel:"฿15M / year", network:"All hospitals", badge:"Best seller", blurb:"The popular middle tier — doubles to ฿30M on first critical illness." },
  { id:"mdc30", product:"mdc", productName:"My Double Care", tier:"Plan 3", coverage:30_000_000, coverageLabel:"฿30M / year", network:"All hospitals", blurb:"Top Double Care tier — doubles to ฿60M on first critical illness." },
  { id:"fc60",  product:"fc", productName:"My First Class Ultra", tier:"Platinum", coverage:60_000_000,  coverageLabel:"฿60M / year",  network:"BDMS network", blurb:"Premium cover across the BDMS hospital group (Bangkok, Samitivej, BNH…)." },
  { id:"fc80",  product:"fc", productName:"My First Class Ultra", tier:"Platinum", coverage:80_000_000,  coverageLabel:"฿80M / year",  network:"All hospitals", blurb:"Platinum cover usable at any hospital in Thailand." },
  { id:"fc100", product:"fc", productName:"My First Class Ultra", tier:"Beyond Platinum", coverage:100_000_000, coverageLabel:"฿100M / year", network:"All hospitals", badge:"Flagship", blurb:"Beyond Platinum — ฿100M a year, any hospital, plus dental." },
  { id:"fc120", product:"fc", productName:"My First Class Ultra", tier:"Beyond Platinum", coverage:120_000_000, coverageLabel:"฿120M / year", network:"BDMS network", blurb:"Highest tier — ฿120M a year across the BDMS network." },
]

export function annualPremium(planId: string, age: number, gender: Gender): number | null {
  const t = RATES[planId]
  if (!t) return null
  const row = t[bandIndex(age)]
  if (!row) return null
  return gender === "m" ? row[0] : row[1]
}

export const thb = (n: number) => "฿" + n.toLocaleString("en-US")
