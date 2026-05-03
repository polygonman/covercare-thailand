import { Building2, Laptop, Rocket, Palmtree } from "lucide-react"

const segments = [
  {
    icon: Building2,
    title: "Corporate Expats",
    desc: "Relocation packages, work permit holders, and company-sponsored plans. I help you understand your coverage and coordinate with hospitals.",
    tags: ["Work Permit", "Relocation", "Company Plans"],
  },
  {
    icon: Laptop,
    title: "Digital Nomads & Freelancers",
    desc: "Flexible plans that follow your lifestyle. Coverage that works whether you're in Chiang Mai or Phuket.",
    tags: ["Flexible Coverage", "Visa-Friendly", "Monthly Options"],
  },
  {
    icon: Rocket,
    title: "Tech Startup Employees",
    desc: "Group plans for startups or individual coverage that goes beyond what your employer provides.",
    tags: ["Startup Plans", "Group Coverage", "Top-up Plans"],
  },
  {
    icon: Palmtree,
    title: "Retirees in Thailand",
    desc: "Retirement visa-compatible plans with comprehensive in-patient and out-patient coverage for peace of mind.",
    tags: ["Retirement Visa", "Senior Plans", "Comprehensive Care"],
  },
]

export default function WhoWeHelp() {
  return (
    <section id="segments" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Who I Help</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Whether you just landed or have lived in Thailand for years, I find the right Allianz plan for your situation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map(({ icon: Icon, title, desc, tags }) => (
            <div
              key={title}
              className="border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all duration-200 group bg-white cursor-default"
            >
              <div className="bg-teal-50 border border-teal-100 w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors duration-200">
                <Icon size={20} className="text-teal-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors duration-200">{title}</h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
