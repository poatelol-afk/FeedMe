'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', background: 'var(--bg-base)',
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
          <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Check your email
          </p>
          <p className="text-body">
            We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/auth/login"
            style={{
              display: 'block', marginTop: '20px',
              fontSize: '13px', color: 'var(--accent)', textDecoration: 'none',
            }}
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-base)',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'var(--accent-soft)',
          border: '1px solid rgba(143,184,154,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: '24px',
        }}>🥗</div>
        <h1 style={{
          fontSize: '22px', fontWeight: '300',
          letterSpacing: '-0.03em', color: 'var(--text-primary)',
        }}>FeedMe</h1>
        <p className="text-label" style={{ marginTop: '4px' }}>Create your account</p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
        <p style={{
          fontSize: '16px', fontWeight: '500',
          color: 'var(--text-primary)', marginBottom: '20px',
        }}>Sign up</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="text-label" style={{ marginBottom: '6px' }}>Email</p>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="input-field"
            />
          </div>

          <div>
            <p className="text-label" style={{ marginBottom: '6px' }}>Password</p>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
              className="input-field"
            />
          </div>

          <div>
            <p className="text-label" style={{ marginBottom: '6px' }}>Confirm password</p>
            <input
              id="signup-confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
              className="input-field"
            />
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
          )}

          <button
            id="signup-btn"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{
          marginTop: '20px', textAlign: 'center',
          fontSize: '13px', color: 'var(--text-muted)',
        }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
