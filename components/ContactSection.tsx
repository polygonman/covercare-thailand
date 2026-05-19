import ContactForm from "@/components/ContactForm"
import { Mail, MessageCircle, Phone, Calendar, ArrowRight } from "lucide-react"

const channels = [
  {
    href: `https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I'd like to discuss health insurance options.")}`,
    iconStyle: { background: "linear-gradient(160deg, #2EDF74, #25D366)" },
    icon: MessageCircle,
    label: "WhatsApp Tonkla",
    value: "+66 61 196 5363 · reply in 8 min",
    external: true,
  },
  {
    href: "https://line.me/ti/p/~@covercareTH",
    iconStyle: { background: "linear-gradient(160deg, #1ED674, #06C755)" },
    icon: Phone,
    label: "LINE",
    value: "@covercareTH",
    external: true,
  },
  {
    href: "mailto:covercareTH@gmail.com",
    iconStyle: { background: "linear-gradient(160deg, var(--sky-400), var(--sky-600))" },
    icon: Mail,
    label: "Email",
    value: "covercareTH@gmail.com",
    external: false,
  },
  {
    href: "#contact",
    iconStyle: { background: "linear-gradient(160deg, var(--navy-600), var(--navy-900))" },
    icon: Calendar,
    label: "Book a 30-min call",
    value: "Free · video or in-person · Bangkok",
    external: false,
  },
]

const glassTile: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "var(--blur-md)",
  WebkitBackdropFilter: "var(--blur-md)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
}

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 450, height: 450, top: "20%", right: -80, borderRadius: "999px",
          background: "radial-gradient(circle, rgba(0,164,228,0.18), transparent 70%)",
          filter: "blur(80px)", opacity: 0.7,
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Left: channels */}
          <div>
            <span className="eyebrow">/ Talk to us</span>
            <h2
              className="text-3xl md:text-4xl font-black mt-3 mb-4 leading-tight"
              style={{ color: "var(--navy-900)", letterSpacing: "-0.04em" }}
            >
              Talk to a <span className="gradient-text">real human.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "var(--ink-600)" }}>
              No obligations, no jargon. Just an honest conversation about the best plan for your situation in Thailand.
            </p>

            <div className="flex flex-col gap-3">
              {channels.map(({ href, iconStyle, icon: Icon, label, value, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
                  style={glassTile}
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ ...iconStyle, color: "#fff" }}
                  >
                    <Icon size={17} strokeWidth={2.25} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-900 text-sm">{label}</p>
                    <p className="text-xs truncate" style={{ color: "var(--ink-500)" }}>{value}</p>
                  </div>
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--sky-500)" }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="rounded-3xl p-8" style={glassTile}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
