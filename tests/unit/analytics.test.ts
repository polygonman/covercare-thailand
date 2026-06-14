import { describe, it, expect, beforeEach, vi } from "vitest"

// These tests focus on the GA4 (gtag) path — the one responsible for GA's
// "Generate leads" report. PostHog delivery is exercised in the running app;
// it's reached via a runtime require() that a module mock can't intercept here.
import { track, Analytics } from "@/lib/analytics"

const gtag = vi.fn()

beforeEach(() => {
  gtag.mockClear()
  ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
})

describe("track()", () => {
  it("sends a custom event to GA4", () => {
    track("form_started")
    expect(gtag).toHaveBeenCalledWith("event", "form_started", {})
  })

  it("maps $pageview to GA4 page_view with native page_location/page_title", () => {
    track("$pageview", { $current_url: "/blog/x" })
    expect(gtag).toHaveBeenCalledWith("event", "page_view", {
      page_location: window.location.origin + "/blog/x",
      page_title: document.title,
    })
  })

  it("does not throw when gtag is absent", () => {
    delete (window as unknown as { gtag?: unknown }).gtag
    expect(() => track("form_started")).not.toThrow()
  })
})

describe("lead events", () => {
  it("whatsappClicked fires whatsapp_clicked AND GA4 generate_lead", () => {
    Analytics.whatsappClicked("hero")
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_clicked", { source: "hero" })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      method: "whatsapp",
      source: "hero",
    })
  })

  it("formCompleted fires form_completed AND generate_lead with score", () => {
    Analytics.formCompleted(75)
    expect(gtag).toHaveBeenCalledWith("event", "form_completed", { score: 75 })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      method: "contact_form",
      value: 75,
    })
  })

  it("lineClicked fires line_clicked AND generate_lead", () => {
    Analytics.lineClicked("contact_section")
    expect(gtag).toHaveBeenCalledWith("event", "line_clicked", { source: "contact_section" })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      method: "line",
      source: "contact_section",
    })
  })
})

