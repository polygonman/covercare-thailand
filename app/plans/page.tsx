import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import QuickRate from "@/components/QuickRate"
import { PLANS, annualPremium, thb } from "@/lib/quickRates"
import { MessageCircle, ShieldCheck, Stethoscope, HeartPulse, Activity, PlusCircle, Hospital, Check } from "lucide-react"

export const metadata = {
  title: "Plans & Rates — My Double Care & First Class Ultra | CoverCare Thailand",
  description:
    "Real Allianz Ayudhya annual premiums for My Double Care (฿8M / ฿15M / ฿30M) and My First Class Ultra (฿60M–฿120M). Check your rate and get a real quote on WhatsApp.",
}

const wa = (text: string) => `https://wa.me/66611965363?text=${encodeURIComponent(text)}`

const riders = [
  { icon: Stethoscope, name: "OPD (out-patient)", desc: "Doctor visits, prescriptions and diagnostics without admission." },
  { icon: HeartPulse, name: "Critical Illness", desc: "A lump sum on diagnosis of cancer, stroke, heart attack and more." },
  { icon: Activity, name: "Hospital Cash", desc: "A fixed daily benefit for every night you spend admitted." },
  { icon: ShieldCheck, name: "Personal Accident", desc: "Extra protection for accidental injury, disability or death." },
  { icon: PlusCircle, name: "Dental", desc: "Routine and major dental care, available on higher tiers." },
  { icon: Hospital, name: "Premium Waiver", desc: "Future premiums are waived if you can't pay due to serious illness." },
]

const glass: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "var(--blur-md)",
  WebkitBackdropFilter: "var(--blur-md)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
}

function PlanCard({ id }: { id: string }) {
  const p = PLANS.find((x) => x.id === id)!
  const ref35 = annualPremium(p.id, 35, "m")
  return (
    <div className="rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1" style={glass}>
      <div className="flex items-center justify-between">
        <span className="eyebrow" style={{ color: "var(--sky-600)" }}>{p.tier}</span>
        {p.badge && (
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "var(--sky-500)", color: "#fff" }}>{p.badge}</span>
        )}
      </div>
      <div>
        <div className="text-3xl font-black text-navy-900" style={{ fontFamily: "var(--font-jakarta)", letterSpacing: "-0.03em" }}>{p.coverageLabel.replace(" / year", "")}</div>
        <div className="text-sm text-ink-500">per year · {p.network}</div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{p.blurb}</p>
      <div className="mt-auto pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="text-xs text-ink-400 mt-3">Annual premium, e.g. age 35 male</div>
        <div className="text-xl font-bold text-navy-800">{ref35 ? thb(ref35) : "—"} <span className="text-sm font-medium text-ink-500">/ year</span></div>
        <a href={wa(`Hi! I'd like a real quote for ${p.productName} ${p.tier} (${p.coverageLabel.replace(" / year", "/yr")}, ${p.network}).`)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg, #2EDF74, #25D366)" }}>
          <MessageCircle size={14} strokeWidth={2.5} /> Get my quote
        </a>
      </div>
    </div>
  )
}

export default function PlansPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-16 overflow-hidden">
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ Plans &amp; rates</span>
                <h1 className="text-4xl md:text-5xl font-black mt-3 mb-5 leading-[1.05]" style={{ color: "var(--navy-950)", letterSpacing: "-0.04em" }}>
                  Real Allianz cover.<br /><span className="gradient-text">Real annual rates.</span>
                </h1>
                <p className="text-lg leading-relaxed mb-6 max-w-lg" style={{ color: "var(--ink-600)" }}>
                  Two flagship Allianz Ayudhya health plans for foreigners in Thailand — comprehensive <strong>My Double Care</strong> (฿8M–฿30M) and the ultra-high <strong>My First Class Ultra</strong> (฿60M–฿120M). Pick a coverage level and see the genuine annual premium. We never bill monthly.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-ink-600">
                  {["Allianz Ayudhya authorised", "226+ direct-billing hospitals", "Annual premium only"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5"><Check size={15} style={{ color: "var(--sky-500)" }} /> {t}</span>
                  ))}
                </div>
              </div>
              <QuickRate />
            </div>
          </div>
        </section>

        {/* My Double Care */}
        <section className="py-16 relative">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <header className="mb-10">
              <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ My Double Care</span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-3" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
                Comprehensive cover that <span className="gradient-text">doubles</span> when it matters most.
              </h2>
              <p className="text-lg max-w-2xl" style={{ color: "var(--ink-600)" }}>
                As-charged, any hospital in Thailand. On first diagnosis of one of 10 major critical illnesses, your annual limit doubles — ฿8M→฿16M, ฿15M→฿30M, ฿30M→฿60M.
              </p>
            </header>
            <div className="grid md:grid-cols-3 gap-5">
              <PlanCard id="mdc8" />
              <PlanCard id="mdc15" />
              <PlanCard id="mdc30" />
            </div>
          </div>
        </section>

        {/* My First Class Ultra */}
        <section className="py-16 relative">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <header className="mb-10">
              <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ My First Class Ultra</span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-3" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
                The <span className="gradient-text">ultra-high</span> tier — ฿60M to ฿120M a year.
              </h2>
              <p className="text-lg max-w-2xl" style={{ color: "var(--ink-600)" }}>
                For those who want the very top of the market. Platinum and Beyond Platinum, on the all-hospital network or the BDMS group (Bangkok Hospital, Samitivej, BNH, Phyathai…).
              </p>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <PlanCard id="fc60" />
              <PlanCard id="fc80" />
              <PlanCard id="fc100" />
              <PlanCard id="fc120" />
            </div>
          </div>
        </section>

        {/* Riders */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <header className="mb-10">
              <span className="eyebrow" style={{ color: "var(--sky-600)" }}>/ Add-on riders</span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-3" style={{ color: "var(--navy-950)", letterSpacing: "-0.025em" }}>
                Tailor it with <span className="gradient-text">riders.</span>
              </h2>
              <p className="text-lg max-w-2xl" style={{ color: "var(--ink-600)" }}>
                Build the exact protection you want. Rider pricing depends on age, plan and options — message us and we&apos;ll put together a real, itemised quote.
              </p>
            </header>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {riders.map(({ icon: Icon, name, desc }) => (
                <div key={name} className="rounded-3xl p-6 flex flex-col gap-3" style={glass}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-navy-900 text-base">{name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-600)" }}>{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-5" style={{ background: "linear-gradient(135deg, var(--navy-800), var(--navy-950))", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <h3 className="text-2xl font-black mb-1" style={{ color: "#fff", letterSpacing: "-0.02em" }}>Want a real quote with riders?</h3>
                <p className="text-sm" style={{ color: "var(--navy-300)" }}>Tell us your age, plan and the riders you want — we reply on WhatsApp in about 8 minutes.</p>
              </div>
              <a href={wa("Hi! I'd like a real quote with riders. Here's my age and the plan I'm considering:")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-90" style={{ background: "linear-gradient(160deg, #2EDF74, #25D366)" }}>
                <MessageCircle size={16} strokeWidth={2.5} /> Get a real quote on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
