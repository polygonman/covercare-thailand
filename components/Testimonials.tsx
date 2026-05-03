const testimonials = [
  {
    name: "James R.",
    role: "Software Engineer, Bangkok",
    quote:
      "Tonkla made the whole process so easy. When I had to go to Bumrungrad, she was there to help with everything. Claims were processed within a week.",
    stars: 5,
  },
  {
    name: "Amelia K.",
    role: "Digital Nomad, Chiang Mai",
    quote:
      "Finally found someone who actually explains insurance in plain English. She found a plan that covered my pre-existing condition at a reasonable price.",
    stars: 5,
  },
  {
    name: "David & Sarah M.",
    role: "Retired couple, Phuket",
    quote:
      "We've been in Thailand 3 years and Tonkla has handled every hospital visit for us. It's like having a personal advocate — invaluable as retirees here.",
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-teal-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What Clients Say</h2>
          <p className="text-gray-500">Real experiences from expats across Thailand.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote, stars }) => (
            <div key={name} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
