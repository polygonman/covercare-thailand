# CoverCare Thailand

**English-speaking health insurance advisor in Thailand** — specialising in Allianz Ayudhya plans for expats, digital nomads, and retirees.

🌐 **Live site:** https://www.thaicovercare.com  
📱 **WhatsApp:** +66 61 196 5363  
📧 **Email:** covercareTH@gmail.com

---

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Email:** Resend
- **Testing:** Vitest + Playwright
- **Deployment:** Netlify (auto-deploy from `main`)

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/covercare-thailand.git
cd covercare-thailand

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# → Edit .env.local and add your RESEND_API_KEY

# Start dev server
npm run dev
# → Open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (production) | Email API key from [resend.com](https://resend.com) |
| `NETLIFY_AUTH_TOKEN` | CI only | From Netlify user settings |
| `NETLIFY_SITE_ID` | CI only | From your Netlify site settings |

Without `RESEND_API_KEY`, form submissions are logged to the console (useful for local dev).

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint check
npm run test       # Vitest unit tests (watch mode)
npm run test:ci    # Vitest (single run, for CI)
npm run test:e2e   # Playwright E2E tests
npm run test:coverage  # Coverage report
```

---

## Deployment

### Auto-deploy (GitHub → Netlify)

1. Push to `main` → GitHub Actions builds and deploys to Netlify automatically
2. Add these secrets in **GitHub → Settings → Secrets → Actions:**
   - `RESEND_API_KEY`
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

### Manual Netlify deploy

```bash
npm run build
npx netlify-cli deploy --dir=.next --prod
```

---

## Project Structure

```
covercare-thailand/
├── app/
│   ├── page.tsx          # Home / landing page
│   ├── about/page.tsx    # About Tonkla
│   ├── services/page.tsx # Services & plan overview
│   ├── contact/page.tsx  # Contact page
│   ├── blog/page.tsx     # Resources / articles
│   └── api/contact/route.ts  # Form API → email
├── components/           # Reusable React components
├── lib/email.ts          # Resend email helpers
├── types/lead.ts         # Lead type + scoring
└── tests/
    ├── unit/             # Vitest unit tests
    └── e2e/              # Playwright E2E tests
```

---

## Contact

**Tonkla** — CoverCare Thailand  
🌐 [www.thaicovercare.com](https://www.thaicovercare.com)  
📱 WhatsApp: +66 61 196 5363  
💬 LINE: @covercareTH
