"use client"

import { useState, useMemo } from "react"
import {
  MapPin, HeartPulse, Baby, Activity, Stethoscope,
  Star, MessageCircle, Zap, Bone, Leaf, Users,
  Award, ChevronRight, Phone
} from "lucide-react"
import { hospitals } from "@/lib/hospitals-data"
import type { Hospital } from "@/lib/hospitals-data"

// ─── Need categories ──────────────────────────────────────────────────────────
const NEEDS = [
  { id: "emergency",    label: "Emergency / Accident",  specialty: "Emergency",    Icon: Zap },
  { id: "cardiology",   label: "Heart / Cardiology",    specialty: "Cardiology",   Icon: HeartPulse },
  { id: "maternity",    label: "Maternity / Birth",     specialty: "Maternity",    Icon: Baby },
  { id: "orthopedics",  label: "Bone / Joint / Ortho",  specialty: "Orthopedics",  Icon: Bone },
  { id: "cancer",       label: "Cancer / Oncology",     specialty: "Oncology",     Icon: Activity },
  { id: "fertility",    label: "Fertility / IVF",       specialty: "Fertility",    Icon: Leaf },
  { id: "pediatrics",   label: "Children / Pediatrics", specialty: "Pediatrics",   Icon: Users },
  { id: "general",      label: "General / OPD Visit",   specialty: null,           Icon: Stethoscope },
] as const

