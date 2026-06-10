import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div className="footer-brand">
          <div className="site-wordmark">Dad<span>Mode</span></div>
          <p>The pregnancy app built for dads. Week-by-week, no fluff.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/">Tracker</Link>
          <Link href="/toolkit">Toolkit</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/week/20">Week 20</Link>
        </nav>
      </div>
      <div className="footer-fine">
        <span>© {new Date().getFullYear()} DadMode</span>
        <span>Guidance, not medical advice. Always defer to your provider.</span>
      </div>
    </footer>
  );
}
