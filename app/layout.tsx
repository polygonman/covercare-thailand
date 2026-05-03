import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CoverCare Thailand — Expat Health Insurance",
  description:
    "English-speaking health insurance advisor in Thailand. Specialising in Allianz Ayudhya plans for expats, digital nomads, and retirees. Hospital coordination, fast claims, and personal service.",
  keywords: "expat health insurance Thailand, Allianz Ayudhya, digital nomad insurance Thailand, health insurance Bangkok",
  openGraph: {
    title: "CoverCare Thailand — Expat Health Insurance",
    description: "Your trusted English-speaking health insurance advisor in Thailand.",
    url: "https://www.thaicovercare.com",
    siteName: "CoverCare Thailand",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
