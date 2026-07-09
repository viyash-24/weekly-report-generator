// ReportCard - card view of a single report (used in reports list)
import StatusBadge from './StatusBadge';

export default function ReportCard({ report }) {
  return (
    <div className="bg-surface border border-outline-variant rounded p-md hover:bg-surface-container-low transition-colors group cursor-pointer">
      <div className="flex justify-between items-start mb-sm">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>assignment</span>
          <h4 className="font-body-md text-body-md text-on-surface font-medium">{report.title}</h4>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="text-body-sm font-body-sm text-secondary flex gap-md">
        <span>{report.period}</span>
        <span>•</span>
        <span>{report.author}</span>
      </div>
    </div>
  );
}
