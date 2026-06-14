import Link from "next/link"
import Image from "next/image"
import WhatsAppLink from "@/components/WhatsAppLink"

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, var(--navy-900), var(--navy-950))", color: "var(--ink-300)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Image src="/logo-wordmark-light.svg" alt="covercare" width={120} height={28} className="mb-4" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--navy-300)" }}>
              By the CoverCare team. Authorised Allianz Ayudhya advisor for foreigners in Thailand.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--navy-200)" }}>Product</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/services" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Services</Link>
              <Link href="/hospitals" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Hospital Network</Link>
              <Link href="/#faq" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>FAQ</Link>
              <Link href="/#segments" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Who we help</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--navy-200)" }}>Resources</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/blog" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Blog & Guides</Link>
              <Link href="/guide" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Free PDF Guide</Link>
              <Link href="/about" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>About our team</Link>
              <Link href="/contact" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--navy-200)" }}>Contact</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <WhatsAppLink
                source="footer"
                href="https://wa.me/66611965363"
                className="hover:text-white transition-colors"
                style={{ color: "var(--navy-300)" }}
              >
                WhatsApp +66 61 196 5363
              </WhatsAppLink>
              <span style={{ color: "var(--navy-300)" }}>LINE @covercareTH</span>
              <a href="mailto:covercareTH@gmail.com" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>
                covercareTH@gmail.com
              </a>
              <a href="https://www.thaicovercare.com" className="hover:text-white transition-colors" style={{ color: "var(--navy-300)" }}>
                www.thaicovercare.com
              </a>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "var(--ink-500)" }}
        >
          <p>© {new Date().getFullYear()} CoverCare Thailand. All rights reserved.</p>
          <p style={{ color: "var(--navy-400)" }}>Allianz Ayudhya · Authorised advisor</p>
        </div>
      </div>
    </footer>
  )
}
