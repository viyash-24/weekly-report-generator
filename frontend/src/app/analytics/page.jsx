'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services/dashboardService';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00301c', '#a1d1b4', '#555f71', '#c1c9c1'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [submissionData, setSubmissionData] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'manager') {
      const loadAnalytics = async () => {
        try {
          const [subData, workData, prodData] = await Promise.all([
            dashboardService.getSubmissionChart(),
            dashboardService.getProjectWorkload(),
            dashboardService.getTeamProductivity()
          ]);
          setSubmissionData(subData.reverse());
          setWorkloadData(workData);
          setProductivityData(prodData);
        } catch (err) {
          toast.error('Failed to load analytics');
        } finally {
          setLoading(false);
        }
      };
      loadAnalytics();
    }
  }, [user]);

  if (user?.role !== 'manager') {
    return (
      <DashboardLayout activePage="/analytics" activeTab="Analytics & Insights">
        <div className="p-xl text-center text-secondary font-body-lg">Access Denied: Managers only.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="/analytics" activeTab="Analytics & Insights">
      <div className="max-w-7xl mx-auto space-y-lg">
        <div className="border-b border-outline-variant pb-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">Analytics & Insights</h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">Monitor organization-wide reporting compliance and workload.</p>
        </div>

        {loading ? (
          <div className="p-xl text-center text-secondary">Loading analytics...</div>
        ) : (
          <div className="space-y-lg">
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <div className="bg-surface border border-outline-variant rounded-lg p-lg shadow-sm">
                <h3 className="font-label-lg text-primary mb-md">Submission Trends (Last 6 Weeks)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#555f71' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#555f71' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #c1c9c1' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="submitted" stackId="a" fill="#00301c" name="Submitted" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="pending" stackId="a" fill="#a1d1b4" name="Drafts/Pending" />
                      <Bar dataKey="blocked" stackId="a" fill="#e57373" name="Blocked" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant rounded-lg p-lg shadow-sm">
                <h3 className="font-label-lg text-primary mb-md">Workload by Project (Hours)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workloadData}
                        dataKey="hours"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {workloadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #c1c9c1' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Team Productivity Table */}
            <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              <div className="p-md border-b border-outline-variant">
                <h3 className="font-label-lg text-primary">Team Productivity & Compliance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-label-md text-secondary">
                      <th className="py-sm px-md font-medium">Team Member</th>
                      <th className="py-sm px-md font-medium text-center">Total Reports</th>
                      <th className="py-sm px-md font-medium text-center">Submitted</th>
                      <th className="py-sm px-md font-medium text-center">Compliance</th>
                      <th className="py-sm px-md font-medium text-center">Hours Tracked</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant">
                    {productivityData.map((row) => (
                      <tr key={row._id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-sm">
                            {row.avatar ? (
                              <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-md text-secondary border border-outline-variant">
                                {row.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <p className="font-medium text-on-surface">{row.name}</p>
                          </div>
                        </td>
                        <td className="py-sm px-md text-center">{row.totalReports}</td>
                        <td className="py-sm px-md text-center text-primary font-medium">{row.submitted}</td>
                        <td className="py-sm px-md text-center">
                           <span className={`px-[8px] py-[2px] rounded-full text-[12px] ${row.compliance >= 80 ? 'bg-primary-fixed/20 text-primary-container' : 'bg-error-container/50 text-on-error-container'}`}>
                             {Math.round(row.compliance)}%
                           </span>
                        </td>
                        <td className="py-sm px-md text-center font-mono">{row.totalHours}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
