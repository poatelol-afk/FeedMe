'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

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
          margin: '0 auto 16px',
          fontSize: '24px',
        }}>🥗</div>
        <h1 style={{
          fontSize: '22px', fontWeight: '300',
          letterSpacing: '-0.03em', color: 'var(--text-primary)',
        }}>FeedMe</h1>
        <p className="text-label" style={{ marginTop: '4px' }}>Eat well. Move more. Earn rewards.</p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
        <p style={{
          fontSize: '16px', fontWeight: '500',
          color: 'var(--text-primary)', marginBottom: '20px',
        }}>Sign in</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="text-label" style={{ marginBottom: '6px' }}>Email</p>
            <input
              id="email"
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
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '2px' }}>{error}</p>
          )}

          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{
          marginTop: '20px', textAlign: 'center',
          fontSize: '13px', color: 'var(--text-muted)',
        }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
