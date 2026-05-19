"use client"

import { useState, useMemo } from "react"
import {
  Search,
  MapPin,
  Star,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react"
import { hospitals } from "@/lib/hospitals-data"
import type { Hospital } from "@/lib/hospitals-data"

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function matchesQuery(h: Hospital, q: string): boolean {
  if (!q) return false
  return (
    normalize(h.name).includes(q) ||
    normalize(h.nameTh ?? "").includes(q) ||
    normalize(h.province).includes(q) ||
    normalize(h.city ?? "").includes(q)
  )
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ResultRow({ h }: { h: Hospital }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors group">
      {/* tier dot */}
      <span
        className={`flex-shrink-0 w-2 h-2 rounded-full ${
          h.tier === "Premier" ? "bg-sky-500" : "bg-slate-300"
        }`}
      />

      {/* name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {h.name}
          </span>
          {h.tier === "Premier" && (
            <span className="flex-shrink-0 text-[10px] font-semibold bg-sky-50 text-navy-700 border border-sky-100 px-1.5 py-0.5 rounded-full leading-none">
              Premier
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {h.nameTh && (
            <span className="text-xs text-slate-400">{h.nameTh}</span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {h.city || h.province}
          </span>
          {h.googleRating != null && (
            <span className="text-xs text-amber-600 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {h.googleRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* badges + map link */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-navy-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 leading-none">
          <ShieldCheck className="w-3 h-3" />
          Direct billing
        </span>
        {h.mapsUrl && (
          <a
            href={h.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            className="text-slate-300 hover:text-sky-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function CoverageChecker() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return []
    return hospitals.filter((h) => matchesQuery(h, q)).slice(0, 10)
  }, [query])

  const hasQuery = query.trim().length > 0
  const noResults = hasQuery && results.length === 0

  const waUrl = `https://wa.me/66611965363?text=${encodeURIComponent(
    `Hi Tonkla! Is "${query.trim()}" covered under the Allianz Ayudhya Life network?`
  )}`

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-100">
      <div className="max-w-2xl mx-auto px-4">
        {/* heading */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 text-navy-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Coverage checker
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Is my hospital covered?
          </h2>
          <p className="text-sm text-slate-500">
            Search all {hospitals.length} Allianz Ayudhya Life in-network hospitals
          </p>
        </div>

        {/* input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Type a hospital name, city, or province…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 text-base border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
          />
          {hasQuery && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* results */}
        {hasQuery && (
          <div className="mt-2 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            {results.length > 0 ? (
              <>
                {results.map((h) => (
                  <ResultRow key={`${h.name}-${h.province}`} h={h} />
                ))}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
                  All listed hospitals offer direct billing — you pay nothing upfront
                </div>
              </>
            ) : (
              /* not found */
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  &ldquo;{query}&rdquo; not found
                </p>
                <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
                  This hospital may not be in-network, or the name may be spelled
                  differently. Ask Tonkla to check — takes 2 minutes.
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  Ask Tonkla on WhatsApp
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* idle hint */}
        {!hasQuery && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Thai names supported — e.g. type &ldquo;สมิติเวช&rdquo; or &ldquo;Samitivej&rdquo;
          </p>
        )}
      </div>
    </section>
  )
}
