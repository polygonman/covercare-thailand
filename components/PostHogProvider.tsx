"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return // skip when not configured
    posthog.init(key, {
      // US PostHog ingestion endpoint — avoids redirect delay from app.posthog.com
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: false,  // handled manually via PageViewTracker
      capture_pageleave: true,
      persistence: "localStorage",
      // Web Vitals (LCP, INP, CLS) for PostHog performance monitoring
      capture_performance: { web_vitals: true },
    })
  }, [])

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return <>{children}</>

  return <PHProvider client={posthog}>{children}</PHProvider>
}
