import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingCTA from "@/components/FloatingCTA"
import ContactSection from "@/components/ContactSection"
import CalendlyEmbed from "@/components/CalendlyEmbed"

export const metadata: Metadata = {
  title: "Contact — CoverCare Thailand",
  description: "Book a free consultation with Tonkla, your English-speaking health insurance advisor in Thailand. WhatsApp, LINE, or email.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-8 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
            <p className="text-gray-600">
              No pressure, no jargon — just an honest conversation about your health insurance options in Thailand.
            </p>
          </div>
        </section>
        <ContactSection />

        {/* Calendly inline booking */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Prefer to book a time directly?
              </h2>
              <p className="text-gray-500 text-sm">
                Pick a slot and I&apos;ll call you — no form needed.
              </p>
            </div>
            <CalendlyEmbed />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
