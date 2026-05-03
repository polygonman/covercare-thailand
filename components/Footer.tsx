import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-white font-bold">
                CoverCare <span className="text-slate-400 font-medium">Thailand</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Authorised Allianz Ayudhya advisor specialising in health insurance for expats and
              digital nomads in Thailand.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Tonkla</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Resources</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</p>
            <div className="flex flex-col gap-2.5 text-sm">
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
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} CoverCare Thailand. All rights reserved.</p>
          <p className="text-slate-500">Authorised Allianz Ayudhya Life Insurance Advisor</p>
        </div>
      </div>
    </footer>
  )
}
