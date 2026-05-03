const segments = [
  {
    emoji: "🏢",
    title: "Corporate Expats",
    desc: "Relocation packages, work permit holders, and company-sponsored plans. I help you understand your coverage and coordinate with hospitals.",
    tags: ["Work Permit", "Relocation", "Company Plans"],
  },
  {
    emoji: "💻",
    title: "Digital Nomads & Freelancers",
    desc: "Flexible plans that follow your lifestyle. Coverage that works whether you're in Chiang Mai or Phuket.",
    tags: ["Flexible Coverage", "Visa-Friendly", "Monthly Options"],
  },
  {
    emoji: "🚀",
    title: "Tech Startup Employees",
    desc: "Group plans for startups or individual coverage that goes beyond what your employer provides.",
    tags: ["Startup Plans", "Group Coverage", "Top-up Plans"],
  },
  {
    emoji: "🌅",
    title: "Retirees in Thailand",
    desc: "Retirement visa-compatible plans with comprehensive in-patient and out-patient coverage for peace of mind.",
    tags: ["Retirement Visa", "Senior Plans", "Comprehensive Care"],
  },
]

export default function WhoWeHelp() {
  return (
    <section id="segments" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Who I Help</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you just landed or have lived in Thailand for years, I find the right Allianz plan for your situation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map(({ emoji, title, desc, tags }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{title}</h3>
              <p className="text-sm text-gray-500 mb-4">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
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
