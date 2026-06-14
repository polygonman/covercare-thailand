import { test, expect } from "@playwright/test"

/**
 * Runtime analytics verification in a real browser.
 *
 * We stub `window.gtag` before any app code runs and record every call, so we
 * can prove the real click handlers fire the right GA4 events end to end —
 * without needing a live GA property or network. Run on your machine:
 *
 *   npx playwright test tests/e2e/analytics.spec.ts
 */

type GaCall = [string, string, Record<string, unknown>?]

test.beforeEach(async ({ context }) => {
  // Capture gtag calls; define before navigation so app code uses our stub.
  await context.addInitScript(() => {
    ;(window as unknown as { __ga: unknown[][] }).__ga = []
    ;(window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...args) =>
      (window as unknown as { __ga: unknown[][] }).__ga.push(args)
  })
  // WhatsApp/LINE links open a new tab — close popups so the test doesn't hang.
  context.on("page", (p) => p.close().catch(() => {}))
})

async function gaCalls(page: import("@playwright/test").Page): Promise<GaCall[]> {
  return page.evaluate(() => (window as unknown as { __ga: GaCall[] }).__ga)
}

test("page_view fires on load with GA4-native params", async ({ page }) => {
  await page.goto("/")
  await expect.poll(async () => (await gaCalls(page)).some((c) => c[1] === "page_view")).toBe(true)
  const pv = (await gaCalls(page)).find((c) => c[1] === "page_view")!
  expect(pv[2]).toHaveProperty("page_location")
  expect(pv[2]).toHaveProperty("page_title")
})

test("WhatsApp click fires whatsapp_clicked + generate_lead", async ({ page }) => {
  await page.goto("/")
  await page.locator('a[href*="wa.me/66611965363"]').first().click()
  await expect
    .poll(async () =>
      (await gaCalls(page)).some((c) => c[1] === "generate_lead" && c[2]?.method === "whatsapp")
    )
    .toBe(true)
  expect((await gaCalls(page)).some((c) => c[1] === "whatsapp_clicked")).toBe(true)
})

test("LINE click fires line_clicked + generate_lead", async ({ page }) => {
  await page.goto("/")
  await page.locator('a[href*="line.me"]').first().click()
  await expect
    .poll(async () =>
      (await gaCalls(page)).some((c) => c[1] === "generate_lead" && c[2]?.method === "line")
    )
    .toBe(true)
  expect((await gaCalls(page)).some((c) => c[1] === "line_clicked")).toBe(true)
})

test("contact form submit fires generate_lead", async ({ page }) => {
  await page.goto("/")
  await page.locator("#contact").scrollIntoViewIfNeeded()
  await page.getByText("Digital Nomad / Freelancer").click()
  await page.getByRole("button", { name: "Continue →" }).click()
  await page.getByText("English-speaking agent").click()
  await page.getByRole("button", { name: "Continue →" }).click()
  await page.getByPlaceholder("Your name").fill("Test User")
  await page.getByPlaceholder("you@email.com").fill("test@example.com")
  await page.getByPlaceholder("+66 or your country code").fill("+66812345678")
  await page.getByRole("button", { name: /Get My Free Quote/i }).click()
  await expect(page.getByText("Thank you!")).toBeVisible({ timeout: 10000 })
  await expect
    .poll(async () =>
      (await gaCalls(page)).some((c) => c[1] === "generate_lead" && c[2]?.method === "contact_form")
    )
    .toBe(true)
})
