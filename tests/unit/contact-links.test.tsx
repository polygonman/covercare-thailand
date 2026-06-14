import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import WhatsAppLink from "@/components/WhatsAppLink"
import LineLink from "@/components/LineLink"

// Real DOM render + real click through the actual components and the real
// analytics module — verifies the onClick → gtag path end to end (jsdom).
const gtag = vi.fn()

beforeEach(() => {
  gtag.mockClear()
  ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
})

describe("WhatsAppLink", () => {
  it("renders an external anchor with the wa.me href", () => {
    render(
      <WhatsAppLink source="hero" href="https://wa.me/66611965363?text=hi">
        Chat
      </WhatsAppLink>
    )
    const link = screen.getByText("Chat").closest("a")!
    expect(link.getAttribute("href")).toContain("wa.me/66611965363")
    expect(link.getAttribute("target")).toBe("_blank")
    expect(link.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("fires whatsapp_clicked + generate_lead on real click", () => {
    render(
      <WhatsAppLink source="hero" href="https://wa.me/66611965363">
        Chat
      </WhatsAppLink>
    )
    fireEvent.click(screen.getByText("Chat"))
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_clicked", { source: "hero" })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      method: "whatsapp",
      source: "hero",
    })
  })
})

describe("LineLink", () => {
  it("fires line_clicked + generate_lead on real click", () => {
    render(
      <LineLink source="footer" href="https://line.me/ti/p/~@covercareTH">
        LINE
      </LineLink>
    )
    fireEvent.click(screen.getByText("LINE"))
    expect(gtag).toHaveBeenCalledWith("event", "line_clicked", { source: "footer" })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      method: "line",
      source: "footer",
    })
  })
})
