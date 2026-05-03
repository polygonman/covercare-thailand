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
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
          <p className="text-slate-500 text-lg">Simple process, personal service.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-[22px] top-10 bottom-10 w-0.5 bg-teal-100" />
          <div className="flex flex-col gap-10">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-11 h-11 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-md">
                  {number}
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex-1 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200">
                  <h3 className="font-bold text-slate-900 text-lg mb-1.5">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
