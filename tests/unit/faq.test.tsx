import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import FAQ from "@/components/FAQ"

describe("FAQ", () => {
  it("renders FAQ questions", () => {
    render(<FAQ />)
    expect(screen.getByText(/Do I need a work permit/i)).toBeInTheDocument()
  })

  it("toggles answer open on click", () => {
    render(<FAQ />)
    const btn = screen.getByText(/Do I need a work permit/i).closest("button")!
    expect(btn).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/No\. Allianz Ayudhya plans/i)).toBeInTheDocument()
  })

  it("collapses on second click", () => {
    render(<FAQ />)
    const btn = screen.getByText(/Do I need a work permit/i).closest("button")!
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "false")
  })
})
