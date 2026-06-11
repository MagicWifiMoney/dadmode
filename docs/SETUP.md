# DadMode — Go-Live Setup

The app already runs and deploys without any of this (it degrades gracefully).
This is the ~15 minutes to switch on **leads + payments + admin**. Only three
things are unavoidably yours: create the accounts, grab the keys, and paste the
env vars into Vercel. The fiddly parts are automated below.

> Current production URL: **https://dadmode-giebz.vercel.app**
> Welcome email is intentionally deferred — see [Add email later](#add-email-later).

---

## 1. Supabase — leads + Pro entitlements

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste all of [`supabase/setup.sql`](../supabase/setup.sql), and **Run**.
   (One paste; safe to re-run.)
3. **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY` *(server-side only)*

## 2. Stripe — DadMode Pro (one command)

1. Create an account at [stripe.com](https://stripe.com). Leave it in **Test mode** (toggle, top-right).
2. **Developers → API keys** → copy the **Secret key** (`sk_test_...`).
3. Run the provisioning script — it creates both prices **and** the webhook, then
   prints the env vars:

   ```bash
   STRIPE_SECRET_KEY=sk_test_xxx npm run setup:stripe
   ```

   Copy the `STRIPE_PRICE_PASS`, `STRIPE_PRICE_MONTHLY`, and `STRIPE_WEBHOOK_SECRET`
   it prints. That's it — no clicking around the Stripe dashboard.
4. **Test the loop:** after deploying with these vars, open `/pricing`, pay with
   test card `4242 4242 4242 4242` (any future expiry/CVC) → you land on `/welcome`,
   Pro unlocks, and a row appears in `/admin`.

## 3. Admin dashboard

Pick any long random secret for `ADMIN_TOKEN`. A freshly generated one you can use:

```
ADMIN_TOKEN=f72a17c590df80025a3ae9e80b6e5c8fb4e18a15fdf2684525c26dd67ef3af2b
```

(Regenerate anytime with `openssl rand -hex 32`.) Then open `/admin` and paste it in.

## 4. Paste into Vercel

Project → **Settings → Environment Variables** → add these (Production), then redeploy:

```
NEXT_PUBLIC_SITE_URL=https://dadmode-giebz.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...                 # service_role
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_PASS=price_...                       # from the script
STRIPE_PRICE_MONTHLY=price_...                     # from the script
STRIPE_WEBHOOK_SECRET=whsec_...                    # from the script
ADMIN_TOKEN=f72a17c590df80025a3ae9e80b6e5c8fb4e18a15fdf2684525c26dd67ef3af2b
```

---

## Going live (real charges)

When the test purchase works: flip Stripe to **Live mode**, copy the live
**Secret key** (`sk_live_...`), and re-run the script with it —

```bash
STRIPE_SECRET_KEY=sk_live_xxx npm run setup:stripe
```

— then swap the four `STRIPE_*` values in Vercel for the live ones and redeploy.

## Add email later

The welcome email is off until you set these (signups still save to Supabase
without it):

1. [resend.com](https://resend.com) → add & **verify your sending domain** (DNS).
2. Create an API key.
3. Add to Vercel:
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM=DadMode <hello@yourdomain.com>     # on your verified domain
   ```

## Checklist

- [ ] `supabase/setup.sql` run in Supabase
- [ ] Supabase URL + service_role key in Vercel
- [ ] `npm run setup:stripe` run; PRICE_* + WEBHOOK_SECRET in Vercel
- [ ] `STRIPE_SECRET_KEY` in Vercel
- [ ] `ADMIN_TOKEN` in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set
- [ ] Redeployed, then test purchase with `4242` card
- [ ] *(later)* Resend domain verified + `RESEND_API_KEY` / `EMAIL_FROM` set
