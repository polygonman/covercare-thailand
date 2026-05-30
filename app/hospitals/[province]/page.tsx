import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import {
  hospitals,
  provinceToSlug,
  slugToProvince,
  hospitalsByProvince,
} from "@/lib/hospitals-data"
import type { Hospital } from "@/lib/hospitals-data"
import {
  MapPin, Star, Phone, ExternalLink, Award,
  Building2, ChevronRight, MessageCircle, ArrowLeft
} from "lucide-react"

const BASE = "https://www.thaicovercare.com"

// ─── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const provinces = [...new Set(hospitals.map((h) => h.province))]
  return provinces.map((p) => ({ province: provinceToSlug(p) }))
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>
}): Promise<Metadata> {
  const { province: slug } = await params
  const province = slugToProvince(slug)
  if (!province) return { title: "Not Found" }

  const hs = hospitalsByProvince(province)
  const premier = hs.filter((h) => h.tier === "Premier")

  const title = `Health Insurance Hospitals in ${province} — Allianz Ayudhya Network`
  const description = `Find all ${hs.length} Allianz Ayudhya Life in-network hospital${hs.length !== 1 ? "s" : ""} in ${province}${premier.length ? `, including ${premier.length} Premier-researched hospital${premier.length !== 1 ? "s" : ""}` : ""}. Direct billing — pay nothing upfront at any location.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE}/hospitals/${slug}`,
    },
    alternates: { canonical: `${BASE}/hospitals/${slug}` },
  }
}

