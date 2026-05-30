import { Award, Building2, Globe, Zap, FileCheck } from "lucide-react"

const items = [
  { icon: Award,     label: "Allianz Authorised" },
  { icon: Building2, label: "226+ Hospitals" },
  { icon: Globe,     label: "English Support" },
  { icon: Zap,       label: "Reply in 8 min" },
  { icon: FileCheck, label: "Direct Billing" },
]

export default function TrustBar() {
  return (
    <section
      style={{
        background: "var(--glass-bg-tinted)",
        backdropFilter: "var(--blur-md)",
        WebkitBackdropFilter: "var(--blur-md)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-navy-700"
            >
              <Icon size={13} style={{ color: "var(--sky-500)", flexShrink: 0 }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
