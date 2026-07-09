'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ReportForm from '@/components/ReportForm';

export default function NewReportPage() {
  const router = useRouter();

  return (
    <DashboardLayout activePage="/reports" activeTab="New Report">
      <div className="w-full min-w-[300px] md:min-w-[700px] max-w-3xl mx-auto block">
        <div className="bg-surface border border-outline-variant rounded-lg shadow-sm p-lg w-full">
          <div className="mb-md border-b border-outline-variant pb-sm">
            <h2 className="text-headline-md font-headline-md text-primary">Create New Report</h2>
            <p className="text-secondary text-body-md mt-xs">Submit your weekly progress.</p>
          </div>
          <ReportForm onClose={() => router.push('/dashboard')} />
        </div>
      </div>
    </DashboardLayout>
  );
}
