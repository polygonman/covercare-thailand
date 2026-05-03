import { BadgeCheck } from "lucide-react"

const testimonials = [
  {
    name: "James R.",
    role: "Software Engineer, Bangkok",
    initials: "JR",
    color: "bg-sky-100 text-sky-700",
    quote:
      "Tonkla made the whole process so easy. When I had to go to Bumrungrad, she was there to help with everything. Claims were processed within a week.",
    stars: 5,
  },
  {
    name: "Amelia K.",
    role: "Digital Nomad, Chiang Mai",
    initials: "AK",
    color: "bg-violet-100 text-violet-700",
    quote:
      "Finally found someone who actually explains insurance in plain English. She found a plan that covered my pre-existing condition at a reasonable price.",
    stars: 5,
  },
  {
    name: "David & Sarah M.",
    role: "Retired couple, Phuket",
    initials: "DS",
    color: "bg-emerald-100 text-emerald-700",
    quote:
      "We've been in Thailand 3 years and Tonkla has handled every hospital visit for us. It's like having a personal advocate — invaluable as retirees here.",
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What Clients Say</h2>
          <p className="text-slate-500 text-lg">Real experiences from expats across Thailand.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, initials, color, quote, stars }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <svg key={i} viewBox="0 0 16 16" className="w-4 h-4 fill-amber-400">
                    <path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.8l-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 flex-1">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${color}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-teal-700 font-medium flex-shrink-0">
                  <BadgeCheck size={14} className="text-teal-600" />
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
