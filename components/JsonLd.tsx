export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CoverCare Thailand",
    description:
      "English-speaking health insurance advisor in Thailand. Specialising in Allianz Ayudhya plans for expats, digital nomads, and retirees.",
    url: "https://www.thaicovercare.com",
    telephone: "+66611965363",
    email: "covercareTH@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
      addressLocality: "Bangkok",
    },
    areaServed: "Thailand",
    serviceType: "Health Insurance Advisory",
    priceRange: "Free consultation",
    sameAs: ["https://line.me/ti/p/~@covercareTH"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66611965363",
      contactType: "customer service",
      availableLanguage: ["English", "Thai"],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
