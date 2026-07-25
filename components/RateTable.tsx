import { annualPremium, mainContract, thb, type Gender } from "@/lib/quickRates"

const AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]

function allIn(engineId: string, age: number, g: Gender): number {
  const ipd = annualPremium(engineId, age, g) ?? 0
  const m = mainContract(age, g)
  return ipd + (m?.premium ?? 0)
}

export default function RateTable({ engineId }: { engineId: string }) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--navy-50, rgba(0,30,77,0.04))" }}>
            <th className="text-left font-semibold text-navy-800 px-5 py-3">Age</th>
            <th className="text-right font-semibold text-navy-800 px-5 py-3">Male · all-in / yr</th>
            <th className="text-right font-semibold text-navy-800 px-5 py-3">Female · all-in / yr</th>
          </tr>
        </thead>
        <tbody>
          {AGES.map((age, i) => (
            <tr key={age} style={{ borderTop: "1px solid var(--glass-border)", background: i % 2 ? "transparent" : "rgba(0,30,77,0.015)" }}>
              <td className="px-5 py-2.5 font-medium text-navy-800">{age}</td>
              <td className="px-5 py-2.5 text-right text-ink-700" style={{ fontFamily: "var(--font-geist-mono)" }}>{thb(allIn(engineId, age, "m"))}</td>
              <td className="px-5 py-2.5 text-right text-ink-700" style={{ fontFamily: "var(--font-geist-mono)" }}>{thb(allIn(engineId, age, "f"))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs px-5 py-3" style={{ color: "var(--ink-400)", lineHeight: 1.5, borderTop: "1px solid var(--glass-border)" }}>
        All-in annual premium = this health plan + the minimum required Whole Life A99/20 main contract, for a standard-occupation healthy applicant. Excludes optional OPD and other riders. Final premium confirmed after underwriting. WhatsApp us for your exact figure.
      </p>
    </div>
  )
}
