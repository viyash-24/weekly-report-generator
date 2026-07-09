// SearchBar standalone component
'use client';
import { useState } from 'react';

export default function SearchBar({ placeholder = 'Search...', className = '' }) {
  const [value, setValue] = useState('');
  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="material-symbols-outlined absolute left-sm text-secondary pointer-events-none" style={{ fontSize: '18px' }}>search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-xl pr-sm py-xs border border-outline-variant rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors w-full"
      />
    </div>
  );
}
