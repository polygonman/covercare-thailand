import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import TrustBar from "@/components/TrustBar"
import WhoWeHelp from "@/components/WhoWeHelp"
import Services from "@/components/Services"
import HowItWorks from "@/components/HowItWorks"
import GuideBanner from "@/components/GuideBanner"
import Testimonials from "@/components/Testimonials"
import FAQ from "@/components/FAQ"
import ContactSection from "@/components/ContactSection"
import FloatingCTA from "@/components/FloatingCTA"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <WhoWeHelp />
        <Services />
        <HowItWorks />
        <GuideBanner />
        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
