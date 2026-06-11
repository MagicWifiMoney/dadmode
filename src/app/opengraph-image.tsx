import { ImageResponse } from 'next/og';

export const alt = 'DadMode — the pregnancy app built for dads';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2d42 100%)',
          color: '#e8e0d4',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, letterSpacing: '-2px' }}>
          <span style={{ color: '#f2ede4' }}>Dad</span>
          <span style={{ color: '#f5a623' }}>Mode</span>
        </div>
        <div style={{ display: 'flex', fontSize: 44, marginTop: 28, color: 'rgba(232,224,212,0.75)' }}>
          The pregnancy app built for dads.
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 56, color: '#f5a623', letterSpacing: '1px' }}>
          Week-by-week · hospital bag · kick counter · contraction timer
        </div>
      </div>
    ),
    { ...size },
  );
}