// ─── JSON-LD ───────────────────────────────────────────────────────────────────
function ProvinceJsonLd({ province, hs }: { province: string; hs: Hospital[] }) {
  const items = hs
    .filter((h) => h.lat && h.lng)
    .slice(0, 20)
    .map((h) => ({
      "@type": "MedicalOrganization",
      name: h.name,
      ...(h.nameTh && { alternateName: h.nameTh }),
      address: {
        "@type": "PostalAddress",
        addressRegion: province,
        addressCountry: "TH",
      },
      ...(h.phone && { telephone: h.phone }),
      ...(h.website && { url: h.website }),
      ...(h.lat && h.lng && {
        geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng },
      }),
      ...(h.googleRating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: h.googleRating,
          reviewCount: h.googleReviews ?? 1,
          bestRating: 5,
        },
      }),
    }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Allianz Ayudhya Hospitals in ${province}`,
          description: `In-network hospitals for Allianz Ayudhya Life insurance in ${province}, Thailand`,
          numberOfItems: hs.length,
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item,
          })),
        }),
      }}
    />
  )
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number | null }) {
  if (!value) return null
  return (
    <div>
      <div className="flex justify-between mb-0.5 text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value}/10</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  )
}

// ─── Premier card ─────────────────────────────────────────────────────────────
function PremierCard({ h }: { h: Hospital }) {
  const isJCI = h.accreditation.includes("JCI")
  const waText = encodeURIComponent(
    `Hi! I'm interested in ${h.name} in ${h.province}. Can you tell me about coverage?`
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all p-5">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-navy-700 border border-sky-100">
          Premier
        </span>
        {isJCI && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <Award className="w-3 h-3" /> JCI
          </span>
        )}
        {h.costLevel && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
            {h.costLevel}
          </span>
        )}
        {h.overallScore && (
          <span className={`ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${
            h.overallScore >= 9 ? "bg-navy-700 text-white" :
            h.overallScore >= 8 ? "bg-navy-600 text-white" :
            "bg-sky-100 text-navy-800"
          }`}>
            {h.overallScore}/10
          </span>
        )}
      </div>

      <h3 className="font-bold text-slate-900 text-lg leading-snug mb-0.5">{h.name}</h3>
      {h.nameTh && <p className="text-sm text-slate-400 mb-2">{h.nameTh}</p>}

      <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
        {h.googleRating && (
          <span className="inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-700">{h.googleRating.toFixed(1)}</span>
            {h.googleReviews && <span className="text-slate-400">({h.googleReviews.toLocaleString()})</span>}
          </span>
        )}
        {h.networkGroup && <span className="text-slate-300">·</span>}
        {h.networkGroup && <span>{h.networkGroup}</span>}
      </div>

      {/* Score bars */}
      {h.medicalQuality && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
          <ScoreBar label="Medical Quality" value={h.medicalQuality} />
          <ScoreBar label="Intl Services" value={h.internationalServices} />
          <ScoreBar label="Facilities" value={h.facilities} />
          <ScoreBar label="English Staff" value={h.englishStaff} />
        </div>
      )}

      {/* Specialties */}
      {h.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {h.specialties.slice(0, 5).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {h.summary && (
        <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">{h.summary}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/66611965363?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask our team
        </a>
        {h.mapsUrl && (
          <a href={h.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 border border-slate-200 hover:border-sky-200 text-slate-500 hover:text-navy-700 rounded-xl transition-colors">
            <MapPin className="w-4 h-4" />
          </a>
        )}
        {h.website && (
          <a href={h.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 border border-slate-200 hover:border-sky-200 text-slate-500 hover:text-navy-700 rounded-xl transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Standard row ─────────────────────────────────────────────────────────────
function StandardRow({ h }: { h: Hospital }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm">{h.name}</p>
        {h.nameTh && <p className="text-xs text-slate-400">{h.nameTh}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {h.googleRating && (
          <span className="inline-flex items-center gap-0.5 text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-slate-600">{h.googleRating.toFixed(1)}</span>
          </span>
        )}
        {h.mapsUrl && (
          <a href={h.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-navy-700 hover:text-navy-800 font-medium">
            <MapPin className="w-3 h-3" /> Map
          </a>
        )}
        {h.phone && (
          <a href={`tel:${h.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
            <Phone className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProvincePage({
  params,
}: {
  params: Promise<{ province: string }>
}) {
  const { province: slug } = await params
  const province = slugToProvince(slug)
  if (!province) notFound()

  const hs = hospitalsByProvince(province)
  const premier = hs.filter((h) => h.tier === "Premier").sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0))
  const standard = hs.filter((h) => h.tier === "Standard").sort((a, b) => (b.googleRating ?? 0) - (a.googleRating ?? 0))

  // Related provinces (top 5 by Premier count, excluding current)
  const relatedProvinces = [...new Set(hospitals.map((h) => h.province))]
    .filter((p) => p !== province)
    .map((p) => ({
      name: p,
      slug: provinceToSlug(p),
      premier: hospitals.filter((h) => h.province === p && h.tier === "Premier").length,
      total: hospitals.filter((h) => h.province === p).length,
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.premier - a.premier || b.total - a.total)
    .slice(0, 6)

  const waText = encodeURIComponent(
    `Hi! I'm in ${province} and looking for health insurance. Can you help?`
  )

  return (
    <>
      <ProvinceJsonLd province={province} hs={hs} />
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-800 to-navy-950 text-white py-14">
          <div className="max-w-5xl mx-auto px-4">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-1 text-navy-300 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All hospitals
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-sky-300" />
              <span className="text-navy-300 text-sm font-medium uppercase tracking-wider">Thailand</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hospitals in {province}
            </h1>
            <p className="text-sky-100 text-lg mb-8 max-w-2xl">
              {hs.length} Allianz Ayudhya Life in-network hospital{hs.length !== 1 ? "s" : ""} in {province}.
              Direct billing at all locations — you pay nothing upfront.
            </p>
            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold">{hs.length}</div>
                <div className="text-navy-300 text-sm">Total in-network</div>
              </div>
              {premier.length > 0 && (
                <div>
                  <div className="text-3xl font-bold">{premier.length}</div>
                  <div className="text-navy-300 text-sm">Premier researched</div>
                </div>
              )}
              {premier.some(h => h.accreditation.includes("JCI")) && (
                <div>
                  <div className="text-3xl font-bold">{premier.filter(h => h.accreditation.includes("JCI")).length}</div>
                  <div className="text-navy-300 text-sm">JCI accredited</div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Premier hospitals */}
          {premier.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-5 h-5 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Premier Hospitals
                </h2>
                <span className="px-2.5 py-0.5 bg-sky-50 text-navy-700 text-sm font-semibold rounded-full">
                  {premier.length}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Fully researched — quality scores, specialties, English staff ratings, and advisor notes.
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                {premier.map((h) => <PremierCard key={h.id} h={h} />)}
              </div>
            </section>
          )}

          {/* Standard hospitals */}
          {standard.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-slate-400" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Standard Hospitals
                </h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
                  {standard.length}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                All in-network for Allianz Ayudhya direct billing. Sorted by Google rating.
              </p>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-2">
                {standard.map((h) => <StandardRow key={h.id} h={h} />)}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-8 text-white text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">
              Not sure which hospital is right for you?
            </h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              Our team can recommend the best hospital for your specific situation in {province} — and set up direct billing so you pay nothing upfront.
            </p>
            <a
              href={`https://wa.me/66611965363?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-navy-800 font-semibold py-3 px-6 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Ask our team on WhatsApp
            </a>
          </section>

          {/* Related provinces */}
          {relatedProvinces.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Other provinces</h2>
              <div className="flex flex-wrap gap-2">
                {relatedProvinces.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/hospitals/${p.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-sky-300 hover:text-navy-700 rounded-xl text-sm text-slate-600 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {p.name}
                    {p.premier > 0 && (
                      <span className="px-1.5 py-0.5 bg-sky-50 text-navy-700 text-xs rounded-full font-medium">
                        {p.premier} Premier
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
