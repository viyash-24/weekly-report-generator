'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import DashboardLayout from '@/components/DashboardLayout';
import FilterBar from '@/components/FilterBar';
import ReportForm from '@/components/ReportForm';

const statusStyles = {
  Submitted: {
    bg: 'bg-primary-fixed/20',
    text: 'text-primary-container',
    icon: 'check_circle',
    fill: true,
  },
  Draft: {
    bg: 'bg-surface-variant',
    text: 'text-secondary',
    icon: 'edit',
    fill: false,
  },

  Pending: {
    bg: 'bg-surface-variant',
    text: 'text-secondary',
    icon: 'schedule',
    fill: false,
  },
  'Action Required': {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    icon: 'warning',
    fill: true,
  },
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDepartment = (department) => {
    const departmentMap = {
      engineering: 'Frontend',
      product: 'UI/UX',
      design: 'Backend',
      operations: 'Devops',
    };

    return departmentMap[department] || department || 'Member';
  };
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWeek, setFilterWeek] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterMember, setFilterMember] = useState('');

  // Debounced states for fast typing
  const [debouncedWeek, setDebouncedWeek] = useState('');
  const [debouncedProject, setDebouncedProject] = useState('');
  const [debouncedMember, setDebouncedMember] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedWeek(filterWeek), 300);
    return () => clearTimeout(timer);
  }, [filterWeek]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedProject(filterProject), 300);
    return () => clearTimeout(timer);
  }, [filterProject]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMember(filterMember), 300);
    return () => clearTimeout(timer);
  }, [filterMember]);

  const fetchReports = async () => {
    if (reports.length === 0) setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (debouncedWeek) params.week = debouncedWeek;
      if (debouncedProject) params.project = debouncedProject;
      
      const data = await reportService.getReports(params);
      
      let result = data.data || [];
      if (debouncedMember) {
        result = result.filter(r => r.createdBy?.name?.toLowerCase().includes(debouncedMember.toLowerCase()));
      }
      
      setReports(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user, filterStatus, debouncedWeek, debouncedProject, debouncedMember]);

  const filters = [
    {
      name: 'status',
      defaultValue: 'Status: All',
      options: ['Status: All', 'Draft', 'Submitted'],
    },
  ];

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReport(null);
    fetchReports();
  };

  return (
    <DashboardLayout activePage="/reports" activeTab="Reports" searchPlaceholder="Search reports...">
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {user?.role === 'manager' ? 'Team Reports' : 'Weekly Status Reports'}
            </h2>
            <p className="font-body-md text-body-md text-secondary mt-xs">
              {user?.role === 'manager' ? 'Review submissions and monitor team progress.' : 'View your weekly reports.'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-sm">
            {user?.role === 'manager' && (
              <>
                <input 
                  type="text" 
                  placeholder="Filter by Name..."
                  value={filterMember}
                  onChange={(e) => setFilterMember(e.target.value)}
                  className="appearance-none bg-surface border border-outline-variant rounded px-sm py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary h-8 w-32 md:w-40"
                />
                <input 
                  type="text" 
                  placeholder="Week (e.g. 2024-W42)"
                  value={filterWeek}
                  onChange={(e) => setFilterWeek(e.target.value)}
                  className="appearance-none bg-surface border border-outline-variant rounded px-sm py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary h-8 w-32 md:w-40"
                />
                <input 
                  type="text" 
                  placeholder="Project Name..."
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="appearance-none bg-surface border border-outline-variant rounded px-sm py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary h-8 w-32 md:w-40"
                />
              </>
            )}
            <FilterBar 
              filters={[{
                name: 'status',
                defaultValue: 'All',
                value: filterStatus,
                onChange: setFilterStatus,
                options: ['All', 'Draft', 'Submitted']
              }]} 
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-label-md text-secondary">
                  <th className="py-sm px-md font-medium w-[250px]">Team Member</th>
                  <th className="py-sm px-md font-medium">Project / Week</th>
                  <th className="py-sm px-md font-medium w-[120px]">Status</th>
                  <th className="py-sm px-md font-medium">Key Update</th>
                  <th className="py-sm px-md font-medium text-right w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-md">Loading...</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-md text-secondary">No reports found.</td>
                  </tr>
                ) : (
                  reports.map((row) => {
                    const s = statusStyles[row.status] || statusStyles['Pending'];
                    const memberName = row.createdBy?.name || 'Unknown';
                    const memberAvatar = row.createdBy?.avatar;
                    const initials = memberName.split(' ').map(n => n[0]).join('').substring(0, 2);
                    const updateText = row.tasksCompleted || row.notes || 'No update provided.';
                    
                    return (
                      <tr key={row._id} className="hover:bg-surface-container-lowest transition-colors group">
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-sm">
                            {memberAvatar ? (
                              <img
                                src={memberAvatar}
                                alt={memberName}
                                className="w-8 h-8 rounded-full object-cover border border-outline-variant"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-md text-secondary border border-outline-variant">
                                {initials}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-on-surface">{memberName}</p>
                              <p className="text-secondary text-[12px]">{formatDepartment(row.createdBy?.department)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-sm px-md text-on-surface-variant">
                          <div>{row.project?.name || 'General'}</div>
                          <div className="text-[12px] text-secondary">{row.week}</div>
                        </td>
                        <td className="py-sm px-md">
                          <span
                            className={`inline-flex items-center gap-[4px] px-[6px] py-[2px] rounded-sm ${s.bg} ${s.text} font-label-md text-[10px]`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: '12px',
                                fontVariationSettings: s.fill ? "'FILL' 1" : "'FILL' 0",
                              }}
                            >
                              {s.icon}
                            </span>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-sm px-md">
                          <p className="text-on-surface truncate max-w-[300px]">{updateText}</p>
                        </td>
                        <td className="py-sm px-md text-right">
                          <div className="flex justify-end gap-sm">
                            {user?._id === (row.createdBy?._id || row.createdBy) && (
                              <button
                                onClick={() => {
                                  setEditingReport(row);
                                  setShowModal(true);
                                }}
                                className="font-label-md text-label-md px-sm py-[4px] border border-outline-variant rounded bg-surface hover:bg-surface-container text-primary hover:text-primary-container transition-colors shadow-sm"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => setViewingReport(row)}
                              className="font-label-md text-label-md px-sm py-[4px] border border-outline-variant rounded bg-surface hover:bg-surface-container text-primary hover:text-primary-container transition-colors shadow-sm"
                            >
                              {user?.role === 'manager' && row.status === 'Submitted' ? 'Review' : 'View'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg shadow-lg w-full min-w-[300px] md:min-w-[700px] max-w-3xl overflow-y-auto max-h-[90vh] p-lg border border-outline-variant block">
            <div className="mb-md border-b border-outline-variant pb-sm flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">Edit Report</h2>
                <p className="text-secondary text-body-md mt-xs">Update your weekly progress.</p>
              </div>
              <button onClick={handleCloseModal} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <ReportForm initialData={editingReport} onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg shadow-lg w-full min-w-[300px] md:min-w-[700px] max-w-3xl overflow-y-auto max-h-[90vh] p-lg border border-outline-variant block">
            <div className="mb-md border-b border-outline-variant pb-sm flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">{viewingReport.title || 'Report Details'}</h2>
                <p className="text-secondary text-body-md mt-xs">Week: {viewingReport.week} | Status: {viewingReport.status}</p>
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
    </DashboardLayout>
  );
}
