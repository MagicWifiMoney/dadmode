import Link from 'next/link';

/** Shared top bar for the marketing/secondary pages (pricing, welcome, toolkit,
 *  per-week). The home route renders its own app chrome instead. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-wordmark">Dad<span>Mode</span></Link>
      <nav className="site-nav" aria-label="Primary">
        <Link href="/toolkit">Toolkit</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/pricing" className="nav-cta">Go Pro</Link>
      </nav>
    </header>
  );
}
