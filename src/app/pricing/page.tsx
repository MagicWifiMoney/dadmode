import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CheckoutButtons from '@/components/CheckoutButtons';
import RestoreAccess from '@/components/RestoreAccess';
import { FREE_FEATURES, PRO_FEATURES } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'Pricing — Go Pro',
  description:
    'DadMode is free to track week-by-week. Go Pro for the dad toolkit: hospital bag checklist, kick counter, contraction timer, baby name studio and more. $29 for the whole pregnancy.',
  alternates: { canonical: '/pricing' },
};

const faqs: { q: string; a: string }[] = [
  {
    q: 'What do I actually get with Pro?',
    a: 'The full dad toolkit — hospital bag checklist, kick counter, contraction timer with the 5-1-1 rule, baby name studio, appointment tracker, and week-by-week “what to say” scripts. Plus everything in the free tracker.',
  },
  {
    q: 'Is the Pass really one payment?',
    a: 'Yes. The Whole Pregnancy Pass is a single $29 payment that unlocks everything through the birth. No subscription, no surprise renewals.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Absolutely. If it’s not useful, email us within 7 days for a full refund — no questions asked.',
  },
  {
    q: 'I bought it but I’m on a new phone. Help?',
    a: 'Use “Restore access” below with the email you checked out with and Pro re-unlocks instantly.',
  },
];

export default function PricingPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="marketing-main">
        <section className="pricing-hero">
          <span className="eyebrow">Simple pricing</span>
          <h1>Be the dad who’s actually ready.</h1>
          <p className="lede">
            The tracker is free, forever. Go Pro once and get every tool you’ll reach for between
            the first test and the drive home from the hospital.
          </p>
        </section>

        <section className="pricing-section">
          <CheckoutButtons />
        </section>

        <section className="compare">
          <div className="compare-col">
            <h2>Free</h2>
            <ul className="feature-list">
              {FREE_FEATURES.map((f) => (
                <li key={f}><span className="tick">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/" className="btn-secondary compare-cta">Start free</Link>
          </div>
          <div className="compare-col pro">
            <h2>Pro <span className="pro-pill">Everything in Free, plus</span></h2>
            <ul className="feature-list">
              {PRO_FEATURES.map((f) => (
                <li key={f.title}>
                  <span className="tick">✓</span>
                  <span><strong>{f.title}</strong> — {f.desc}</span>
                </li>
              ))}
            </ul>
            <Link href="#top" className="btn-primary compare-cta">Go Pro — $29</Link>
          </div>
        </section>

        <section className="faq">
          <h2>Questions</h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <div key={f.q} className="faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
          <div className="restore-wrap">
            <RestoreAccess />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
