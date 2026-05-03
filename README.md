# CoverCare Thailand

**English-speaking health insurance advisor in Thailand** — specialising in Allianz Ayudhya plans for expats, digital nomads, and retirees.

- **Live site:** https://www.thaicovercare.com
- **WhatsApp:** +66 61 196 5363
- **Email:** covercareTH@gmail.com

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Fonts | Plus Jakarta Sans (headings) + Inter (body) via `next/font/google` |
| Forms | React Hook Form + Zod |
| Email | Resend |
| CRM | Notion (lead capture via API) |
| Analytics | Google Analytics 4 + PostHog |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deployment | Netlify (auto-deploy from `main`) |

---

## Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/covercare-thailand.git
cd covercare-thailand
npm install

cp .env.example .env.local
# Edit .env.local — see Environment Variables below

npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (production) | Email API from [resend.com](https://resend.com) |
| `NOTION_TOKEN` | Yes (production) | Notion integration token for CRM |
| `NOTION_DATABASE_ID` | Yes (production) | Notion database ID for lead storage |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | PostHog instance host |
| `NETLIFY_AUTH_TOKEN` | CI only | From Netlify user settings |
| `NETLIFY_SITE_ID` | CI only | From your Netlify site settings |

Without `RESEND_API_KEY`, form submissions are logged to the console (useful for local dev).

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Vitest unit tests (watch mode)
npm run test:ci      # Vitest (single run, for CI)
npm run test:e2e     # Playwright E2E tests
npm run test:coverage  # Coverage report
```

---

## Project Structure

```
covercare-thailand/
├── app/
│   ├── page.tsx              # Home / landing page
│   ├── about/page.tsx        # About Tonkla
│   ├── services/page.tsx     # Services & plan overview
│   ├── contact/page.tsx      # Contact page with Calendly embed
│   ├── blog/page.tsx         # Resources / articles index
│   ├── blog/[slug]/page.tsx  # Individual article
│   ├── guide/page.tsx        # Lead magnet — free PDF guide
│   ├── globals.css           # Design tokens + Tailwind v4 theme
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # Robots.txt
│   └── api/contact/route.ts  # Form submission → Resend + Notion
├── components/
│   ├── Navbar.tsx            # Sticky navigation with mobile menu
│   ├── Hero.tsx              # Above-fold hero with trust stats
│   ├── TrustBar.tsx          # Authority strip below hero
│   ├── WhoWeHelp.tsx         # Audience segment cards
│   ├── Services.tsx          # Service offering cards
│   ├── HowItWorks.tsx        # 3-step process timeline
│   ├── GuideBanner.tsx       # Lead magnet CTA banner
│   ├── Testimonials.tsx      # Client reviews with avatars
│   ├── FAQ.tsx               # Accordion FAQ
│   ├── ContactSection.tsx    # Contact form + channel links
│   ├── ContactForm.tsx       # 3-step multi-part lead form
│   ├── CalendlyEmbed.tsx     # Inline Calendly booking
│   ├── FloatingCTA.tsx       # Sticky WhatsApp button
│   ├── Footer.tsx            # Site footer
│   ├── GuideBanner.tsx       # Lead magnet section
│   ├── GuideForm.tsx         # PDF guide request form
│   ├── JsonLd.tsx            # JSON-LD structured data
│   ├── PageViewTracker.tsx   # PostHog page view events
│   └── PostHogProvider.tsx   # PostHog client wrapper
├── lib/
│   ├── analytics.ts          # GA4 + PostHog event helpers
│   ├── articles.ts           # Blog article data
│   ├── email.ts              # Resend email helpers
│   └── notion.ts             # Notion CRM integration
├── types/
│   └── lead.ts               # Lead type, segment labels, scoring
└── tests/
    ├── unit/                 # Vitest unit tests
    └── e2e/                  # Playwright E2E tests
```

---

## Design System

**Style:** Trust & Authority (professional insurance advisory pattern)

**Fonts:**
- Headings: Plus Jakarta Sans (weights 400–800)
- Body: Inter

**Color palette (Tailwind v4 tokens in `app/globals.css`):**

| Role | Tailwind Class | Hex |
|---|---|---|
| Primary / CTAs | `teal-700` | `#0F766E` |
| Primary dark (hover) | `teal-800` | `#0D6B63` |
| Body text | `slate-900` | `#0F172A` |
| Muted text | `slate-500` | `#64748B` |
| Section bg (alt) | `slate-50` | `#F8FAFC` |
| Card border | `slate-100` | `#F1F5F9` |
| Trust teal bar | `teal-700` | `#0F766E` |
| Footer bg | `slate-900` | `#0F172A` |
| WhatsApp | `green-500` | `#22C55E` |

**Rules:**
- No emojis as icons — use Lucide React SVG icons throughout
- Card pattern: `bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100`
- Icon containers: `bg-teal-50 border border-teal-100 rounded-xl` with `text-teal-700` icon
- Section rhythm: `py-20` standard, headings `text-3xl md:text-4xl font-bold text-slate-900`

---

## Key Constraints for AI Agents

- **Section anchors** — never remove: `#segments`, `#services`, `#contact`, `#faq`
- **Test selectors** — `ContactForm.tsx` and `FAQ.tsx` have Playwright/Vitest tests that query exact button text, placeholder strings, and `aria-expanded`. Read `tests/` before editing these components.
- **WhatsApp href** — `wa.me/66611965363` must remain on `FloatingCTA` (E2E test asserts it)
- **Font loading** — use `next/font/google` only, never `@import url(...)` in CSS
- **Tailwind v4** — no `tailwind.config.js`; tokens live in `globals.css` under `@theme inline`

---

## Deployment

Auto-deploys on push to `main` via GitHub Actions → Netlify.

Add these secrets in **GitHub → Settings → Secrets → Actions:**
- `RESEND_API_KEY`
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

---

## Contact

**Tonkla** — CoverCare Thailand
- [www.thaicovercare.com](https://www.thaicovercare.com)
- WhatsApp: +66 61 196 5363
- LINE: @covercareTH
