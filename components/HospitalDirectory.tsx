"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, Star, Phone, ExternalLink, ChevronDown, Map as MapIcon, List } from "lucide-react"
import type { Hospital } from "@/lib/hospitals-data"

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-b-xl">
      <span className="text-slate-400 text-sm">Loading map…</span>
    </div>
  ),
})

interface Props {
  hospitals: Hospital[]
  provinces: string[]
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <span className="inline-flex items-center gap-0.5 text-sm">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-slate-700">{rating.toFixed(1)}</span>
    </span>
  )
}

function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const color =
    score >= 9 ? "bg-navy-700 text-white" :
    score >= 8 ? "bg-navy-600 text-white" :
    score >= 7 ? "bg-sky-100 text-navy-800" :
    "bg-slate-100 text-slate-600"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}/10
    </span>
  )
}

function PremierCard({ h }: { h: Hospital }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-navy-700 border border-sky-100">
              Premier
            </span>
            {h.hospitalType === "International" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                International
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug">{h.name}</h3>
          {h.nameTh && (
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{h.nameTh}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{h.city || h.province}, Thailand</span>
          </div>
        </div>
        <ScoreBadge score={h.overallScore} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-3">
        <StarRating rating={h.googleRating} />
        {h.googleReviews && (
          <span className="text-xs text-slate-400">({h.googleReviews.toLocaleString()} reviews)</span>
        )}
        {h.accreditation && h.accreditation.length > 0 && (
          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
            {h.accreditation.join(" · ")}
          </span>
        )}
      </div>

      {/* Specialties */}
      {h.specialties && h.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {h.specialties.slice(0, 5).map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 bg-sky-50 text-navy-700 rounded-full border border-sky-100"
            >
              {s}
            </span>
          ))}
          {h.specialties.length > 5 && (
            <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">
              +{h.specialties.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Summary */}
      {h.summary && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">{h.summary}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
        {h.phone && (
          <a
            href={`tel:${h.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {h.phone}
          </a>
        )}
        {h.mapsUrl && (
          <a
            href={h.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-navy-700 hover:text-navy-800 font-medium ml-auto"
          >
            <MapPin className="w-3.5 h-3.5" />
            View on Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

function StandardRow({ h }: { h: Hospital }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-3 -mx-3 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-800 truncate block">{h.name}</span>
        <span className="text-xs text-slate-400">
          {h.nameTh ? `${h.nameTh} · ` : ""}{h.province}
        </span>
      </div>
      <StarRating rating={h.googleRating} />
      {h.mapsUrl ? (
        <a
          href={h.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1 text-xs text-navy-700 hover:text-navy-800 font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Maps
        </a>
      ) : (
        h.phone && (
          <span className="flex-shrink-0 text-xs text-slate-400">{h.phone.split(",")[0].trim()}</span>
        )
      )}
    </div>
  )
}

export default function HospitalDirectory({ hospitals, provinces }: Props) {
  const [search, setSearch] = useState("")
  const [tier, setTier] = useState<"all" | "Premier" | "Standard">("all")
  const [province, setProvince] = useState("")
  const [view, setView] = useState<"list" | "map">("list")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return hospitals.filter((h) => {
      if (tier !== "all" && h.tier !== tier) return false
      if (province && h.province !== province) return false
      if (q) {
        const match =
          h.name.toLowerCase().includes(q) ||
          h.province.toLowerCase().includes(q) ||
          (h.city || "").toLowerCase().includes(q) ||
          h.provinceTh.includes(q)
        if (!match) return false
      }
      return true
    })
  }, [hospitals, search, tier, province])

  const premiers = filtered.filter((h) => h.tier === "Premier")
  const standards = filtered.filter((h) => h.tier === "Standard")

  const totalCount = hospitals.length
  const premierCount = hospitals.filter((h) => h.tier === "Premier").length
  const standardCount = hospitals.filter((h) => h.tier === "Standard").length

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospitals by name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-slate-50"
              />
            </div>

            {/* Tier tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-shrink-0">
              {(["all", "Premier", "Standard"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    tier === t
                      ? "bg-white text-navy-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t === "all"
                    ? `All (${totalCount})`
                    : t === "Premier"
                    ? `Premier (${premierCount})`
                    : `Standard (${standardCount})`}
                </button>
              ))}
            </div>

            {/* Province filter */}
            <div className="relative flex-shrink-0">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-slate-50 cursor-pointer min-w-[140px]"
              >
                <option value="">All Provinces</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-shrink-0">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-sm font-medium ${
                  view === "list" ? "bg-white text-navy-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setView("map")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-sm font-medium ${
                  view === "map" ? "bg-white text-navy-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="Map view"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="h-[70vh] min-h-[400px] border-b border-slate-100">
          <HospitalMap hospitals={filtered} selectedProvince={province || undefined} />
        </div>
      )}

      {/* List view */}
      {view === "list" && <div className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No hospitals match your search.</p>
            <button
              onClick={() => { setSearch(""); setProvince(""); setTier("all") }}
              className="mt-3 text-sm text-navy-700 hover:text-navy-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Premier section */}
            {premiers.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Premier Hospitals
                  </h2>
                  <span className="text-sm text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {premiers.length}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    — Fully researched · direct billing confirmed · English-speaking staff
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {premiers.map((h) => (
                    <PremierCard key={h.id} h={h} />
                  ))}
                </div>
              </section>
            )}

            {/* Standard section */}
            {standards.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Network Hospitals
                  </h2>
                  <span className="text-sm text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {standards.length}
                  </span>
                </div>
                {/* Group by province */}
                {province ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    {standards.map((h) => (
                      <StandardRow key={h.id || h.phone} h={h} />
                    ))}
                  </div>
                ) : (
                  <ProvinceGroupedStandard standards={standards} />
                )}
              </section>
            )}

            {/* Result count */}
            <p className="mt-6 text-xs text-slate-400 text-center">
              Showing {filtered.length} of {totalCount} hospitals in the Allianz Ayudhya Life network
            </p>
          </>
        )}
      </div>}
    </div>
  )
}

function ProvinceGroupedStandard({ standards }: { standards: Hospital[] }) {
  const grouped = useMemo(() => {
    const map: Record<string, Hospital[]> = {}
    for (const h of standards) {
      const p = h.province || "Other"
      if (!map[p]) map[p] = []
      map[p].push(h)
    }
    return Object.entries(map).sort(([a], [b]) => {
      // Bangkok first, then alphabetical
      if (a === "Bangkok") return -1
      if (b === "Bangkok") return 1
      return a.localeCompare(b)
    })
  }, [standards])

  return (
    <div className="space-y-4">
      {grouped.map(([prov, hospitals]) => (
        <div key={prov} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
            <MapPin className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-700">{prov}</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full ml-1">
              {hospitals.length}
            </span>
          </div>
          {hospitals.map((h) => (
            <StandardRow key={h.id || h.phone} h={h} />
          ))}
        </div>
      ))}
    </div>
  )
}
