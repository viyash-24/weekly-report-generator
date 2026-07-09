// Reusable StatCard for dashboard metrics
export default function StatCard({ label, value, icon, accentColor }) {
  const accentClass = {
    green: 'border-l-primary-fixed-dim',
    gray: 'border-l-tertiary-fixed-dim',
    dark: 'border-l-outline',
  }[accentColor] || '';

  return (
    <div
      className={`bg-surface border border-outline-variant rounded p-md flex flex-col justify-between h-32 hover:bg-surface-container-low transition-colors cursor-pointer ${accentColor ? `border-l-4 ${accentClass}` : ''}`}
    >
      <span className="text-label-md font-label-md text-secondary uppercase tracking-widest">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-display-lg font-display-lg text-primary leading-none">{value}</span>
        <span
          className={`material-symbols-outlined ${
            accentColor === 'green'
              ? 'text-primary-fixed-dim'
              : accentColor === 'gray'
              ? 'text-tertiary-fixed-dim'
              : accentColor === 'dark'
              ? 'text-outline'
              : 'text-secondary'
          }`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
