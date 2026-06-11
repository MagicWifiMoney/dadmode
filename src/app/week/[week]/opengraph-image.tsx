import { ImageResponse } from 'next/og';
import { weekData } from '@/app/data';
import { trimesterLabel } from '@/lib/pregnancy';

export const alt = "A dad's guide to this week of pregnancy";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const n = Number(week);
  const valid = Number.isInteger(n) && n >= 1 && n <= 40;
  const data = valid ? weekData[n - 1] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2d42 100%)',
          color: '#e8e0d4',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '4px', color: '#f5a623' }}>
          {valid ? trimesterLabel(n).toUpperCase() : 'DADMODE'}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 20 }}>
          <span style={{ fontSize: 56, color: 'rgba(232,224,212,0.75)' }}>Week&nbsp;</span>
          <span style={{ fontSize: 200, fontWeight: 800, color: '#f2ede4', lineHeight: 1 }}>
            {valid ? n : '—'}
          </span>
        </div>

        <div style={{ display: 'flex', fontSize: 42, marginTop: 24, color: 'rgba(232,224,212,0.85)' }}>
          {data ? `Baby is about the size of ${data.size.toLowerCase()}.` : 'A pregnancy guide for dads.'}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center', fontSize: 36, fontWeight: 800 }}>
          <span style={{ color: '#f2ede4' }}>Dad</span>
          <span style={{ color: '#f5a623' }}>Mode</span>
          <span style={{ fontSize: 26, fontWeight: 400, marginLeft: 24, color: 'rgba(232,224,212,0.6)' }}>
            a dad&apos;s guide
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
