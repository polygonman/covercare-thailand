import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">CoverCare Thailand</p>
            <p className="text-sm">
              Authorised Allianz Ayudhya advisor specialising in health insurance for expats and
              digital nomads in Thailand.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Quick Links</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Tonkla</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Resources</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Contact</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/66611965363" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                WhatsApp: +66 61 196 5363
              </a>
              <span>LINE: @covercareTH</span>
              <a href="mailto:covercareTH@gmail.com" className="hover:text-white transition-colors">
                covercareTH@gmail.com
              </a>
              <a href="https://www.thaicovercare.com" className="hover:text-white transition-colors">
                www.thaicovercare.com
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} CoverCare Thailand. All rights reserved.</p>
          <p>Authorised Allianz Ayudhya Life Insurance Advisor — Thailand&apos;s #1 expat &quot;insurance&quot; guide &amp; advisor</p>
        </div>
      </div>
    </footer>
  )
}
