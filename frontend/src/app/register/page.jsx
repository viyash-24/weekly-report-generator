'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const inputStyle = {
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
};

const labelStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12px',
  letterSpacing: '0.05em',
  color: '#414943',
  marginBottom: '4px',
  display: 'block',
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState('member');
  const [form, setForm] = useState({ name: '', department: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ ...form, role });
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Left Column: Branding */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#eeeeee',
          padding: '48px',
          borderRight: '1px solid #c1c9c1',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
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
                  <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#00301c', opacity: 0.3 }}>groups</span>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555f71', marginTop: '8px', opacity: 0.6 }}>Join Your Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div style={{ padding: '48px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '24px', lineHeight: '32px', fontWeight: 600, color: '#1a1c1c', marginBottom: '4px' }}>
                Create Account
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#555f71' }}>Join your organization&apos;s workspace.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}
              {/* Name + Department */}
              <div style={{ display: 'grid', gridTemplateColumns: role === 'member' ? '1fr 1fr' : '1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Doe" required style={inputStyle} />
                </div>
                {role === 'member' && (
                  <div>
                    <label style={labelStyle}>Department</label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      required={role === 'member'}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select Dept</option>
                      <option value="engineering">Engineering</option>
                      <option value="product">Product</option>
                      <option value="design">Design</option>
                      <option value="operations">Operations</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Corporate Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required style={inputStyle} />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, padding: '0 48px 0 16px' }}
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

              {/* Role Selection */}
              <div>
                <span style={labelStyle}>Select Role</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
                  {/* Team Member */}
                  <div
                    onClick={() => setRole('member')}
                    style={{
                      position: 'relative',
                      border: role === 'member' ? '2px solid #00301c' : '1px solid #c1c9c1',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      background: '#f9f9f9',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: role === 'member' ? '#00301c' : '#555f71' }}>person</span>
                        <div>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1c1c' }}>Team Member</p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#555f71', maxWidth: '100px' }}>Standard access to projects.</p>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: role === 'member' ? '6px solid #00301c' : '1px solid #c1c9c1',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}></div>
                    </div>
                  </div>

                  {/* Manager */}
                  <div
                    onClick={() => setRole('manager')}
                    style={{
                      position: 'relative',
                      border: role === 'manager' ? '2px solid #00301c' : '1px solid #c1c9c1',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      background: '#f9f9f9',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: role === 'manager' ? '#00301c' : '#555f71' }}>manage_accounts</span>
                        <div>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1c1c' }}>Manager</p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#555f71', maxWidth: '100px' }}>Admin and reporting access.</p>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: role === 'manager' ? '6px solid #00301c' : '1px solid #c1c9c1',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                  {loading ? 'Registering...' : 'Register Account'}
                </button>
                <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#555f71' }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: '#00301c', fontWeight: 500 }}>Log In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
