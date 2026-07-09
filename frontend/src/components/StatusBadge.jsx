// Status badge component used in tables and cards
const statusConfig = {
  Submitted: {
    bg: 'bg-secondary-container',
    text: 'text-on-secondary-container',
    dot: 'bg-secondary',
  },
  Draft: {
    bg: 'bg-surface-container-high',
    text: 'text-secondary',
    dot: 'bg-outline',
  },
  'Action Required': {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    dot: 'bg-error',
  },
  Pending: {
    bg: 'bg-surface-variant',
    text: 'text-secondary',
    dot: 'bg-outline',
  },
  Blocked: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    dot: 'bg-error',
  },
  Active: {
    bg: 'bg-primary-fixed',
    text: 'text-on-primary-fixed-variant',
    dot: 'bg-primary',
  },
  Inactive: {
    bg: 'bg-surface-container-high',
    text: 'text-secondary',
    dot: 'bg-outline',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Draft'];
  return (
    <span
      className={`inline-flex items-center gap-xs px-sm py-[2px] rounded-full ${config.bg} ${config.text} font-label-md text-[10px] uppercase tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}
