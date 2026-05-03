const steps = [
  {
    number: "01",
    title: "Tell Me Your Situation",
    desc: "Fill in the quick form or WhatsApp me directly. I'll ask a few questions to understand your needs, visa type, and budget.",
  },
  {
    number: "02",
    title: "Get Your Personalised Plan",
    desc: "I compare relevant Allianz Ayudhya options and present the best fit with a clear breakdown — no insurance jargon.",
  },
  {
    number: "03",
    title: "Stay Supported",
    desc: "Once covered, I'm on-call for hospital visits, questions, and claims — for as long as you're in Thailand.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500">Simple process, personal service.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-16 top-8 bottom-8 w-0.5 bg-teal-100" />
          <div className="flex flex-col gap-8">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {number}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
