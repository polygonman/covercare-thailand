const glassTile: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "var(--blur-md)",
  WebkitBackdropFilter: "var(--blur-md)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
}

const darkTile: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))",
  border: "1px solid rgba(255,255,255,0.08)",
}

export default function Services() {
  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 500, height: 500, top: "10%", right: -100, borderRadius: "999px",
          background: "radial-gradient(circle, rgba(0,164,228,0.18), transparent 70%)",
          filter: "blur(80px)", opacity: 0.6,
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="text-center mb-14">
          <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ Why covercare</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
            The whole journey, <span className="gradient-text">in one tab.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--ink-600)" }}>
            Compare, quote, sign, claim — without a single phone tree.
          </p>
        </header>

        {/* Bento grid — desktop only */}
        <div className="hidden lg:grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "auto" }}>
          {/* Hero tile — dark, col 1, row span 2 */}
          <div className="rounded-3xl p-7 flex flex-col gap-4 row-span-2" style={darkTile}>
            <span className="eyebrow" style={{ color: "var(--navy-300)" }}>01 / Online journey</span>
            <h3 className="text-2xl font-black leading-tight" style={{ color: "#fff", letterSpacing: "-0.025em" }}>
              From foreigner to fully covered, in 10 minutes.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--navy-300)" }}>
              Digital signature, card payment, policy active the moment payment clears.
            </p>
            <div
              className="rounded-2xl p-4 mt-auto flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="eyebrow" style={{ color: "var(--navy-400)", fontSize: 10 }}>ANNUAL PREMIUM</span>
              <span className="text-2xl font-black" style={{ fontFamily: "var(--font-jakarta)", color: "var(--sky-300)" }}>
                ฿42,800
              </span>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: "60%", background: "var(--sky-500)" }} />
              </div>
              <div
                className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "var(--sky-500)", color: "#fff" }}
              >
                Continue →
              </div>
            </div>
          </div>

          {/* Small: reply */}
          <div className="rounded-3xl p-6 flex flex-col gap-1" style={glassTile}>
            <span className="eyebrow" style={{ color: "var(--ink-400)" }}>02 / Real humans</span>
            <div className="text-5xl font-black mt-2" style={{ fontFamily: "var(--font-jakarta)", color: "var(--navy-700)", letterSpacing: "-0.04em" }}>
              8<span className="text-2xl" style={{ color: "var(--sky-500)" }}>min</span>
            </div>
            <h3 className="font-bold text-navy-900">Median WhatsApp reply</h3>
            <p className="text-sm" style={{ color: "var(--ink-500)" }}>Our team. Not a call centre.</p>
          </div>

          {/* Small: network */}
          <div className="rounded-3xl p-6 flex flex-col gap-1" style={glassTile}>
            <span className="eyebrow" style={{ color: "var(--ink-400)" }}>03 / Hospital network</span>
            <div className="text-5xl font-black mt-2" style={{ fontFamily: "var(--font-jakarta)", color: "var(--navy-700)", letterSpacing: "-0.04em" }}>
              226<span className="text-2xl" style={{ color: "var(--sky-500)" }}>+</span>
            </div>
            <h3 className="font-bold text-navy-900">Direct-billed hospitals</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["Bumrungrad", "BNH", "Samitivej"].map((h) => (
                <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Wide: steps — spans 2 cols */}
          <div className="rounded-3xl p-6 col-span-2" style={glassTile}>
            <span className="eyebrow" style={{ color: "var(--ink-400)" }}>04 / Online flow</span>
            <h3 className="font-bold text-navy-900 text-lg mt-2 mb-4">The end-to-end stack.</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {["Tell us about you · 2 min", "Compare Allianz plans · 5 min", "Sign & pay · 3 min", "Claim direct from any hospital visit"].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: "var(--sky-500)", color: "#fff" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "var(--ink-700)" }}>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom 1: claims — dark */}
          <div className="rounded-3xl p-6 flex flex-col gap-2" style={darkTile}>
            <span className="eyebrow" style={{ color: "var(--navy-300)" }}>05 / Claims handled</span>
            <div className="text-4xl font-black mt-1" style={{ fontFamily: "var(--font-jakarta)", color: "var(--sky-300)", letterSpacing: "-0.04em" }}>
              3–7<span className="text-xl font-bold ml-1" style={{ color: "var(--navy-300)" }}>days</span>
            </div>
            <h3 className="font-bold text-lg" style={{ color: "#fff" }}>Most claims settle within a week.</h3>
            <p className="text-sm" style={{ color: "var(--navy-300)" }}>
              Our nurse and claims specialist coordinate every visit and submit every form on your behalf.
            </p>
          </div>

          {/* Bottom 2: Allianz — glass, spans 2 cols */}
          <div className="rounded-3xl p-6 flex flex-col gap-3 col-span-2" style={glassTile}>
            <span className="eyebrow" style={{ color: "var(--ink-400)" }}>06 / Backed by Allianz Ayudhya</span>
            <h3 className="font-bold text-navy-900 text-lg">The plan you trust. The advisor you need.</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>
              Authorised Allianz Ayudhya Life Insurance advisor. Full product range. Honest recommendations only — we win when you stay covered.
            </p>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <span
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "linear-gradient(135deg, var(--navy-700), var(--navy-900))", color: "#fff", fontFamily: "var(--font-jakarta)" }}
              >
                Allianz Ayudhya
              </span>
              <span className="eyebrow" style={{ color: "var(--ink-500)" }}>Authorised Partner</span>
            </div>
          </div>
        </div>

        {/* Mobile / tablet card grid */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-5">
          {[
            { n: "01", title: "Online in 10 min", desc: "Digital signature, card payment, policy active immediately." },
            { n: "02", title: "8 min reply time", desc: "Our team on WhatsApp. Not a call centre." },
            { n: "03", title: "226+ hospitals", desc: "Direct billing to Bumrungrad, BNH, Samitivej, and more." },
            { n: "04", title: "3–7 day claims", desc: "Our nurse and claims specialist handle every visit." },
            { n: "05", title: "Claims & Hospital Support", desc: "Our team — including an experienced nurse — handles direct billing and guides every claim." },
            { n: "06", title: "Foreigner-Specific Guidance", desc: "Tourist visa, retirement visa, or work permit — we'll explain your options." },
          ].map((item) => (
            <div key={item.n} className="rounded-2xl p-5 flex items-start gap-4" style={glassTile}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--sky-100)", color: "var(--sky-700)" }}>
                {item.n}
              </span>
              <div>
                <h4 className="font-bold text-navy-900 mb-1 text-sm">{item.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--ink-600)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
