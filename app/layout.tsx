import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Suspense } from "react"
import "./globals.css"
import JsonLd from "@/components/JsonLd"
import PostHogProvider from "@/components/PostHogProvider"
import PageViewTracker from "@/components/PageViewTracker"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

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
  authors: [{ name: "CoverCare Thailand", url: BASE }],
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${geistMono.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <PostHogProvider>
          <JsonLd />
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
