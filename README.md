# DadMode

A mobile-first pregnancy companion **built for dads**. Enter your partner's last
period or due date and DadMode shows you where you are week-by-week: what's
happening with the baby, what she's likely experiencing, a practical "dad tip,"
the hormonal shifts behind it all, what to actually *do* that week, and the next
medical appointment to plan for — plus a 40-week timeline you can tap through.

DadMode is a **freemium product**:

- **Free** — the full week-by-week tracker, per-week guides, and weekly email tips.
- **Pro** — the dad toolkit: a hospital-bag checklist, kick counter, contraction
  timer (with the 5-1-1 rule), and a baby-name studio. **$29 one-time** "Whole
  Pregnancy Pass" or **$6/mo**, via Stripe Checkout.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **[Supabase](https://supabase.com)** — email leads + Pro entitlements
- **[Stripe](https://stripe.com)** — Checkout + webhooks for Pro
- **[Resend](https://resend.com)** — welcome email
- **[lucide-react](https://lucide.dev)** — icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Everything degrades gracefully without keys: the tracker works fully, and the
checkout/email routes return friendly "not configured" responses instead of
erroring. To preview the Pro toolkit locally without paying, build/run with
`NEXT_PUBLIC_DADMODE_DEMO=1`.

## Environment variables

For a full step-by-step go-live walkthrough (Supabase, Resend, Stripe, admin),
see **[`docs/SETUP.md`](./docs/SETUP.md)**.

See [`.env.example`](./.env.example) for the full list. Copy it to `.env.local`:

```bash
# Supabase — leads + entitlements
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...      # server-side only

# Resend — welcome email (omit to skip)
RESEND_API_KEY=...

# Stripe — DadMode Pro (omit STRIPE_SECRET_KEY to disable checkout cleanly)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...          # for /api/stripe/webhook
STRIPE_PRICE_PASS=...              # optional; falls back to an inline price
STRIPE_PRICE_MONTHLY=...           # optional
```

Run the SQL in `supabase/migrations/` to create the `leads` and `entitlements`
tables. Point a Stripe webhook at `/api/stripe/webhook` for the
`checkout.session.completed` and `customer.subscription.deleted` events.

### How Pro unlocks

1. `/pricing` → `POST /api/checkout` creates a Stripe Checkout Session and
   redirects to Stripe.
2. On success Stripe returns to `/welcome?session_id=…`, which verifies the
   session server-side (`GET /api/entitlement`) before unlocking Pro on-device.
3. The Stripe **webhook** records the purchase in the `entitlements` table, so
   `POST /api/entitlement` can "restore access" by email on any device.

## Project structure

```
src/
  app/
    page.tsx                  # onboarding + dashboard (client)
    data.ts                   # WeekData type + the 40-week content
    layout.tsx                # root layout, metadata, fonts, JSON-LD
    globals.css               # design system (navy/gold theme)
    robots.ts / sitemap.ts    # generated SEO files
    pricing/                  # marketing + plan checkout
    welcome/                  # post-purchase unlock flow
    toolkit/                  # the Pro toolkit (gated): bag, kicks, contractions, names
    week/[week]/              # 40 statically-generated per-week SEO pages
    api/
      onboard/route.ts        # save lead + send welcome email
      checkout/route.ts       # create Stripe Checkout Session
      stripe/webhook/route.ts # record entitlement on payment
      entitlement/route.ts    # verify session / restore access by email
  components/                 # shared UI (header, footer, checkout, restore)
  lib/
    pregnancy.ts              # pure date/week/trimester logic (tested)
    tools.ts                  # kick/contraction/name logic (tested)
    content.ts                # appointments, to-dos, partner scripts (tested)
    plans.ts                  # plan catalog (tested)
    stripe.ts / entitlement.ts# Stripe client + Pro entitlement helpers
    supabase.ts / site.ts / rateLimit.ts
```

Tests live next to the code they cover (`src/**/*.test.ts`), run with Vitest.
`.github/workflows/ci.yml` runs lint, type-check, tests, and build on every PR.
`dadmode-index.html` is the original standalone prototype, kept for reference.

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm start`     | Serve the production build        |
| `npm run lint`  | Run ESLint                        |
| `npm test`      | Run the Vitest unit-test suite    |
| `npm run setup:stripe` | Provision Stripe prices + webhook (see `docs/SETUP.md`) |

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new). Set the environment
variables above in project settings, then add a Stripe webhook pointing at
`https://<your-domain>/api/stripe/webhook`.
