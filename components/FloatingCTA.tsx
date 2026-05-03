"use client"

import { MessageCircle } from "lucide-react"

export default function FloatingCTA() {
  return (
    <a
      href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I found your website and I'm interested in health insurance in Thailand.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-2 px-4 py-3"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="text-sm font-semibold hidden sm:inline">Chat on WhatsApp</span>
    </a>
  )
}
