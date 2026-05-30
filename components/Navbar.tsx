"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"

const links = [
  { href: "/#segments", label: "Who we help" },
  { href: "/services", label: "Services" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Resources" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating glass pill */}
      <nav
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1200px, calc(100vw - 32px))",
          background: "var(--glass-bg-strong)",
          backdropFilter: "var(--blur-md)",
          WebkitBackdropFilter: "var(--blur-md)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
          borderRadius: 999,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px 8px 20px",
          gap: 16,
        }}
        aria-label="Primary"
      >
        {/* Logo */}
        <Link href="/" aria-label="covercare" className="flex items-center flex-shrink-0">
          <Image src="/logo-wordmark.svg" alt="covercare" width={116} height={26} priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy-700 px-3.5 py-1.5 rounded-full hover:bg-navy-100 transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/contact"
            className="text-sm font-medium text-navy-700 px-4 py-2 rounded-full border border-[rgba(0,30,77,0.12)] hover:bg-navy-50 transition-colors duration-150"
          >
            Sign in
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-white px-4 py-2 rounded-full flex items-center gap-1.5 transition-all duration-150 hover:opacity-90"
            style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}
          >
            Get a quote
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-navy-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: "var(--navy-700)", background: "transparent", border: "none", cursor: "pointer" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed z-40 flex flex-col gap-1"
          style={{
            top: 80,
            left: 16,
            right: 16,
            background: "var(--glass-bg-strong)",
            backdropFilter: "var(--blur-lg)",
            WebkitBackdropFilter: "var(--blur-lg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glass-shadow-lg)",
            borderRadius: 24,
            padding: 16,
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-navy-700 font-medium px-4 py-3 rounded-2xl hover:bg-navy-50 transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-2 block text-center text-white text-sm font-semibold px-4 py-3.5 rounded-full transition-opacity hover:opacity-90"
            style={{ background: "var(--sky-500)" }}
          >
            Get a quote
          </Link>
        </div>
      )}
    </>
  )
}