// ─── Province → nearest Premier province fallback ────────────────────────────
const PROVINCE_REGION: Record<string, string[]> = {
  // Central / Bangkok metro
  "Nonthaburi":         ["Bangkok"],
  "Pathum Thani":       ["Bangkok"],
  "Samut Prakan":       ["Bangkok"],
  "Samut Sakhon":       ["Bangkok"],
  "Nakhon Pathom":      ["Bangkok"],
  "Samut Songkhram":    ["Bangkok"],
  "Ang Thong":          ["Bangkok"],
  "Sing Buri":          ["Bangkok"],
  "Lopburi":            ["Bangkok"],
  "Saraburi":           ["Bangkok"],
  "Ayutthaya":          ["Bangkok"],
  "Suphan Buri":        ["Bangkok"],
  "Nakhon Nayok":       ["Bangkok"],
  "Chachoengsao":       ["Bangkok"],
  "Kanchanaburi":       ["Bangkok"],
  "Ratchaburi":         ["Bangkok"],
  "Phetchaburi":        ["Prachuap Khiri Khan", "Bangkok"],
  // East
  "Chonburi":           ["Chonburi"],
  "Rayong":             ["Rayong", "Chonburi"],
  "Chanthaburi":        ["Rayong", "Chonburi"],
  "Trat":               ["Rayong", "Chonburi"],
  "Sa Kaeo":            ["Bangkok"],
  // North
  "Chiang Mai":         ["Chiang Mai"],
  "Chiang Rai":         ["Chiang Rai", "Chiang Mai"],
  "Lampang":            ["Chiang Mai"],
  "Lamphun":            ["Chiang Mai"],
  "Phrae":              ["Chiang Mai"],
  "Nan":                ["Chiang Mai"],
  "Phayao":             ["Chiang Rai", "Chiang Mai"],
  "Mae Hong Son":       ["Chiang Mai"],
  "Uttaradit":          ["Chiang Mai"],
  "Phitsanulok":        ["Phitsanulok", "Chiang Mai"],
  "Tak":                ["Chiang Mai"],
  "Kamphaeng Phet":     ["Phitsanulok"],
  "Sukhothai":          ["Phitsanulok"],
  "Phichit":            ["Phitsanulok"],
  "Phetchabun":         ["Phitsanulok"],
  "Nakhon Sawan":       ["Bangkok", "Phitsanulok"],
  "Uthai Thani":        ["Bangkok"],
  "Chai Nat":           ["Bangkok"],
  // Northeast (Isaan)
  "Khon Kaen":          ["Khon Kaen"],
  "Udon Thani":         ["Udon Thani", "Khon Kaen"],
  "Nakhon Ratchasima":  ["Nakhon Ratchasima"],
  "Ubon Ratchathani":   ["Khon Kaen"],
  "Maha Sarakham":      ["Khon Kaen"],
  "Roi Et":             ["Khon Kaen"],
  "Kalasin":            ["Khon Kaen"],
  "Sakon Nakhon":       ["Udon Thani", "Khon Kaen"],
  "Nakhon Phanom":      ["Udon Thani"],
  "Mukdahan":           ["Udon Thani"],
  "Loei":               ["Udon Thani", "Khon Kaen"],
  "Nong Bua Lamphu":    ["Udon Thani"],
  "Nong Khai":          ["Udon Thani"],
  "Bueng Kan":          ["Udon Thani"],
  "Si Sa Ket":          ["Ubon Ratchathani", "Khon Kaen"],
  "Surin":              ["Nakhon Ratchasima", "Khon Kaen"],
  "Buri Ram":           ["Nakhon Ratchasima", "Khon Kaen"],
  "Yasothon":           ["Ubon Ratchathani"],
  "Amnat Charoen":      ["Ubon Ratchathani"],
  "Chaiyaphum":         ["Nakhon Ratchasima", "Khon Kaen"],
  // Hua Hin / South-West
  "Prachuap Khiri Khan": ["Prachuap Khiri Khan"],
  // Phuket / Andaman
  "Phuket":             ["Phuket"],
  "Krabi":              ["Krabi", "Phuket"],
  "Phang Nga":          ["Phuket"],
  "Ranong":             ["Phuket", "Surat Thani"],
  "Trang":              ["Songkhla", "Phuket"],
  "Satun":              ["Songkhla"],
  // South / Gulf
  "Surat Thani":        ["Surat Thani"],
  "Nakhon Si Thammarat": ["Songkhla", "Surat Thani"],
  "Chumphon":           ["Surat Thani"],
  "Songkhla":           ["Songkhla"],
  "Pattani":            ["Songkhla"],
  "Yala":               ["Songkhla"],
  "Narathiwat":         ["Songkhla"],
  "Phatthalung":        ["Songkhla"],
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function scoreHospital(h: Hospital, specialty: string | null): number {
  const specialtyBonus = specialty && h.specialties.includes(specialty) ? 5 : 0
  const overall = h.overallScore ?? 0
  const intl = h.internationalServices ?? 0
  return overall * 3 + intl * 2 + specialtyBonus * 10
}

// ─── WhatsApp link ────────────────────────────────────────────────────────────
function whatsappLink(hospital: string, province: string, need: string): string {
  const text = encodeURIComponent(
    `Hi! I'm in ${province} and need ${need} care. Can you recommend ${hospital}? I'd like to know more about coverage options.`
  )
  return `https://wa.me/66611965363?text=${text}`
}

// ─── Hospital result card ─────────────────────────────────────────────────────
function ResultCard({
  h,
  selectedProvince,
  selectedNeedLabel,
  rank,
}: {
  h: Hospital
  selectedProvince: string
  selectedNeedLabel: string
  rank: number
}) {
  const isJCI = h.accreditation.includes("JCI")
  const rankColors = ["bg-amber-400", "bg-slate-300", "bg-orange-300"]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all p-5">
      {/* Rank + badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${rankColors[rank] ?? "bg-slate-400"}`}>
            {rank + 1}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-navy-700 border border-sky-100">
            Premier
          </span>
          {isJCI && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              <Award className="w-3 h-3" /> JCI
            </span>
          )}
        </div>
        {h.overallScore && (
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${
              h.overallScore >= 9 ? "bg-navy-700 text-white" :
              h.overallScore >= 8 ? "bg-navy-600 text-white" :
              "bg-sky-100 text-navy-800"
            }`}>
              {h.overallScore}/10
            </span>
          </div>
        )}
      </div>

      {/* Name + location */}
      <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{h.name}</h3>
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{h.city ?? h.province}</span>
        {h.googleRating && (
          <>
            <span className="text-slate-300">·</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-700">{h.googleRating.toFixed(1)}</span>
            {h.googleReviews && (
              <span className="text-slate-400">({h.googleReviews.toLocaleString()})</span>
            )}
          </>
        )}
      </div>

      {/* Score bars */}
      {h.medicalQuality && h.internationalServices && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 text-xs">
          {[
            { label: "Medical Quality", val: h.medicalQuality },
            { label: "Intl Services", val: h.internationalServices },
            { label: "Facilities", val: h.facilities },
            { label: "English Staff", val: h.englishStaff },
          ].map(({ label, val }) => val ? (
            <div key={label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-700">{val}/10</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${val * 10}%` }}
                />
              </div>
            </div>
          ) : null)}
        </div>
      )}

      {/* Specialties */}
      {h.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {h.specialties.slice(0, 5).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {h.summary && (
        <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-2">{h.summary}</p>
      )}

      {/* CTAs */}
      <div className="flex gap-2">
        <a
          href={whatsappLink(h.name, selectedProvince, selectedNeedLabel)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask our team
        </a>
        {h.mapsUrl && (
          <a
            href={h.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:border-sky-200 text-slate-600 hover:text-navy-700 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4" />
          </a>
        )}
        {h.phone && (
          <a
            href={`tel:${h.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:border-sky-200 text-slate-600 hover:text-navy-700 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HospitalRecommender() {
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedNeed, setSelectedNeed] = useState<string>("")

  // All provinces, sorted
  const allProvinces = useMemo(
    () => [...new Set(hospitals.map((h) => h.province))].sort(),
    []
  )

  const premierHospitals = useMemo(
    () => hospitals.filter((h) => h.tier === "Premier"),
    []
  )

  const selectedNeedObj = NEEDS.find((n) => n.id === selectedNeed)

  // Find results: Premier hospitals in province (or fallback provinces)
  const results = useMemo(() => {
    if (!selectedProvince) return []

    const specialty = selectedNeedObj?.specialty ?? null

    // Provinces to search — own first, then fallbacks
    const searchProvinces = [
      selectedProvince,
      ...(PROVINCE_REGION[selectedProvince] ?? []),
    ]

    let found: Hospital[] = []
    for (const prov of searchProvinces) {
      const inProv = premierHospitals.filter((h) => h.province === prov)
      inProv.forEach((h) => {
        if (!found.find((f) => f.id === h.id)) found.push(h)
      })
      if (found.length >= 2) break
    }

    // If still < 2, take top-rated Bangkok hospitals as universal fallback
    if (found.length < 2) {
      const bkk = premierHospitals
        .filter((h) => h.province === "Bangkok" && !found.find((f) => f.id === h.id))
        .sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0))
        .slice(0, 3 - found.length)
      found = [...found, ...bkk]
    }

    // Score and rank
    return found
      .map((h) => ({ h, score: scoreHospital(h, specialty) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.h)
  }, [selectedProvince, selectedNeedObj, premierHospitals])

  const showResults = selectedProvince && selectedNeed

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-sky-50/30">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 text-sm font-medium text-navy-700 mb-4">
            <HeartPulse className="w-4 h-4" />
            Find Your Best Hospital
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Which hospital is right for you?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Select your location and what you need — we&apos;ll show you the top Premier-tier hospitals nearby, ranked for expats.
          </p>
        </div>

        {/* Step 1 — Province */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-navy-700 text-white flex items-center justify-center text-sm font-bold">1</div>
            <span className="font-semibold text-slate-800">Where are you in Thailand?</span>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
            >
              <option value="">Select your province…</option>
              {allProvinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
          </div>
        </div>

        {/* Step 2 — Need */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-navy-700 text-white flex items-center justify-center text-sm font-bold">2</div>
            <span className="font-semibold text-slate-800">What do you need?</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {NEEDS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedNeed(id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedNeed === id
                    ? "border-sky-600 bg-sky-50 text-navy-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-sky-200 hover:bg-sky-50/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${selectedNeed === id ? "text-sky-600" : "text-slate-400"}`} />
                <span className="text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">
                {results.length > 0
                  ? `Top ${results.length} recommended hospital${results.length > 1 ? "s" : ""}`
                  : "No matches found"}
                {selectedProvince && (
                  <span className="font-normal text-slate-500 text-sm ml-2">
                    near {selectedProvince}
                  </span>
                )}
              </h3>
              {results.length > 0 && (
                <span className="text-xs text-slate-400">Ranked by quality + specialty match</span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((h, i) => (
                <ResultCard
                  key={h.id}
                  h={h}
                  rank={i}
                  selectedProvince={selectedProvince}
                  selectedNeedLabel={selectedNeedObj?.label ?? "healthcare"}
                />
              ))}
            </div>

            {/* Fallback note */}
            {selectedProvince && !hospitals.some((h) => h.tier === "Premier" && h.province === selectedProvince) && (
              <p className="text-xs text-slate-400 text-center mt-4">
                No Premier hospitals in {selectedProvince} — showing nearest high-quality options. Our team can arrange direct billing at any of these.
              </p>
            )}
          </div>
        )}

        {/* Idle state */}
        {!showResults && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Select your province and need above to see recommendations.
          </div>
        )}
      </div>
    </section>
  )
}
