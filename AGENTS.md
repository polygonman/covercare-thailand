<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Agent Rules — CoverCare Thailand

## Tailwind CSS v4

There is **no `tailwind.config.js`**. Design tokens live in `app/globals.css` under `@theme inline`. Add new color, font, or spacing tokens there, not in a config file.

Font CSS variables (`--font-inter`, `--font-jakarta`) are injected by `next/font/google` at runtime — reference them via `@theme inline` or raw `var()` in CSS. Never use `@import url(...)` for fonts.

## Fonts

Two fonts are loaded in `app/layout.tsx` via `next/font/google`:
- `Inter` — body font, applied as `inter.className` on `<body>`
- `Plus_Jakarta_Sans` — display/heading font, applied via `--font-jakarta` CSS variable, targeted globally in `globals.css` on `h1`–`h6`

Both font variables are applied to `<html>` so they cascade.

## Icons

**No emojis as structural icons.** Use Lucide React throughout (`lucide-react` is already installed). Pick semantically appropriate icons; keep stroke style consistent across the product.

## Section Anchors

These must be preserved on the homepage exactly as written — navigation and E2E tests depend on them:

| Anchor | Component |
|---|---|
| `#segments` | `WhoWeHelp` |
| `#services` | `Services` |
| `#contact` | `ContactSection` |
| `#faq` | `FAQ` |

## Test-Sensitive Files

**Read `tests/` before editing these:**

- `components/FAQ.tsx` — Vitest asserts `aria-expanded` on the button wrapping "Do I need a work permit", and the answer text "No. Allianz Ayudhya plans"
- `components/ContactForm.tsx` — Playwright asserts exact text on segment buttons ("Digital Nomad / Freelancer"), needs checkboxes ("English-speaking agent", "Hospital coordination support"), input placeholders ("Your name", "you@email.com", "+66 or your country code"), submit button ("Get My Free Quote"), success heading ("Thank you!"), and error text ("Please select")
- `components/FloatingCTA.tsx` — Playwright asserts `a[href*="wa.me/66611965363"]` is visible

## Design Tokens — Quick Reference

| Role | Class |
|---|---|
| Primary CTA | `bg-teal-700 hover:bg-teal-800` |
| Primary text | `text-slate-900` |
| Muted text | `text-slate-500` |
| Alt section bg | `bg-slate-50` |
| Card | `bg-white rounded-2xl border border-slate-100 shadow-sm` |
| Card hover | `hover:shadow-md hover:border-teal-100` |
| Icon container | `bg-teal-50 border border-teal-100 rounded-xl` |
| Icon color | `text-teal-700` |
| Section padding | `py-20` |
| Heading | `text-3xl md:text-4xl font-bold text-slate-900` |
