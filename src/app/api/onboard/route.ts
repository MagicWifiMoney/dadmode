import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    let body: { email?: unknown; dueDate?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // Only accept a parseable due date; otherwise store/send without one.
    let dueDate: Date | null = null;
    if (typeof body.dueDate === 'string') {
      const parsed = new Date(body.dueDate);
      if (!Number.isNaN(parsed.getTime())) dueDate = parsed;
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('leads')
      .upsert({ email, due_date: dueDate?.toISOString() ?? null }, { onConflict: 'email' });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway to try and send the welcome email.
    }

    // 2. Send welcome email via Resend (only with a real key configured)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const dueLine = dueDate
        ? `<p>We've logged your due date: ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Check back next week for your first update.</p>`
        : `<p>Check back next week for your first update.</p>`;

      try {
        await resend.emails.send({
          from: 'DadMode <hello@jgiebz.com>', // domain must be verified in Resend
          to: email,
          subject: 'Welcome to DadMode 🍼',
          html: `<p>Congrats! You're officially in DadMode.</p>${dueLine}`,
        });
      } catch (mailErr) {
        console.error('Email send error:', mailErr);
        // A failed welcome email should not fail the signup.
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
