import { Shield, Phone, Clock } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Allianz Ayudhya Authorised Advisor
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Thailand Health Insurance for{" "}
              <span className="text-teal-600">Expats & Digital Nomads</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              English-speaking support, hospital coordination, and fast claims — so you can focus on
              living in Thailand, not navigating paperwork.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Book Free Consultation
              </a>
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I'm interested in expat health insurance in Thailand.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Phone size={16} />
                WhatsApp Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Shield, title: "Allianz Ayudhya Network", desc: "Top-tier private hospital coverage across Thailand" },
              { icon: Phone, title: "English-Speaking Support", desc: "Direct line to Tonkla — no call centres" },
              { icon: Clock, title: "Fast Claims Assistance", desc: "Personal help from hospital admission to reimbursement" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-teal-50 p-2 rounded-lg">
                  <Icon size={22} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
