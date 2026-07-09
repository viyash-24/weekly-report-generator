// ReportTable: displays historical reports with status and actions
import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function ReportTable({ reports }) {
  const [viewingReport, setViewingReport] = useState(null);
  const getReportIcon = (status) => {
    if (status === 'Action Required') return { icon: 'assignment_late', color: 'text-error' };
    return { icon: 'assignment', color: 'text-secondary' };
  };

  const getActions = (report) => {

    switch (report.status) {
      case 'Draft':
        return (
          <>
            <button className="text-secondary hover:text-primary transition-colors flex items-center" title="Edit">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
            </button>
            <button className="text-secondary hover:text-error transition-colors flex items-center" title="Delete">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
            </button>
          </>
        );
      case 'Submitted':
        return (
          <button onClick={() => setViewingReport(report)} className="text-secondary hover:text-primary transition-colors flex items-center" title="View">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
          </button>
        );
      case 'Action Required':
        return (
          <>
            <button className="text-secondary hover:text-primary transition-colors flex items-center" title="Resolve">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
            </button>
            <button className="text-secondary hover:text-primary transition-colors flex items-center" title="View Details">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </>
        );
      default:
        return (
          <button onClick={() => setViewingReport(report)} className="text-secondary hover:text-primary transition-colors flex items-center" title="View">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
          </button>
        );
    }
  };

  return (
    <div className="bg-surface border border-outline-variant rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-sm px-md font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">Report Title</th>
              <th className="py-sm px-md font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">Period</th>
              <th className="py-sm px-md font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">Author</th>
              <th className="py-sm px-md font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">Status</th>
              <th className="py-sm px-md font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-md px-md text-center text-secondary">No reports available.</td>
              </tr>
            ) : reports.map((report) => {
              const { icon, color } = getReportIcon(report.status);
              return (
                <tr key={report._id || report.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <span className={`material-symbols-outlined ${color}`} style={{ fontSize: '20px' }}>{icon}</span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">{report.title}</span>
                    </div>
                  </td>
                  <td className="py-md px-md text-body-sm font-body-sm text-secondary">{report.week || report.period}</td>
                  <td className="py-md px-md text-body-sm font-body-sm text-secondary">{report.createdBy?.name || report.author || 'Unknown'}</td>
                  <td className="py-md px-md">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-md px-md text-right">
                    <div className="flex justify-end gap-sm transition-opacity">
                      {getActions(report)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-surface-container-low border-t border-outline-variant px-md py-sm flex items-center justify-between">
        <span className="text-body-sm font-body-sm text-secondary">
          Showing {reports.length > 0 ? 1 : 0} to {reports.length} of {reports.length} entries
        </span>
        <div className="flex items-center gap-sm">
          <button disabled className="p-xs rounded hover:bg-surface-container transition-colors text-secondary disabled:opacity-50">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <div className="flex gap-xs">
            <button className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md">1</button>
          </div>
          <button disabled className="p-xs rounded hover:bg-surface-container transition-colors text-secondary disabled:opacity-50">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg shadow-lg w-full min-w-[300px] md:min-w-[700px] max-w-3xl overflow-y-auto max-h-[90vh] p-lg border border-outline-variant block">
            <div className="mb-md border-b border-outline-variant pb-sm flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">{viewingReport.title || 'Report Details'}</h2>
                <p className="text-secondary text-body-md mt-xs">Week: {viewingReport.week || viewingReport.period} | Status: {viewingReport.status}</p>
              </div>
              <button onClick={() => setViewingReport(null)} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-md mt-md">
              <div>
                <h4 className="font-label-md text-secondary">Tasks Completed</h4>
                <p className="text-body-md text-on-surface whitespace-pre-wrap">{viewingReport.tasksCompleted || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-label-md text-secondary">Tasks Planned</h4>
                <p className="text-body-md text-on-surface whitespace-pre-wrap">{viewingReport.tasksPlanned || 'N/A'}</p>
              </div>
              {viewingReport.blockers && (
                <div>
                  <h4 className="font-label-md text-error">Blockers</h4>
                  <p className="text-body-md text-on-surface whitespace-pre-wrap">{viewingReport.blockers}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <h4 className="font-label-md text-secondary">Hours Worked</h4>
                  <p className="text-body-md text-on-surface">{viewingReport.hoursWorked || 0} hrs</p>
                </div>
                <div>
                  <h4 className="font-label-md text-secondary">Project</h4>
                  <p className="text-body-md text-on-surface">{viewingReport.project?.name || 'General'}</p>
                </div>
              </div>
              {viewingReport.notes && (
                <div>
                  <h4 className="font-label-md text-secondary">Notes</h4>
                  <p className="text-body-md text-on-surface whitespace-pre-wrap">{viewingReport.notes}</p>
                </div>
              )}
              <div className="pt-xl flex justify-end">
                <button
                  onClick={() => setViewingReport(null)}
                  className="px-lg py-md border border-outline text-secondary hover:text-primary hover:border-primary hover:bg-surface-container rounded font-label-lg transition-colors bg-surface"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
