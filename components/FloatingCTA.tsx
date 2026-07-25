"use client"

import { MessageCircle } from "lucide-react"
import WhatsAppLink from "./WhatsAppLink"

export default function FloatingCTA() {
  return (
    <WhatsAppLink
      source="floating_cta"
      href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi! I found your website and I'm interested in health insurance in Thailand.")}`}
      aria-label="Chat with our team"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
      style={{
        background: "var(--glass-bg-strong)",
        backdropFilter: "var(--blur-md)",
        WebkitBackdropFilter: "var(--blur-md)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow), 0 0 0 1px rgba(37,211,102,0.2)",
        color: "var(--navy-800)",
      }}
    >
      <span
        className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #2EDF74, var(--whatsapp))", color: "#fff" }}
      >
        <MessageCircle size={15} strokeWidth={2.5} />
      </span>
      <span className="text-sm font-semibold hidden sm:inline text-navy-800">Chat with our team</span>
    </WhatsAppLink>
  )
}
