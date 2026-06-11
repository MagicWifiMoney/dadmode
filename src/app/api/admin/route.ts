import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lightweight, token-gated admin data feed for the /admin dashboard. Reads via
// the Supabase service-role key, so it must never be exposed without the token.
// Set ADMIN_TOKEN in the environment to enable it.

function tokenFrom(req: Request): string {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return new URL(req.url).searchParams.get('token')?.trim() ?? '';
}

/** Constant-time-ish string compare to avoid trivial timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function GET(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: 'Admin is not configured. Set ADMIN_TOKEN.' }, { status: 503 });
  }
  if (!safeEqual(tokenFrom(req), expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [leads, ents, activeEnts] = await Promise.all([
      supabase
        .from('leads')
        .select('email, due_date, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('entitlements')
        .select('email, plan, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('entitlements')
        .select('plan', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

    return NextResponse.json({
      leads: {
        total: leads.count ?? 0,
        recent: leads.data ?? [],
        error: leads.error?.message ?? null,
      },
      entitlements: {
        total: ents.count ?? 0,
        active: activeEnts.count ?? 0,
        recent: ents.data ?? [],
        error: ents.error?.message ?? null,
      },
    });
  } catch (err) {
    console.error('Admin data error:', err);
    return NextResponse.json({ error: 'Failed to load admin data' }, { status: 500 });
  }
}
