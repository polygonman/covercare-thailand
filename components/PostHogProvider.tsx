"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return // skip when not configured
    posthog.init(key, {
      // Reverse-proxied through our own domain → bypasses ad blockers
      // /ingest rewrites to us.i.posthog.com via next.config.ts
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,  // handled manually via PageViewTracker
      capture_pageleave: true,
      persistence: "localStorage",
      // Web Vitals (LCP, INP, CLS) for PostHog performance monitoring
      capture_performance: { web_vitals: true },
      // The Netlify rewrite corrupts posthog-js's pre-gzipped request body
      // ("failed to decode request: invalid GZIP data"), silently dropping
      // every event. Send uncompressed JSON instead — the proxy hop doesn't
      // need the client-side compression.
      disable_compression: true,
    })
  }, [])

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return <>{children}</>

  return <PHProvider client={posthog}>{children}</PHProvider>
}
