// Client-side entitlement state. Pro access is unlocked after a verified
// Stripe purchase (the /welcome page confirms the Checkout Session server-side
// before calling setPro). We mirror it into localStorage so the gated UI reads
// synchronously on every page without a round-trip.
//
// This is intentionally not a security boundary — there is no premium *content*
// being protected from a determined user with devtools, only a paid software
// experience. The server-side webhook + entitlements table is the source of
// truth for "who paid"; this flag is just the local unlock.

export const PRO_FLAG = 'dadmode_pro';
export const EMAIL_KEY = 'dadmode_email';

export interface ProState {
  active: boolean;
  plan?: string;
  since?: string;
}

/** Read the local Pro unlock state. SSR-safe (returns inactive on the server). */
export function getProState(): ProState {
  if (typeof window === 'undefined') return { active: false };
  try {
    const raw = window.localStorage.getItem(PRO_FLAG);
    if (!raw) return { active: false };
    const parsed = JSON.parse(raw) as ProState;
    return parsed?.active ? parsed : { active: false };
  } catch {
    return { active: false };
  }
}

export function isPro(): boolean {
  return getProState().active;
}

export function setPro(plan?: string): void {
  if (typeof window === 'undefined') return;
  const state: ProState = { active: true, plan, since: new Date().toISOString() };
  window.localStorage.setItem(PRO_FLAG, JSON.stringify(state));
}

export function clearPro(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PRO_FLAG);
}

export function rememberEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function getRememberedEmail(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(EMAIL_KEY) ?? '';
}

/** Opt-in local preview of Pro without paying, for demos. Off unless the env
 *  flag is set at build time. Never enable this in a real production build. */
export function demoUnlockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DADMODE_DEMO === '1';
}
