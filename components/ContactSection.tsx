import ContactForm from "@/components/ContactForm"
import { Mail, MessageCircle, Phone } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Book Your Free Consultation
            </h2>
            <p className="text-slate-500 mb-8 text-lg leading-relaxed">
              No obligations, no jargon. Just an honest conversation about the best health insurance
              options for your situation in Thailand.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I'd like to discuss health insurance options.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 group cursor-pointer"
              >
                <div className="bg-green-500 p-2.5 rounded-xl flex-shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">WhatsApp</p>
                  <p className="text-sm text-slate-400">+66 61 196 5363</p>
                </div>
              </a>

              <a
                href="https://line.me/ti/p/~@covercareTH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 group cursor-pointer"
              >
                <div className="bg-green-400 p-2.5 rounded-xl flex-shrink-0">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">LINE</p>
                  <p className="text-sm text-slate-400">@covercareTH</p>
                </div>
              </a>

              <a
                href="mailto:covercareTH@gmail.com"
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 group cursor-pointer"
              >
                <div className="bg-sky-500 p-2.5 rounded-xl flex-shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">Email</p>
                  <p className="text-sm text-slate-400">covercareTH@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
