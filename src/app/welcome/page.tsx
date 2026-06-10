import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import UnlockPro from './UnlockPro';

export const metadata: Metadata = {
  title: 'Welcome to Pro',
  description: 'Your DadMode Pro toolkit is ready.',
  robots: { index: false },
  alternates: { canonical: '/welcome' },
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="marketing-main unlock-main">
        <UnlockPro sessionId={session_id} />
      </main>
      <SiteFooter />
    </div>
  );
}
