'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Header({ searchPlaceholder = 'Search reports...' }) {
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-xl flex-shrink-0">
      {/* Left: Search */}
      <div className="flex items-center gap-lg">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-sm text-secondary pointer-events-none" style={{ fontSize: '18px' }}>search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-xl pr-sm py-sm border-outline-variant focus:border-primary border bg-surface-container-lowest text-on-surface text-body-sm font-body-sm rounded placeholder:text-secondary focus:ring-0 focus:outline-none transition-colors w-64"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-xs text-secondary">
          <button className="p-xs rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>

        <div className="h-8 w-8 rounded-full border border-outline-variant bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md ml-sm select-none cursor-pointer">
          {getInitial()}
        </div>
      </div>
    </header>
  );
}
