import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="marketing-main">
        <AdminDashboard />
      </main>
    </div>
  );
}
