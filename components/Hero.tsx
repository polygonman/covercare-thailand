import { Shield, Phone, Clock, Award, Building2, MessageCircle } from "lucide-react"

const trustStats = [
  { icon: Award, label: "Allianz Ayudhya Authorised" },
  { icon: Building2, label: "50+ Hospital Network" },
  { icon: Clock, label: "24-Hour Response" },
]

const features = [
  {
    icon: Shield,
    title: "Allianz Ayudhya Network",
    desc: "Top-tier private hospital coverage across Thailand",
  },
  {
    icon: Phone,
    title: "English-Speaking Support",
    desc: "Direct line to Tonkla — no call centres, no waiting",
  },
  {
    icon: Clock,
    title: "Direct Hospital Billing",
    desc: "Most claims are fax-billed directly to Allianz — you pay nothing upfront",
  },
]

export default function Hero() {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-teal-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <Award size={12} />
              Allianz Ayudhya Authorised Advisor
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5 tracking-tight">
              Thailand Health Insurance{" "}
              <span className="text-teal-700">for Expats &amp; Digital Nomads</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              English-speaking support, direct hospital billing, and a dedicated claims team with 5+ years of experience — so you can focus on living in Thailand, not navigating paperwork.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#contact"
                className="bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-all duration-150 shadow-sm cursor-pointer"
              >
                Book Free Consultation
              </a>
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I'm interested in expat health insurance in Thailand.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} />
                WhatsApp Now
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              {trustStats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Icon size={14} className="text-teal-600 flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md hover:border-teal-100 transition-all duration-200"
              >
                <div className="bg-teal-50 border border-teal-100 p-2.5 rounded-xl flex-shrink-0">
                  <Icon size={20} className="text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-0.5">{title}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
