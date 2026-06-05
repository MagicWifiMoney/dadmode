import { vi, describe, it, expect } from 'vitest';

const upsert = vi.fn().mockResolvedValue({ error: null });
vi.mock('@/lib/supabase', () => ({
  supabase: { from: () => ({ upsert }) },
}));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: vi.fn().mockResolvedValue({}) };
  },
}));

import { POST } from './route';

function makeReq(body: unknown, ip = '1.1.1.1') {
  return new Request('http://localhost/api/onboard', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/onboard', () => {
  it('rejects a malformed JSON body with 400', async () => {
    const res = await POST(makeReq('not json', '10.0.0.1'));
    expect(res.status).toBe(400);
  });

  it('rejects a missing/invalid email with 400', async () => {
    expect((await POST(makeReq({}, '10.0.0.2'))).status).toBe(400);
    expect((await POST(makeReq({ email: 'nope' }, '10.0.0.3'))).status).toBe(400);
  });

  it('accepts a valid signup and persists a normalized email', async () => {
    upsert.mockClear();
    const res = await POST(makeReq({ email: '  Dad@Example.COM ', dueDate: '2026-09-01T12:00:00Z' }, '10.0.0.4'));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'dad@example.com' }),
      expect.anything(),
    );
  });

  it('accepts a valid email without a due date', async () => {
    const res = await POST(makeReq({ email: 'nodate@example.com' }, '10.0.0.5'));
    expect(res.status).toBe(200);
  });

  it('rate-limits after 5 requests from the same IP', async () => {
    const ip = '10.0.0.99';
    const codes: number[] = [];
    for (let i = 0; i < 6; i++) {
      codes.push((await POST(makeReq({ email: 'x@y.com' }, ip))).status);
    }
    expect(codes.slice(0, 5).every((c) => c === 200)).toBe(true);
    expect(codes[5]).toBe(429);
  });
});
