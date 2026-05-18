import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import { Shield, Heart, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About Tonkla — Your Health Insurance Advisor in Thailand",
  description:
    "Meet Tonkla, your English-speaking Allianz Ayudhya advisor in Thailand. Backed by a team with 5+ years of claims experience and a nurse at Chulalongkorn Hospital.",
  openGraph: {
    title: "About Tonkla — Your Health Insurance Advisor in Thailand",
    description: "Authorised Allianz Ayudhya advisor backed by a dedicated claims team. Personal service for foreigners across Thailand.",
    url: "https://www.thaicovercare.com/about",
  },
  alternates: { canonical: "https://www.thaicovercare.com/about" },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
              <p className="text-xl text-gray-600">
                Your dedicated health insurance advisor in Thailand
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-700 font-bold text-2xl">T</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Hi, I&apos;m Tonkla</h2>
                  <p className="text-teal-600 font-medium mb-4">Authorised Allianz Ayudhya Life Insurance Advisor</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    I work at the intersection of healthcare and insurance in Thailand — helping people navigate one
                    of the most stressful situations anyone can face: being sick in a foreign country, unsure whether
                    you&apos;re covered and what to do next.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    What makes CoverCare Thailand different is our team. My partner has over 5 years of experience
                    managing insurance claims across dozens of cases — and one of our team members is a practicing
                    nurse at Chulalongkorn Hospital. Between us, we cover the full journey: plan selection,
                    direct billing coordination, and claims support from start to finish.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When I noticed how many foreigners — visitors, digital nomads, retirees, and long-stay residents —
                    were underinsured or confused about their options in Thailand, I created CoverCare Thailand.
                    A service built for anyone who needs real, English-speaking support navigating healthcare here.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Shield,
                  title: "Authorised Advisor",
                  desc: "Fully licenced and authorised by Allianz Ayudhya Life Insurance to sell and service policies across Thailand.",
                },
                {
                  icon: Heart,
                  title: "Experienced Claims Team",
                  desc: "Our team includes an experienced nurse at Chulalongkorn Hospital and a claims specialist with 5+ years handling OPD and IPD cases across Thailand.",
                },
                {
                  icon: Globe,
                  title: "Foreigner-Focused",
                  desc: "English-speaking service for any foreigner in Thailand — whether you're visiting, working, retired, or calling Thailand home long-term.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
                  <div className="bg-teal-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#contact"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get in Touch
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
