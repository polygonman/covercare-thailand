import { Hospital, FileText, Search, Users, MessageCircle, Globe } from "lucide-react"

const services = [
  {
    icon: Hospital,
    title: "Hospital Coordination",
    desc: "I escort you through hospital admission, communicate with Thai-speaking staff, and make sure you're comfortable throughout.",
  },
  {
    icon: FileText,
    title: "Claims Assistance",
    desc: "From paperwork to follow-up, I guide every claim to completion so you receive what you're entitled to.",
  },
  {
    icon: Search,
    title: "Plan Selection",
    desc: "I analyse your needs and budget to recommend the most suitable Allianz Ayudhya health insurance plan.",
  },
  {
    icon: Users,
    title: "Family & Group Plans",
    desc: "Coverage for your family members or a group plan for your startup team at competitive rates.",
  },
  {
    icon: MessageCircle,
    title: "Ongoing Support",
    desc: "Available via WhatsApp and LINE for questions long after you've signed up — not just at sale time.",
  },
  {
    icon: Globe,
    title: "Expat-Specific Guidance",
    desc: "Understanding visa requirements, OPD vs IPD benefits, exclusions, and renewal strategies for expat situations.",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What I Do For You</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            More than selling insurance — I&apos;m your long-term health advisor in Thailand.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200"
            >
              <div className="bg-teal-50 border border-teal-100 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-teal-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
