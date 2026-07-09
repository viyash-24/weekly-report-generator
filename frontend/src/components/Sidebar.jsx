'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const memberNavItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/reports', icon: 'description', label: 'Weekly Reports', fillIcon: true },
  { href: '/report-history', icon: 'history', label: 'Report History' },
];

const managerNavItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/reports', icon: 'description', label: 'Team Reports', fillIcon: true },
  { href: '/projects', icon: 'folder', label: 'Projects / Categories' },
  { href: '/analytics', icon: 'analytics', label: 'Analytics & Insights' },
  { href: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
];

const bottomItems = [
  { href: '/login', icon: 'logout', label: 'Logout' },
];

export default function Sidebar({ activePage }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href) => {
    if (href === '#') return false;
    if (href === '/reports' && (pathname === '/reports/new' || activePage === '/reports/new')) return true;
    return pathname === href || activePage === href;
  };

  const filteredNavItems = user?.role === 'manager' ? managerNavItems : memberNavItems;
  const filteredBottomItems = bottomItems;

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant z-50 flex flex-col py-xl">
      {/* Brand */}
      <div className="px-gutter mb-xl flex flex-col gap-sm">
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary leading-tight">Weekly Report<br/>Generator</h1>
        <span className="text-body-sm font-body-sm text-secondary">Enterprise SaaS</span>
      </div>

      {/* New Report Button (Members Only) */}
      {user?.role !== 'manager' && (
        <div className="px-gutter mb-lg">
          <Link href="/reports/new">
            <button className="w-full bg-primary text-on-primary py-sm px-md rounded hover:bg-surface-tint transition-colors duration-200 flex items-center justify-center gap-sm font-label-md text-label-md">
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: '18px' }}>add</span>
              New Report
            </button>
          </Link>
        </div>
      )}

      {/* Main Nav */}
      <ul className="flex-1 overflow-y-auto flex flex-col">
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-sm px-md py-sm transition-colors duration-200 ${
                  active
                    ? 'text-primary border-l-4 border-primary bg-surface-container font-bold opacity-90'
                    : 'text-secondary hover:text-primary hover:bg-surface-container-highest'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active && item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Nav */}
      <ul className="mt-auto flex flex-col border-t border-outline-variant pt-sm">
        {filteredBottomItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-sm px-md py-sm text-secondary hover:text-primary hover:bg-surface-container-highest transition-colors duration-200"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
