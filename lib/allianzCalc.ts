// Faithful TypeScript port of the Allianz rate engine (allianz-api/src/calc.js).
// Computes premiums identically to the official QuickRate tool, from the real
// rate tables in ./data/allianzRates.json. Verified against the golden
// expected/*.json cases. Do not hand-edit numbers here — they come from the data.
import RATES from "./data/allianzRates.json"

type AnyRow = { band: string; [k: string]: unknown }

type RateEntry = {
  type?: string
  rows?: unknown
  plans?: unknown[]
  [k: string]: unknown
}

const D = RATES as unknown as Record<string, RateEntry>

// Occupation-class loading: classes 1–2 = ×1.0, class 3 ×1.30, class 4 ×1.45.
// occ_class: 0=class1, 1=class2, 2=class3, 3=class4. Default (standard) = class 1.
const OCC_LOAD: Record<string, true> = {
  HSMHPDC: true, "HSMFCPN@BDMS": true, "HSMFCPN@ALL": true,
  "HSMFCBN@BDMS": true, "HSMFCBN@ALL": true,
  OPDMFCPN_BDMS: true, OPDMFCPN_ALL: true, OPDMDC: true,
}

export function parseBandAge(s: string): { min: number; max: number } {
  s = s.replace(/\*/g, "").trim()
  if (/^1m1d|^1วัน|^1ปี/i.test(s)) {
    const m = s.match(/-\s*(\d+)/)
    return { min: 0, max: m ? parseInt(m[1]) : 999 }
  }
  const p = s.split(/\s*[-–]\s*/)
  const min = parseInt(p[0]) || 0
  return { min, max: p.length > 1 ? parseInt(p[1]) || min : min }
}

function findBand(rows: AnyRow[], age: number): AnyRow | null {
  return rows.find((r) => {
    const { min, max } = parseBandAge(r.band)
    return age >= min && age <= max
  }) || null
}

// For per1000_mf tables: rows is a dict keyed by age string ("1m1d" for age 0).
function getAgeKey(obj: Record<string, [number, number]>, age: number): [number, number] | null {
  if (age === 0 && obj["1m1d"] !== undefined) return obj["1m1d"]
  if (obj[String(age)] !== undefined) return obj[String(age)]
  if (obj[String(age) + "*"] !== undefined) return obj[String(age) + "*"]
  return null
}

export interface Cfg {
  hsmhpdc_ded?: string
  hsmhpdc_plan?: string
  opd_plan?: number // OPDMDC per-visit cap (e.g. 1000)
  occ_class?: number // 0=class1 (default)…3=class4
  sa?: number // sum insured, for per1000_mf mains (e.g. MWLA9920)
}

export function calcPrem(prod: string, age: number, gender: "m" | "f", cfg: Cfg = {}): number | null {
  const data = D[prod]
  if (!data) return null
  const t = data.type
  const rows = data.rows as AnyRow[]
  let prem: number | null = null

  if (t === "hsmhpdc") {
    const r = findBand(rows, age)
    if (r) {
      const key = (cfg.hsmhpdc_ded || "n") + (cfg.hsmhpdc_plan || "1") + gender
      const v = r[key]
      prem = typeof v === "number" ? v : null
    }
  } else if (t === "hsmfc") {
    const r = findBand(rows, age)
    if (r) {
      const v = gender === "m" ? r.m : r.f
      prem = typeof v === "number" ? v : null
    }
  } else if (t === "opd_plan") {
    const r = findBand(rows, age)
    if (r && data.plans) {
      const arr = (gender === "m" ? r.m : r.f) as (number | null)[] | undefined
      const pi = data.plans.indexOf(cfg.opd_plan ?? data.plans[0])
      const v = pi >= 0 && arr ? arr[pi] : null
      prem = typeof v === "number" ? v : null
    }
  } else if (t === "opd_mf") {
    const r = findBand(rows, age)
    if (r) {
      const v = gender === "m" ? r.m : r.f
      const u = r.u
      prem = typeof v === "number" ? v : typeof u === "number" ? u : null
    }
  } else if (t === "per1000_mf") {
    const r = getAgeKey(data.rows as Record<string, [number, number]>, age)
    if (r && cfg.sa) {
      const rate = gender === "m" ? r[0] : r[1]
      if (typeof rate === "number") prem = (rate * cfg.sa) / 1000
    }
  }

  if (prem == null) return null
  const occ = cfg.occ_class || 0
  if (OCC_LOAD[prod] && occ === 2) prem = Math.round(prem * 1.3)
  else if (OCC_LOAD[prod] && occ === 3) prem = Math.round(prem * 1.45)
  return prem
}

// Per-visit caps available for My Double Care OPD (฿/visit)
export const OPD_MDC_CAPS: number[] = (D["OPDMDC"].plans as number[]) || [400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000]

// Lowest-cost required main contract (Whole Life A99/20) that allows a health rider:
// SA = smallest 100k multiple ≥ 200,000 whose annual premium ≥ 6,000.
export function mainContractMin(age: number, gender: "m" | "f"): { sa: number; premium: number } | null {
  for (let sa = 200000; sa <= 5000000; sa += 100000) {
    const p = calcPrem("MWLA9920", age, gender, { sa })
    if (p != null && p >= 6000) return { sa, premium: Math.round(p) }
  }
  return null
}
