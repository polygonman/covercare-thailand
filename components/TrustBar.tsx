import { Award, Hospital, Globe, Zap, FileCheck, Users } from "lucide-react"

const items = [
  { icon: Award, label: "Allianz Ayudhya Authorised" },
  { icon: Hospital, label: "50+ Hospital Network" },
  { icon: Globe, label: "English Speaking" },
  { icon: Zap, label: "24hr Response" },
  { icon: FileCheck, label: "Claims Support Included" },
  { icon: Users, label: "Expat Specialist" },
]

export default function TrustBar() {
  return (
    <section className="bg-teal-700 py-3.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-white text-sm font-medium whitespace-nowrap">
            <Icon size={13} className="text-teal-200 flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </section>
  )
}
