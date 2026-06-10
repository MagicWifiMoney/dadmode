# Cleanup Report — DadMode

One-time cleanup pass on branch `claude-cleanup`.

Baseline checks were run first and **already passed**, so no fix was needed for
them: `npm ci` installs cleanly, `npm run build` succeeds, `npm run lint` reports
0 problems, `npx tsc --noEmit` is clean, and `npm test` passes (29 tests). The
items below are what this pass changed on top of that, what it couldn't fix, and
what it deliberately left alone.

## FIXED

- Rewrote the README so structure and scripts match reality (added the `lib/` modules, the `test` script, the generated `robots.ts`/`sitemap.ts`, and the CI note).
- Added a generated `robots.txt` (`src/app/robots.ts`) that allows crawling and points at the sitemap — previously missing.
- Added a generated `sitemap.xml` (`src/app/sitemap.ts`) listing the homepage — previously missing.
- Added a canonical tag (`alternates.canonical`) — previously missing.
- Added Organization JSON-LD to the homepage — previously missing.
- Trimmed the meta description from 161 to 147 characters (under the 160 limit).
- Fixed heading hierarchy: the brand mark is now a single `<h1>` per view with logical `h1 → h2 → h3` order (it was a `<div>`, so pages had no H1).
- Centralized site metadata (title/description/URL) in `src/lib/site.ts` so the page, sitemap, and robots agree.
- Used a stable content-update date for the sitemap `<lastmod>` instead of a build-time timestamp (prevents crawlers from ignoring the tag).

## BLOCKED

- **Production public URL returns 404.** Every Vercel production alias (`dadmode-giebz.vercel.app`, `dadmode-git-main-giebz.vercel.app`) 404s because no production deployment exists — the project only ever built *preview* deploys for PR branches. This is a Vercel dashboard setting, not a repo problem, so it cannot be fixed from the code after diagnosis (3 attempts: probed both aliases + inspected repo for deploy config, of which there is none active). **Fix the owner must do:** Vercel → Settings → Git → Production Branch = `main`, then promote/redeploy the latest `main`. Preview deployments work fine, confirming the build itself is healthy.

## SKIPPED

- **Unused default assets** (`public/next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`): leftover from create-next-app and referenced nowhere, but not broken. Left alone to avoid non-essential churn.
- **`dadmode-vercel.json`**: an inert file (not named `vercel.json`, so Vercel ignores it) that rewrites all routes to `/index.html`. It isn't active and nothing breaks, so it was left — but it's worth deleting, since renaming it to `vercel.json` would 404 the whole Next app.
- **`dadmode-index.html`**: the original standalone prototype. Kept intentionally as a reference/offline preview; not part of the Next build.
- **`lucide-react` version (`^1.14.0`)**: looks unusual but installs and builds fine and the icons render — not broken, so not touched.
- **Rate limiter is per-instance/best-effort**: a known limitation (documented in code), not a defect. Left as-is; a shared store (Redis/Upstash) would be a feature, not a fix.
- **No Open Graph / Organization-logo image**: the Twitter card is `summary_large_image` and the Organization schema has no `logo`, because there is no real PNG/SVG brand asset in the repo. Pointing at a placeholder would be a broken reference, so this is left for when a logo exists.

## MARKETING OPPORTUNITIES

*Observations only — nothing in this section was changed.*

### Who this appears to target
- **Audience:** expectant fathers / partners of pregnant women. The voice is "for dads, not doctors" — practical, reassuring, slightly irreverent.
- **Intent:** help a dad feel informed and involved week-by-week, and capture his email so the relationship continues. It behaves like a lead-generation landing app, not a paid product.

### Content gaps (things the product does that no page talks about)
- **The best content is invisible.** The app has well-written week-by-week material (baby development, what the partner is feeling, a dad tip, and a hormone note for all 40 weeks) — but it only appears *after* a visitor types in a date. None of it is on a crawlable page, so search engines and first-time visitors never see the thing that makes the app good.
- **No trust/utility pages.** There's no About, FAQ, or Privacy Policy. Since the app collects email addresses, a privacy page is effectively table stakes.
- **The "hormone radar" angle is a real differentiator** (explaining mood shifts biologically so dads don't take them personally) and appears nowhere a prospect would find it before signing up.

### Thin pages that probably can't rank
- There is effectively **one page** (`/`), and to a crawler it's nearly empty — the server-rendered HTML is just the onboarding screen ("enter a date"). All the substance is client-rendered after interaction, so the site can't rank for high-intent queries like "12 weeks pregnant" despite having great content for them.

### Lead capture — where it is and where it's missing
- **It exists**, but only on the **dashboard, after** a visitor has already entered a date. A brand-new visitor on the landing screen sees **no email field and no call-to-action at all.**
- The form promises "weekly dad tips in your inbox," but the backend sends only a **single welcome email** — the recurring series that earns the signup isn't built yet.

### Micro-SaaS readiness
- **Pricing:** none — it's free / lead-gen. Fine model, but no page explains the value or why to hand over an email.
- **Features:** no features or "how it works" section to read before committing.
- **Signup path:** "signup" = entering a date, stored only in the browser (`localStorage`). No account means no cross-device continuity and no retention hook beyond that one email.

### Quick wins, ranked by effort (plain English)
1. **(Minutes)** Set the real production domain so SEO tags, the sitemap, and share links point at the live site instead of a placeholder.
2. **(Minutes)** Put an email signup on the **first** screen, not just after a date is entered — most visitors never reach the screen that currently has it.
3. **(An hour)** Add a short Privacy Policy / Terms link. You're collecting emails; this builds trust and keeps you compliant.
4. **(An hour)** Add a share image so links shared dad-to-dad (the obvious growth channel) show a real preview instead of bare text.
5. **(A day)** Publish the 40 weeks as real, individually crawlable pages (e.g. `/week/12`). Your week-by-week content is exactly what people search for while pregnant — right now it's locked behind JavaScript.
6. **(A few days)** Actually deliver the weekly email series you promise. Turning the one welcome email into an ongoing 40-week drip is the difference between a bounce and an audience retained for the whole pregnancy.
