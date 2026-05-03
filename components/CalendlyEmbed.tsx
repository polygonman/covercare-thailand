"use client"

import { useEffect } from "react"

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/covercareth/consultation"

export default function CalendlyEmbed() {
  useEffect(() => {
    // Load Calendly widget script once
    if (document.getElementById("calendly-script")) return
    const script = document.createElement("script")
    script.id = "calendly-script"
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      // leave script in DOM — it's idempotent and removing it causes flicker on re-mount
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
      data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=f8fafc&text_color=111827&primary_color=0d9488`}
      style={{ minWidth: 320, height: 700 }}
    />
  )
}
