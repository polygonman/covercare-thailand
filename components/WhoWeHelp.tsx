import { Building2, Laptop, Rocket, Palmtree } from "lucide-react"

const segments = [
  {
    icon: Building2,
    title: "Corporate Expats",
    desc: "Relocation packages, work permit holders, and company-sponsored plans. I find the right coverage and our team handles claims and hospital support.",
    tags: ["Work Permit", "Relocation", "Company Plans"],
  },
  {
    icon: Laptop,
    title: "Digital Nomads & Freelancers",
    desc: "Flexible plans that follow your lifestyle — whether you're staying long-term or just visiting. Short-term options available for those on tourist visas.",
    tags: ["Flexible Coverage", "Visa-Friendly", "Short-Term Plans"],
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
    <section id="segments" className="py-20 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="eyebrow">/ Who I help</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
            Whether you just landed<br className="hidden sm:block" /> or call Thailand home.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--ink-600)" }}>
            I find the right Allianz plan for your situation — whatever your visa or length of stay.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {segments.map(({ icon: Icon, title, desc, tags }) => (
            <div
              key={title}
              className="rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 cursor-default"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--blur-md)",
                WebkitBackdropFilter: "var(--blur-md)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}
              >
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 mb-2 text-base">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "var(--sky-50)", color: "var(--sky-700)", border: "1px solid var(--sky-100)" }}
                  >
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
