import ContactForm from "@/components/ContactForm"
import { Mail, MessageCircle, Phone } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Book Your Free Consultation</h2>
            <p className="text-gray-500 mb-8">
              No obligations, no jargon. Just an honest conversation about the best health insurance
              options for your situation in Thailand.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I'd like to discuss health insurance options.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="bg-green-500 p-2 rounded-lg">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">+66 61 196 5363</p>
                </div>
              </a>

              <a
                href="https://line.me/ti/p/~@covercareTH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="bg-green-400 p-2 rounded-lg">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">LINE</p>
                  <p className="text-sm text-gray-500">@covercareTH</p>
                </div>
              </a>

              <a
                href="mailto:covercareTH@gmail.com"
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">covercareTH@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
