'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #c1c9c1',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Left Column: Branding */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#eeeeee',
          padding: '48px',
          borderRight: '1px solid #c1c9c1',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '48px', lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: 600, color: '#00301c', marginBottom: '12px' }}>
                Weekly Report Generator
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: '28px', color: '#555f71', maxWidth: '360px' }}>
                Enterprise SaaS platform for high-density information management and scalable team architecture.
              </p>
            </div>
            <div style={{ marginTop: '64px' }}>
              <div style={{
                width: '100%',
                height: '256px',
                borderRadius: '8px',
                border: '1px solid #c1c9c1',
                background: 'linear-gradient(135deg, rgba(0,48,28,0.05), rgba(161,209,180,0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#00301c', opacity: 0.3 }}>hub</span>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555f71', marginTop: '8px', opacity: 0.6 }}>Weekly Report Generator Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div style={{ padding: '48px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '24px', lineHeight: '32px', fontWeight: 600, color: '#1a1c1c', marginBottom: '4px' }}>
                Welcome back
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#555f71' }}>Sign in to your workspace.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.05em', color: '#414943' }}>
                  Corporate Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    background: '#f9f9f9',
                    border: '1px solid #c1c9c1',
                    borderRadius: '2px',
                    padding: '0 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    color: '#1a1c1c',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.05em', color: '#414943' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      height: '48px',
                      background: '#f9f9f9',
                      border: '1px solid #c1c9c1',
                      borderRadius: '2px',
                      padding: '0 48px 0 16px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '16px',
                      color: '#1a1c1c',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#555f71',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#00301c' }}>Forgot password?</a>
              </div>

              {/* Divider + CTA */}
              <div style={{ borderTop: '1px solid #c1c9c1', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: loading ? '#ccc' : '#00301c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#555f71' }}>
                  Don&apos;t have an account?{' '}
                  <Link href="/register" style={{ color: '#00301c', fontWeight: 500 }}>Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
