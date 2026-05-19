const testimonials = [
  {
    name: "James R.",
    role: "Software · Bangkok",
    initials: "JR",
    avatarStyle: { background: "var(--sky-100)", color: "var(--sky-700)" },
    quote: "Signed up in fifteen minutes. When I went to Bumrungrad the claim was settled before I&apos;d left the lobby.",
  },
  {
    name: "Amelia K.",
    role: "Nomad · Chiang Mai",
    initials: "AK",
    avatarStyle: { background: "var(--coral-100)", color: "var(--coral-600)" },
    quote: "Finally someone who explains insurance like a normal person. The whole flow is online — I never had to print anything.",
  },
  {
    name: "David & Sarah M.",
    role: "Retired · Phuket",
    initials: "DS",
    avatarStyle: { background: "var(--navy-100)", color: "var(--navy-700)" },
    quote: "Three years in Thailand and Tonkla has handled every hospital visit. It’s like having a personal advocate on call.",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="w-4 h-4" style={{ fill: "var(--coral-500)" }}>
          <path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.8l-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="text-center mb-14">
          <span className="eyebrow">/ Clients</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
            Real expats. <span className="gradient-text">Real fast.</span>
          </h2>
          <p className="text-lg" style={{ color: "var(--ink-600)" }}>Real experiences from foreigners across Thailand.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, initials, avatarStyle, quote }) => (
            <div
              key={name}
              className="rounded-3xl p-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--blur-md)",
                WebkitBackdropFilter: "var(--blur-md)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Stars />
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--ink-700)" }}>
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={avatarStyle}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{name}</p>
                    <p className="text-xs" style={{ color: "var(--ink-400)" }}>{role}</p>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: "var(--sky-50)", color: "var(--sky-600)", border: "1px solid var(--sky-100)" }}
                >
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm3.72 6.28l-4.5 4.5a1 1 0 01-1.44 0l-1.5-1.5a1 1 0 011.44-1.44l.78.78 3.78-3.78a1 1 0 011.44 1.44z"/>
                  </svg>
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
