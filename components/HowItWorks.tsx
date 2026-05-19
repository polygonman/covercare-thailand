const steps = [
  {
    n: "01", est: "2 min",
    title: "Tell Me Your Situation",
    desc: "Fill in the quick form or WhatsApp me directly. I'll ask a few questions to understand your needs, visa type, and budget.",
  },
  {
    n: "02", est: "5 min",
    title: "Get Your Personalised Plan",
    desc: "I compare relevant Allianz Ayudhya options and present the best fit with a clear breakdown — no insurance jargon.",
  },
  {
    n: "03", est: "3 min",
    title: "Sign & Stay Supported",
    desc: "Once covered, our team is on-call for hospital visits, direct billing coordination, and claims support — for as long as you're in Thailand.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="text-center mb-14">
          <span className="eyebrow">/ How it works</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
            Three steps. <span className="gradient-text">Ten minutes.</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--ink-600)" }}>Simple process, personal service.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-3xl p-7 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--blur-md)",
                WebkitBackdropFilter: "var(--blur-md)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-4xl font-black"
                    style={{ fontFamily: "var(--font-geist-mono)", color: "var(--navy-700)", letterSpacing: "-0.04em" }}
                  >
                    {s.n}
                  </span>
                  <span className="eyebrow">Step {s.n}</span>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: "var(--sky-50)", color: "var(--sky-700)", border: "1px solid var(--sky-100)" }}
                >
                  ~ {s.est}
                </span>
              </div>
              <h3 className="font-bold text-navy-900 text-lg">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
