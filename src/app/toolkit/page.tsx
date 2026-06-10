import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ToolkitClient from './ToolkitClient';

export const metadata: Metadata = {
  title: 'The Dad Toolkit',
  description:
    'Hospital bag checklist, kick counter, contraction timer, and a baby name studio — the DadMode Pro toolkit for the third trimester and the big day.',
  alternates: { canonical: '/toolkit' },
};

export default function ToolkitPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="marketing-main">
        <ToolkitClient />
      </main>
      <SiteFooter />
    </div>
  );
}
