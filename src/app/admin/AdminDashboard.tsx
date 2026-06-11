'use client';

import { useState } from 'react';

interface Lead { email: string; due_date: string | null; created_at: string }
interface Ent { email: string; plan: string; status: string; created_at: string }
interface AdminData {
  leads: { total: number; recent: Lead[]; error: string | null };
  entitlements: { total: number; active: number; recent: Ent[]; error: string | null };
}

const TOKEN_KEY = 'dadmode_admin_token';

function fmt(d: string | null): string {
  if (!d) return '—';
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(tok: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin', { headers: { Authorization: `Bearer ${tok}` } });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setData(json as AdminData);
        try { window.localStorage.setItem(TOKEN_KEY, tok); } catch {}
      } else {
        setError(json?.error || 'Could not load admin data.');
        setData(null);
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    try { window.localStorage.removeItem(TOKEN_KEY); } catch {}
    setData(null);
    setToken('');
  }

  if (!data) {
    return (
      <div className="admin-gate">
        <h1>Admin</h1>
        <p className="lede">Enter the admin token to view leads and Pro entitlements.</p>
        <form
          className="email-input-row"
          onSubmit={(e) => { e.preventDefault(); if (token) load(token); }}
        >
          <input
            type="password"
            placeholder="ADMIN_TOKEN"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            aria-label="Admin token"
          />
          <button type="submit" disabled={loading}>{loading ? '…' : 'Open'}</button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-head">
        <h1>Admin</h1>
        <button className="link-btn" onClick={logout}>Sign out</button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat"><span className="admin-num">{data.leads.total}</span><span className="admin-label">Email leads</span></div>
        <div className="admin-stat"><span className="admin-num">{data.entitlements.total}</span><span className="admin-label">Pro customers</span></div>
        <div className="admin-stat"><span className="admin-num">{data.entitlements.active}</span><span className="admin-label">Active Pro</span></div>
      </div>

      <section className="admin-table-wrap">
        <h2>Recent Pro customers</h2>
        {data.entitlements.error && <p className="form-error">{data.entitlements.error}</p>}
        {data.entitlements.recent.length === 0 ? (
          <p className="tool-empty">No purchases yet.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Plan</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {data.entitlements.recent.map((e) => (
                <tr key={e.email}>
                  <td>{e.email}</td>
                  <td>{e.plan}</td>
                  <td><span className={`pill ${e.status === 'active' ? 'pill-ok' : 'pill-off'}`}>{e.status}</span></td>
                  <td>{fmt(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-table-wrap">
        <h2>Recent email leads</h2>
        {data.leads.error && <p className="form-error">{data.leads.error}</p>}
        {data.leads.recent.length === 0 ? (
          <p className="tool-empty">No leads yet.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Due date</th><th>Joined</th></tr></thead>
            <tbody>
              {data.leads.recent.map((l) => (
                <tr key={l.email}>
                  <td>{l.email}</td>
                  <td>{fmt(l.due_date)}</td>
                  <td>{fmt(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
