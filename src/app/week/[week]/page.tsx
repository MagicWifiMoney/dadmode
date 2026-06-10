import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { weekData } from '@/app/data';
import { trimesterLabel, hormoneClass } from '@/lib/pregnancy';
import { weekTodo, currentAppointment } from '@/lib/content';

// Statically render all 40 week pages at build time.
export function generateStaticParams() {
  return weekData.map((w) => ({ week: String(w.week) }));
}

function parseWeek(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 40 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string }>;
}): Promise<Metadata> {
  const { week } = await params;
  const n = parseWeek(week);
  if (!n) return { title: 'Week not found' };
  const data = weekData[n - 1];
  return {
    title: `Week ${n} of Pregnancy — A Dad's Guide`,
    description: `Week ${n}: baby is ${data.size.toLowerCase()}. What's developing, what your partner is feeling, and exactly what to do this week — written for dads.`,
    alternates: { canonical: `/week/${n}` },
    openGraph: {
      title: `Pregnancy Week ${n} — A Dad's Guide | DadMode`,
      description: `Baby is ${data.size.toLowerCase()}. ${data.dadTip}`,
      type: 'article',
    },
  };
}

export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const n = parseWeek(week);
  if (!n) notFound();

  const data = weekData[n - 1];
  const trimester = trimesterLabel(n);
  const appt = currentAppointment(n);
  const prev = n > 1 ? n - 1 : null;
  const next = n < 40 ? n + 1 : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Pregnancy Week ${n} — A Dad's Guide`,
    about: 'Pregnancy',
    articleSection: trimester,
    description: data.baby,
  };

  return (
    <div className="marketing">
      <SiteHeader />
      <main className="marketing-main week-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
        />

        <nav className="crumb"><Link href="/">Tracker</Link> / Week {n}</nav>

        <header className="week-hero">
          <span className="eyebrow">{trimester}</span>
          <h1>Week {n}</h1>
          <p className="week-size-lead">Baby is about the size of <strong>{data.size.toLowerCase()}</strong>.</p>
        </header>

        <section className="week-block">
          <h2>What’s happening with the baby</h2>
          <p>{data.baby}</p>
        </section>

        <section className="week-block">
          <h2>What your partner is feeling</h2>
          <p>{data.partner}</p>
          <div className="hormone-chip inline">
            <span className={`hormone-level ${hormoneClass(data.hormone.level)}`}>
              {data.hormone.level.replace('-', '/').toUpperCase()}
            </span>
            <span className="hormone-note">{data.hormone.note}</span>
          </div>
        </section>

        <section className="week-block highlight-block">
          <h2>Your dad move this week</h2>
          <p className="dad-tip-text">{data.dadTip}</p>
          <p className="week-todo"><strong>Do this:</strong> {weekTodo(n)}</p>
        </section>

        {appt && (
          <section className="week-block">
            <h2>On the medical radar</h2>
            <p><strong>{appt.title}</strong> (around week {appt.week}). {appt.what}</p>
            <p className="week-ask"><strong>Ask the doctor:</strong> {appt.ask}</p>
          </section>
        )}

        <section className="week-cta">
          <h2>Get the full toolkit</h2>
          <p>Hospital bag checklist, kick counter, contraction timer and more — unlock DadMode Pro.</p>
          <Link href="/pricing" className="btn-primary">See plans</Link>
        </section>

        <nav className="week-nav">
          {prev ? <Link href={`/week/${prev}`}>← Week {prev}</Link> : <span />}
          <Link href="/" className="week-nav-home">Open my tracker</Link>
          {next ? <Link href={`/week/${next}`}>Week {next} →</Link> : <span />}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
