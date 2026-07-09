'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboardService';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';


export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!data) setLoading(true);
    try {
      if (user?.role === 'manager') {
        const dashData = await dashboardService.getManagerDashboard();
        setData(dashData);
      } else {
        const dashData = await dashboardService.getMemberDashboard();
        setData(dashData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user]);

  if (loading || !data) {
    return (
      <DashboardLayout activePage="/dashboard" activeTab="Overview">
        <div className="flex items-center justify-center min-h-[50vh]">Loading...</div>
      </DashboardLayout>
    );
  }

  const isManager = user?.role === 'manager';

  return (
    <DashboardLayout activePage="/dashboard" activeTab="Overview">
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Page Header */}
        <div className="flex justify-between items-end pb-sm border-b border-outline-variant">
          <div>
            <h2 className="text-display-lg font-display-lg text-primary">Dashboard</h2>
            <p className="text-body-lg font-body-lg text-secondary mt-xs">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}. Here&apos;s your overview.
            </p>
          </div>
          <button onClick={fetchDashboard} className="flex items-center gap-xs border border-outline-variant bg-surface px-md py-sm rounded hover:bg-surface-container transition-colors text-label-md font-label-md text-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <StatCard label="Total Reports" value={data.stats?.totalReports || 0} icon="description" />
          <StatCard label="Submitted" value={isManager ? (data.stats?.pending || 0) : (data.stats?.submitted || 0)} icon="check_circle" accentColor="green" />
          <StatCard label="Drafts" value={data.stats?.drafts || 0} icon="edit_document" accentColor="dark" />
          {isManager && <StatCard label="Total Users" value={data.stats?.totalUsers || 0} icon="group" accentColor="gray" />}
        </div>

        {/* Second Row: Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <div className="bg-surface border border-outline-variant rounded-lg p-lg h-full">
            <h3 className="font-label-lg text-label-lg text-primary mb-md">
              {isManager ? 'Recent Team Submissions' : 'Recent Reports'}
            </h3>
            {(isManager ? data.activityFeed : data.recentReports)?.length > 0 ? (
              <ul className="space-y-sm">
                {(isManager ? data.activityFeed : data.recentReports).map(r => {
                  const id = isManager ? r.id : r._id;
                  const title = isManager ? r.target : r.title;
                  const status = isManager ? r.action : r.status;
                  const author = isManager ? r.user : 'You';
                  return (
                    <li key={id} className="p-sm border border-outline-variant rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium text-primary">{title}</div>
                        <div className="text-sm text-secondary">Status: {status}</div>
                      </div>
                      <span className="text-[12px] bg-surface-variant text-secondary px-[8px] py-[4px] rounded-full">
                        {author}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-secondary text-sm">No recent reports.</p>
            )}
          </div>
          
          {!isManager && (
            <div className="bg-surface border border-outline-variant rounded-lg p-lg h-full">
              <h3 className="font-label-lg text-label-lg text-primary mb-md">Current Week Status</h3>
              <div className="text-display-md text-primary">{data.stats?.currentWeekStatus || 'Not Started'}</div>
            </div>
          )}
          
          {isManager && (
            <div className="bg-surface border border-outline-variant rounded-lg p-lg h-full flex flex-col justify-center items-center text-center">
               <span className="material-symbols-outlined text-display-lg text-primary mb-md opacity-20" style={{ fontSize: '64px' }}>admin_panel_settings</span>
               <h3 className="font-headline-sm text-primary mb-sm">Manager Workspace</h3>
               <p className="text-secondary text-body-md max-w-[250px]">
                 You are viewing organization-wide analytics. Navigate to the Reports tab to view full historical data.
               </p>
            </div>
          )}
        </div>


      </div>
    </DashboardLayout>
  );
}
