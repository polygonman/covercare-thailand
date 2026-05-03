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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posthog?: any
  }
}

type EventProperties = Record<string, string | number | boolean | null | undefined>

export function track(event: string, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return

  // PostHog
  try {
    window.posthog?.capture(event, properties)
  } catch {
    // silently ignore
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
export const Analytics = {
  formStarted: () => track("form_started"),
  formCompleted: (score: number) => track("form_completed", { score }),
  guideDownloaded: () => track("guide_downloaded"),
  whatsappClicked: (source: string) => track("whatsapp_clicked", { source }),
  lineClicked: (source: string) => track("line_clicked", { source }),
  calendlyOpened: () => track("calendly_opened"),
  blogArticleRead: (slug: string) => track("blog_article_read", { slug }),
}
