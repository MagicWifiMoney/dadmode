import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { email, dueDate } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('leads')
      .upsert({ email, due_date: dueDate }, { onConflict: 'email' });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway to try and send email
    }

    // 2. Send Welcome Email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'DadMode <hello@jgiebz.com>', // We'll need to verify this domain in Resend
        to: email,
        subject: 'Welcome to DadMode 🍼',
        html: `<p>Congrats! You're officially in DadMode.</p><p>We've logged your due date: ${new Date(dueDate).toLocaleDateString()}. Check back next week for your first update.</p>`
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
