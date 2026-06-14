/**
 * Thin analytics wrapper — sends events to both PostHog and GA4 (gtag).
 * Import `track` anywhere in client components to record events.
 *
 * Usage:
 *   import { track } from "@/lib/analytics"
 *   track("guide_downloaded", { segment: "nomad" })
 *   track("form_started")
 *   track("whatsapp_clicked")
 */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
  }
}

type EventProperties = Record<string, string | number | boolean | null | undefined>

export function track(event: string, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return

  // PostHog — import directly so it works with the npm-initialized instance
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const posthog = require("posthog-js").default
    if (posthog?.__loaded) posthog.capture(event, properties)
  } catch {
    // silently ignore (SSR / not initialized)
  }

  // GA4
  try {
    if (event === "$pageview") {
      window.gtag?.("event", "page_view", {
        page_path: properties.$current_url ?? window.location.pathname,
      })
    } else {
      window.gtag?.("event", event, properties)
    }
  } catch {
    // silently ignore
  }
}

// Convenience helpers for the most common events
//
// Lead events fire BOTH a descriptive custom event (for source breakdowns in
// PostHog / GA4) and GA4's standard `generate_lead` event. `generate_lead` is
// the event GA4 counts in its "Generate leads" report — without it, leads never
// show up there no matter how many people contact you. Remember to mark
// `generate_lead` as a Key event in GA4 Admin → Events for it to count as a
// conversion.
export const Analytics = {
  formStarted: () => track("form_started"),
  formCompleted: (score: number) => {
    track("form_completed", { score })
    track("generate_lead", { method: "contact_form", value: score })
  },
  guideDownloaded: () => track("guide_downloaded"),
  whatsappClicked: (source: string) => {
    track("whatsapp_clicked", { source })
    track("generate_lead", { method: "whatsapp", source })
  },
  lineClicked: (source: string) => {
    track("line_clicked", { source })
    track("generate_lead", { method: "line", source })
  },
  calendlyOpened: () => track("calendly_opened"),
  blogArticleRead: (slug: string) => track("blog_article_read", { slug }),
}
