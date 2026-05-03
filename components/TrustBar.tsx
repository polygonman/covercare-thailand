const items = [
  "🏆 Allianz Ayudhya Authorised",
  "🏥 50+ Hospital Network",
  "🇬🇧 English Speaking",
  "⚡ 24hr Response",
  "📋 Claims Support Included",
  "🌏 Expat Specialist",
]

export default function TrustBar() {
  return (
    <section className="bg-teal-700 py-3">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {items.map((item) => (
          <span key={item} className="text-white text-sm font-medium whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
