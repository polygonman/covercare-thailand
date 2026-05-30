import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { Shield, Heart, Globe, ClipboardCheck, Stethoscope, UserCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Meet the team — CoverCare Thailand",
  description:
    "A small specialist team — claims specialist, hospital nurse, and Allianz-authorised advisor — who've worked alongside foreigners in Thailand for years.",
  openGraph: {
    title: "Meet the team — CoverCare Thailand",
    description:
      "A small specialist team — claims specialist, hospital nurse, and Allianz-authorised advisor — for foreigners in Thailand.",
    url: "https://www.thaicovercare.com/about",
  },
  alternates: { canonical: "https://www.thaicovercare.com/about" },
}

type TeamMember = {
  role: string
  title: string
  bio: string
  icon: typeof ClipboardCheck
  initial: string
}

const team: TeamMember[] = [
  {
    role: "Claims & Hospital Coordination",
    title: "Claims Specialist",
    bio: "5+ years handling OPD and IPD claims across Thailand. Walks every client through hospital admission, direct billing, and claim settlement — start to finish.",
    icon: ClipboardCheck,
    initial: "C",
  },
  {
    role: "Bedside Coordination",
    title: "Hospital Nurse",
    bio: "Practicing nurse at Chulalongkorn Hospital. Bridges the gap between insurance paperwork and what actually happens at the bedside — translating, advocating, and easing the panic.",
    icon: Stethoscope,
    initial: "N",
  },
  {
    role: "Founder · Allianz-Authorised Advisor",
    title: "Tonkla",
    bio: "Spent years working inside startup teams alongside expats, nomads, and tech employees in Thailand. Saw firsthand what foreigners actually need when the hospital bill arrives at 2am — and built CoverCare for them. Authorised Allianz Ayudhya Life Insurance Advisor.",
    icon: UserCircle2,
    initial: "T",
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-sky-50 to-white">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 text-navy-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                Meet the team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                The team behind <span className="text-navy-700">every claim.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A small specialist team for foreigners in Thailand — we handle the whole journey, not just the signup.
              </p>
            </div>

            {/* Origin story */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why we built CoverCare</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                CoverCare Thailand started when we noticed how many foreigners — visitors, nomads, retirees,
                long-stay residents — were underinsured or confused about their options in Thailand. Some were
                paying premium prices for the wrong plan. Others were skipping coverage because the websites
                were in Thai and the call centres were unreachable.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Between us, we&apos;d spent years inside startup teams working alongside expats, years handling
                claims at hospitals across Thailand, and years inside the hospital system as practicing
                healthcare staff. We knew what worked. We also knew what didn&apos;t.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We built CoverCare for the foreigner we used to work next to. Plan picked. Claims paid. No hold music.
              </p>
            </div>

            {/* Team member cards */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">The team</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {team.map(({ role, title, bio, icon: Icon, initial }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-sky-100 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-navy-700 to-navy-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{initial}</span>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-sky-100 rounded-full flex items-center justify-center">
                        <Icon size={14} className="text-sky-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
                      <p className="text-xs text-sky-600 font-medium mt-0.5">{role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
                </div>
              ))}
            </div>

            {/* Credentials */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Why work with us</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Shield,
                  title: "Authorised Advisor",
                  desc: "Fully licenced and authorised by Allianz Ayudhya Life Insurance to sell and service policies across Thailand.",
                },
                {
                  icon: Heart,
                  title: "Hospital-side credibility",
                  desc: "Most brokers stop at the signup. We coordinate direct billing, walk through claims, and stay on call when you're at the hospital.",
                },
                {
                  icon: Globe,
                  title: "Foreigner-focused",
                  desc: "English-speaking service for any foreigner in Thailand — visitor, working, retired, or long-stay. Built around how you actually live here.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
                  <div className="bg-sky-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-sky-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="/#contact"
                className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Talk to our team
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
