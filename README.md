# DadMode 🍼

A mobile-first pregnancy companion **built for dads**. Enter your partner's last
period or due date and DadMode shows you where you are week-by-week: what's
happening with the baby, what she's likely experiencing, a practical "dad tip,"
and a plain-language note on the hormonal shifts behind it all — plus a 40-week
timeline you can tap through.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **[Supabase](https://supabase.com)** — stores email leads
- **[Resend](https://resend.com)** — sends the welcome email
- **[lucide-react](https://lucide.dev)** — icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Email capture is optional in development — the app runs without it, and the API
route degrades gracefully when keys are absent. To enable it, create a
`.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...      # server-side only
RESEND_API_KEY=...                 # omit to skip sending the welcome email
```

The onboard endpoint upserts into a Supabase table named `leads`
(`email` text unique, `due_date` timestamptz nullable).

## Project structure

```
src/
  app/
    page.tsx              # the whole UI: onboarding + dashboard (client component)
    data.ts              # WeekData type + the 40-week content
    layout.tsx           # root layout, metadata, fonts
    globals.css          # design system (navy/gold theme)
    api/onboard/route.ts # POST: save lead to Supabase + send welcome email
  lib/
    supabase.ts          # Supabase client
```

`dadmode-index.html` is the original standalone prototype, kept for reference.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new). Set the environment
variables above in the project settings.
