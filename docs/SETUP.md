# DadMode — Go-Live Setup

Everything below is optional for the app to *run* (it degrades gracefully), but
required to actually **capture leads, send email, take payments, and view the
admin dashboard**. Work top to bottom; each section ends with the env vars it
produces. Put them in Vercel (Project → Settings → Environment Variables) and in
`.env.local` for local dev.

---

## 1. Supabase (leads + Pro entitlements)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run both migrations, in order:
   - `supabase/migrations/0001_init.sql` (the `leads` table)
   - `supabase/migrations/0002_entitlements.sql` (the `entitlements` table)
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY` *(server-side only — never expose it to the browser)*

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # service_role, not anon
```

> RLS is enabled with no policies, so only the service-role key (used by the API
> routes) can read/write these tables. That's intentional.

---

## 2. Resend (welcome email)

1. Create an account at [resend.com](https://resend.com).
2. **Add and verify your sending domain** (Domains → Add). DNS records take a
   few minutes.
3. Create an **API key** (API Keys → Create).
4. In `src/app/api/onboard/route.ts`, set the `from:` address to an address on
   your verified domain (it currently reads `DadMode <hello@jgiebz.com>`).

```
RESEND_API_KEY=re_...
```

Omit the key entirely and signups still save to Supabase — they just don't get
an email.

---

## 3. Stripe (DadMode Pro)

1. Create an account at [stripe.com](https://stripe.com). Use **Test mode**
   first (toggle, top-right) — test card `4242 4242 4242 4242`, any future expiry/CVC.
2. **Create two Prices** (Product catalog → Add product):
   - *DadMode Pro — Whole Pregnancy Pass*: **One-time**, **$29** → copy the
     Price ID (`price_...`) into `STRIPE_PRICE_PASS`.
   - *DadMode Pro — Monthly*: **Recurring / monthly**, **$6** → copy into
     `STRIPE_PRICE_MONTHLY`.
   - *(Optional: skip this and checkout will build an inline price automatically.)*
3. **Secret key**: Developers → API keys → copy **Secret key** → `STRIPE_SECRET_KEY`.
4. **Webhook**: Developers → Webhooks → **Add endpoint**:
   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed` and `customer.subscription.deleted`
   - After saving, copy the **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`.

```
STRIPE_SECRET_KEY=sk_test_...              # sk_live_... when you go live
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PASS=price_...                # optional
STRIPE_PRICE_MONTHLY=price_...             # optional
```

**Test the full loop:** open `/pricing`, buy with the test card → you land on
`/welcome`, Pro unlocks, and a row appears in `entitlements` (check the admin
dashboard). To verify webhooks locally, use the Stripe CLI:
`stripe listen --forward-to localhost:3000/api/stripe/webhook`.

**Going live:** flip Stripe to Live mode, recreate the prices + webhook there,
and swap in the `sk_live_...` / live `whsec_...` values.

---

## 4. Admin dashboard (`/admin`)

Generate a long random secret and set it. Then visit `/admin` and paste it in.

```
ADMIN_TOKEN=$(openssl rand -hex 32)        # any long random string
```

Omit it and `/admin` returns "not configured." The dashboard shows lead counts,
Pro customer counts, and recent rows.

---

## 5. Site URL + demo flag

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # absolute URLs for SEO / OG tags
NEXT_PUBLIC_DADMODE_DEMO=                       # set to 1 ONLY to preview Pro without paying
```

---

## Quick checklist

- [ ] Both Supabase migrations run
- [ ] Supabase URL + service_role key set
- [ ] Resend domain verified, key set, `from:` address updated
- [ ] Stripe prices created, secret key set
- [ ] Stripe webhook endpoint added, signing secret set
- [ ] `ADMIN_TOKEN` set
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] Test purchase completed with the `4242` card
