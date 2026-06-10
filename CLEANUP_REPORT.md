# Cleanup Report — DadMode

## Technical SEO pass

Fixes applied (only objectively missing/broken items; no copy or content-strategy
changes):

| Item | Before | After |
| --- | --- | --- |
| `<title>` | Present (34 chars) | Unchanged — already unique & < 60 chars |
| Meta description | 161 chars | Rewritten to 147 chars (< 160) |
| Open Graph tags | Present | Unchanged |
| Twitter card | Present | Unchanged |
| One `<h1>` / heading order | **No `<h1>`** (brand was a `<div>`, card jumped to `<h2>`) | Exactly one `<h1>` per view; `h1 → h2 → h3` order |
| `robots.txt` | **Missing** | Added via `src/app/robots.ts` (allows all, references sitemap) |
| `sitemap.xml` | **Missing** | Added via `src/app/sitemap.ts` |
| Canonical tag | **Missing** | Added (`alternates.canonical`) |
| Organization JSON-LD | **Missing** | Added to the homepage |
| Image alt text | N/A | App uses emoji + decorative SVG icons inside labeled buttons; no `<img>` elements lacking alt |
| Internal links | N/A | Single-page app; no internal links, none broken |

**Action required to finish:** set `NEXT_PUBLIC_SITE_URL` to the real production
domain. Canonical, sitemap, robots, and OG URLs currently fall back to the
`https://dadmode.app` placeholder — if the live domain differs, every page will
canonicalize to a domain you may not own.

**Recommended (out of "broken" scope, not done):** add a branded Open Graph share
image (`app/opengraph-image.tsx`). The Twitter card is `summary_large_image` but
there's no image yet, so shared links render without a preview picture.

---

## MARKETING OPPORTUNITIES

*Observations only — nothing in this section was changed.*

### Who this appears to target
- **Audience:** expectant fathers / partners of pregnant women. The whole voice is
  "for dads, not doctors" — practical, reassuring, slightly irreverent.
- **Intent:** help a dad feel informed and involved week-by-week, and capture his
  email so the relationship continues. It behaves like a lead-generation landing
  app, not a paid product.

### Content gaps (things the product does that no page talks about)
- **The best content is invisible.** The app contains rich, well-written
  week-by-week material (baby development, what the partner is feeling, a dad tip,
  and a hormone note for all 40 weeks) — but it only appears *after* a visitor
  types in a date. None of it is on a crawlable page, so search engines and
  first-time visitors never see the thing that makes this app good.
- **No trust/utility pages.** There's no About, FAQ, or Privacy Policy. Since the
  app collects email addresses, a privacy page is effectively table stakes for
  trust and for email-compliance.
- **The "hormone radar" angle is a real differentiator** (explaining mood shifts
  biologically so dads don't take them personally) and it's mentioned nowhere a
  prospective user would find it before signing up.

### Thin pages that probably can't rank
- There is effectively **one page** (`/`), and to a crawler it's close to empty —
  the server-rendered HTML is just the onboarding screen ("enter a date"). All the
  substance is client-rendered after interaction. So despite having genuinely
  useful content for high-volume queries like "12 weeks pregnant," the site can't
  rank for any of them today.

### Lead capture — where it is and where it's missing
- **It exists**, but only on the **dashboard, after** a visitor has already entered
  a due/period date. A brand-new visitor on the landing screen sees **no email
  field and no call-to-action at all.**
- The form also promises "weekly dad tips in your inbox," but the backend only
  sends a **single welcome email** — there's no evidence of an actual weekly send,
  so the core promise that earns the signup isn't fulfilled yet.

### Micro-SaaS readiness
- **Pricing:** none — it's free / lead-gen. That's a fine model, but there's no
  page explaining what you get or why to give your email.
- **Features:** no features or "how it works" section a prospect can read before
  committing.
- **Signup path:** "signup" = entering a date (stored only in the browser via
  `localStorage`). There's no account, so there's no cross-device continuity and no
  retention hook beyond that one welcome email.

### Quick wins, ranked by effort (plain English)
1. **(Minutes)** Set the real production domain so SEO tags, the sitemap, and share
   links point at the live site instead of a placeholder.
2. **(Minutes)** Put an email signup on the **first** screen, not just after a date
   is entered — most visitors never reach the screen that currently has it.
3. **(An hour)** Add a short Privacy Policy / Terms link. You're collecting emails;
   this builds trust and keeps you compliant.
4. **(An hour)** Add a share image so links shared dad-to-dad (the obvious growth
   channel for this) show a real preview instead of bare text.
5. **(A day)** Publish the 40 weeks as real, individually-crawlable pages
   (e.g. `/week/12`). Your week-by-week content is exactly what people search for
   while pregnant — right now it's locked behind JavaScript.
6. **(A few days)** Actually deliver the weekly email series you promise. Turning a
   one-time welcome email into an ongoing 40-week drip is the difference between a
   bounce and a retained audience for the entire pregnancy.
