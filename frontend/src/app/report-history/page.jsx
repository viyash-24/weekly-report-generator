'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import DashboardLayout from '@/components/DashboardLayout';

import ReportTable from '@/components/ReportTable';

export default function ReportHistoryPage() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (reports.length === 0) setLoading(true);
      try {

        const reportData = await reportService.getReports();
        setReports(reportData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);



  return (
    <DashboardLayout activePage="/report-history" activeTab="Overview" searchPlaceholder="Search reports...">
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Header Section */}
        <div className="flex justify-between items-end pb-sm border-b border-outline-variant">
          <div>
            <h2 className="text-display-lg font-display-lg text-primary">Report History</h2>
            <p className="text-body-lg font-body-lg text-secondary mt-xs">Review and manage past submissions.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs border border-outline-variant bg-surface px-md py-sm rounded hover:bg-surface-container transition-colors text-label-md font-label-md text-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-xs border border-outline-variant bg-surface px-md py-sm rounded hover:bg-surface-container transition-colors text-label-md font-label-md text-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
              Date Range
            </button>
            <button className="flex items-center gap-xs border border-outline-variant bg-surface px-md py-sm rounded hover:bg-surface-container transition-colors text-label-md font-label-md text-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              Export
            </button>
          </div>
        </div>



        {/* Data Table */}
        {loading ? (
          <div className="p-md text-center">Loading...</div>
        ) : (
          <ReportTable reports={reports} />
        )}
      </div>
    </DashboardLayout>
  );
}
