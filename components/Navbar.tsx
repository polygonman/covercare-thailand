"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Shield } from "lucide-react"

const links = [
  { href: "/#segments", label: "Who I Help" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Resources" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg leading-none">
            <span className="text-teal-700">CoverCare</span>
            <span className="text-slate-500 font-medium"> Thailand</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-3 text-sm bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-all duration-150 font-semibold shadow-sm cursor-pointer"
          >
            Free Consultation
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate-700 hover:text-teal-700 hover:bg-teal-50 px-3 py-2.5 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="mt-2 bg-teal-700 text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-teal-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            Book Free Consultation
          </Link>
        </div>
      )}
    </nav>
  )
}
