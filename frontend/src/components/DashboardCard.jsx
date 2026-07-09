// DashboardCard - generic info card for dashboard layout
export default function DashboardCard({ title, children, className = '' }) {
  return (
    <div className={`bg-surface border border-outline-variant rounded p-md ${className}`}>
      {title && (
        <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-md">{title}</h3>
      )}
      {children}
    </div>
  );
}
