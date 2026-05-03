import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import JsonLd from "@/components/JsonLd"

const inter = Inter({ subsets: ["latin"] })

const BASE = "https://www.thaicovercare.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "CoverCare Thailand — Expat Health Insurance Advisor",
    template: "%s | CoverCare Thailand",
  },
  description:
    "English-speaking health insurance advisor in Thailand. Allianz Ayudhya plans for expats, digital nomads, and retirees. Hospital coordination, fast claims, personal service.",
  keywords: [
    "expat health insurance Thailand",
    "Allianz Ayudhya expat",
    "digital nomad insurance Thailand",
    "health insurance Bangkok",
    "foreigner health insurance Thailand",
    "retirement visa insurance Thailand",
    "English speaking insurance agent Thailand",
  ],
  authors: [{ name: "Tonkla", url: BASE }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE,
    siteName: "CoverCare Thailand",
    title: "CoverCare Thailand — Expat Health Insurance Advisor",
    description:
      "English-speaking health insurance advisor in Thailand. Allianz Ayudhya plans for expats, digital nomads, and retirees.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CoverCare Thailand" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoverCare Thailand — Expat Health Insurance",
    description: "English-speaking health insurance advisor in Thailand.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
