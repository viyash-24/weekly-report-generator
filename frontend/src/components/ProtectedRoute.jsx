'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Loading skeleton shown while checking auth
const AuthSkeleton = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid #c1c9c1',
        borderTopColor: '#00301c', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
      }} />
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555f71', letterSpacing: '0.05em' }}>
        LOADING...
      </p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (requireRole && user.role !== requireRole) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, requireRole]);

  if (loading) return <AuthSkeleton />;
  if (!user) return <AuthSkeleton />;
  if (requireRole && user.role !== requireRole) return <AuthSkeleton />;

  return children;
}
