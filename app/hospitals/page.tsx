import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import HospitalDirectory from "@/components/HospitalDirectory"
import { hospitals, provinces } from "@/lib/hospitals-data"
import { MapPin, Building2, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Allianz Ayudhya Hospital Network in Thailand — 226 Hospitals",
  description:
    "Find any of the 226 hospitals in the Allianz Ayudhya Life network across Thailand. Covers Bangkok, Chiang Mai, Phuket, Pattaya, and 57 provinces. Direct billing at all locations.",
  openGraph: {
    title: "Allianz Ayudhya Hospital Network — 226 Hospitals Across Thailand",
    description:
      "Browse every in-network hospital for your health insurance. Premier and Standard tiers with ratings, specialties, and Google Maps links.",
    url: "https://www.thaicovercare.com/hospitals",
  },
  alternates: { canonical: "https://www.thaicovercare.com/hospitals" },
}

const premierCount = hospitals.filter((h) => h.tier === "Premier").length
const standardCount = hospitals.filter((h) => h.tier === "Standard").length
const provinceCount = provinces.length

const stats = [
  { icon: Building2, value: `${hospitals.length}+`, label: "In-network hospitals" },
  { icon: MapPin, value: `${provinceCount}`, label: "Provinces covered" },
  { icon: Globe, value: `${premierCount}`, label: "Premier hospitals researched" },
]

export default function HospitalsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
              Allianz Ayudhya Life Network — Updated January 2024
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {hospitals.length}+ Hospitals Across Thailand
            </h1>
            <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-10">
              Every hospital in the Allianz Ayudhya Life insurance network — from Bangkok&apos;s
              international hospitals to provincial clinics. Direct billing at all locations means
              you pay nothing upfront.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-5 h-5 text-teal-300" />
                    <span className="text-3xl font-bold">{value}</span>
                  </div>
                  <span className="text-sm text-teal-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info bar */}
        <div className="bg-teal-50 border-b border-teal-100">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <p className="text-sm text-teal-800 text-center">
              <strong>Premier</strong> hospitals ({premierCount}) are fully researched with quality
              scores, specialties, and advisor recommendations. &nbsp;
              <strong>Standard</strong> hospitals ({standardCount}) include coordinates, Google
              ratings, and Maps links.
            </p>
          </div>
        </div>

        {/* Directory */}
        <HospitalDirectory hospitals={hospitals} provinces={provinces} />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
