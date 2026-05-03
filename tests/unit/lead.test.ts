import { describe, it, expect } from "vitest"
import { scoreLead } from "@/types/lead"

describe("scoreLead", () => {
  it("gives highest score to corporate segment with many needs", () => {
    const score = scoreLead("corporate", ["Fast claims assistance", "English-speaking agent"])
    expect(score).toBeGreaterThan(60)
  })

  it("adds urgency bonus for fast claims need", () => {
    const withUrgency = scoreLead("tech", ["Fast claims assistance"])
    const withoutUrgency = scoreLead("tech", ["English-speaking agent"])
    expect(withUrgency).toBeGreaterThan(withoutUrgency)
  })

  it("caps score at 100", () => {
    const score = scoreLead("corporate", [
      "Fast claims assistance",
      "English-speaking agent",
      "Hospital coordination support",
      "Finding the right plan",
      "Understanding my current coverage",
      "Adding family members",
    ])
    expect(score).toBeLessThanOrEqual(100)
  })

  it("gives non-zero score for all segments", () => {
    const segments = ["corporate", "nomad", "tech", "retiree"] as const
    for (const seg of segments) {
      expect(scoreLead(seg, ["English-speaking agent"])).toBeGreaterThan(0)
    }
  })
})
