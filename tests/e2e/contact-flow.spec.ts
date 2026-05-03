import { test, expect } from "@playwright/test"

test.describe("Contact form golden path", () => {
  test("user completes 3-step form successfully", async ({ page }) => {
    await page.goto("/")

    // Scroll to contact section
    await page.locator("#contact").scrollIntoViewIfNeeded()

    // Step 1: Select segment
    await page.getByText("Digital Nomad / Freelancer").click()
    await page.getByRole("button", { name: "Continue →" }).click()

    // Step 2: Select needs
    await page.getByText("English-speaking agent").click()
    await page.getByText("Hospital coordination support").click()
    await page.getByRole("button", { name: "Continue →" }).click()

    // Step 3: Fill contact details
    await page.getByPlaceholder("Your name").fill("Test User")
    await page.getByPlaceholder("you@email.com").fill("test@example.com")
    await page.getByPlaceholder("+66 or your country code").fill("+66812345678")
    await page.getByRole("button", { name: /Get My Free Quote/i }).click()

    // Success state
    await expect(page.getByText("Thank you!")).toBeVisible({ timeout: 5000 })
  })

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/")
    await page.locator("#contact").scrollIntoViewIfNeeded()
    await page.getByRole("button", { name: "Continue →" }).click()
    // Should show error — segment not selected
    await expect(page.getByText(/Please select/i)).toBeVisible()
  })

  test("WhatsApp floating button has correct href", async ({ page }) => {
    await page.goto("/")
    const btn = page.locator('a[href*="wa.me/66611965363"]').first()
    await expect(btn).toBeVisible()
  })
})
