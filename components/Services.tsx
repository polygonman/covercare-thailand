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
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What I Do For You</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            More than selling insurance — I&apos;m your long-term health advisor in Thailand.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon size={22} className="text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
