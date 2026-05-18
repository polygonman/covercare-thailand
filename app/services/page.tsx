import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import Services from "@/components/Services"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Health Insurance Services & Plans for Foreigners in Thailand",
  description:
    "Allianz Ayudhya health insurance plans for foreigners in Thailand. Direct hospital billing, claims team with 5+ years experience, plan selection from 15,000 THB/year.",
  openGraph: {
    title: "Health Insurance Services & Plans for Foreigners in Thailand",
    description: "Allianz Ayudhya plans from 15,000 THB/year. Direct billing, experienced claims team, personal English-speaking support.",
    url: "https://www.thaicovercare.com/services",
  },
  alternates: { canonical: "https://www.thaicovercare.com/services" },
}

const plans = [
  {
    name: "Basic Inpatient",
    price: "From 15,000 THB/yr",
    desc: "Hospitalisation coverage for emergency and planned admissions at Allianz network hospitals.",
    features: ["Inpatient (IPD) coverage", "Emergency room", "Surgery & specialist", "50+ hospital network"],
    highlight: false,
  },
  {
    name: "Comprehensive",
    price: "From 40,000 THB/yr",
    desc: "Full inpatient + outpatient coverage for active expats who want broad protection.",
    features: ["IPD + OPD coverage", "Dental add-on available", "Maternity add-on available", "Worldwide emergency"],
    highlight: true,
  },
  {
    name: "Executive Plus",
    price: "From 80,000 THB/yr",
    desc: "Top-tier coverage with no sub-limits, private rooms, and international emergency evacuation.",
    features: ["Unlimited IP coverage", "Private room guaranteed", "International evacuation", "Cancer coverage"],
    highlight: false,
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Services & Plans</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              I find the right Allianz Ayudhya plan for your budget and situation — then stay with you when you need it.
            </p>
          </div>
        </section>

        <Services />

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Plan Overview</h2>
            <p className="text-center text-gray-500 mb-10">Illustrative pricing — I&apos;ll give you an exact quote based on your age and needs.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map(({ name, price, desc, features, highlight }) => (
                <div
                  key={name}
                  className={`rounded-2xl p-6 border-2 ${highlight ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-white"}`}
                >
                  {highlight && (
                    <span className="inline-block bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
                  <p className="text-teal-600 font-semibold mb-3">{price}</p>
                  <p className="text-sm text-gray-500 mb-4">{desc}</p>
                  <ul className="flex flex-col gap-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="#contact"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get My Personalised Quote
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
