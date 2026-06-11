#!/usr/bin/env node
/**
 * One-command Stripe provisioning for DadMode Pro.
 *
 * Creates (idempotently) the two prices and the webhook endpoint, then prints
 * the env vars to paste into Vercel. You never have to touch the Stripe
 * dashboard's product or webhook screens.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs [site_url]
 *
 * site_url defaults to $NEXT_PUBLIC_SITE_URL, then the production vercel.app URL.
 * Run it once in Stripe **Test mode**, verify a test purchase, then run it again
 * with your live sk_live_... key when you're ready to go live.
 *
 * Prices are kept in sync with src/lib/plans.ts (pass: $29 one-time, monthly: $6/mo).
 */

import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('✗ Set STRIPE_SECRET_KEY first, e.g.\n  STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs');
  process.exit(1);
}

const SITE_URL = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'https://dadmode-giebz.vercel.app').replace(/\/+$/, '');
const webhookUrl = `${SITE_URL}/api/stripe/webhook`;
const mode = key.startsWith('sk_live') ? 'LIVE' : 'TEST';

const stripe = new Stripe(key);

async function ensurePrice({ lookupKey, productName, unitAmount, recurring }) {
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return { id: existing.data[0].id, reused: true };
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: unitAmount,
    lookup_key: lookupKey,
    ...(recurring ? { recurring: { interval: 'month' } } : {}),
    product_data: { name: productName },
  });
  return { id: price.id, reused: false };
}

async function ensureWebhook(url) {
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const found = endpoints.data.find((e) => e.url === url);
  if (found) return { id: found.id, secret: null, reused: true };
  const created = await stripe.webhookEndpoints.create({
    url,
    enabled_events: ['checkout.session.completed', 'customer.subscription.deleted'],
    description: 'DadMode Pro',
  });
  return { id: created.id, secret: created.secret, reused: false };
}

async function main() {
  console.log(`\nDadMode · Stripe setup  (${mode} mode)`);
  console.log(`Webhook target: ${webhookUrl}\n`);

  const pass = await ensurePrice({
    lookupKey: 'dadmode_pass',
    productName: 'DadMode Pro — Whole Pregnancy Pass',
    unitAmount: 2900,
    recurring: false,
  });
  console.log(`${pass.reused ? '↺ reused' : '✓ created'} Pass price        ${pass.id}`);

  const monthly = await ensurePrice({
    lookupKey: 'dadmode_monthly',
    productName: 'DadMode Pro — Monthly',
    unitAmount: 600,
    recurring: true,
  });
  console.log(`${monthly.reused ? '↺ reused' : '✓ created'} Monthly price     ${monthly.id}`);

  const webhook = await ensureWebhook(webhookUrl);
  console.log(`${webhook.reused ? '↺ reused' : '✓ created'} Webhook endpoint  ${webhook.id}`);

  console.log('\n──────────────  Paste these into Vercel  ──────────────\n');
  console.log(`STRIPE_SECRET_KEY=${key.slice(0, 7)}…            # the key you ran this with`);
  console.log(`STRIPE_PRICE_PASS=${pass.id}`);
  console.log(`STRIPE_PRICE_MONTHLY=${monthly.id}`);
  if (webhook.secret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
  } else {
    console.log('STRIPE_WEBHOOK_SECRET=<existing endpoint — reveal it in the Stripe dashboard,');
    console.log('                       or delete that endpoint and re-run this script>');
  }
  console.log('\n(Prices also fall back to inline amounts, so PRICE_* are optional.)\n');
}

main().catch((err) => {
  console.error('\n✗ Stripe setup failed:', err?.message || err);
  process.exit(1);
});
