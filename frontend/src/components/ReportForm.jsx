'use client';

import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { reportService } from '@/services/reportService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function ReportForm({ onClose, initialData = null }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default week logic
  const getWeekString = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  };

  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        project: initialData.project?._id || initialData.project || '',
      };
    }
    return {
      title: '',
      project: '',
      week: getWeekString(),
      status: 'Draft',
      tasksCompleted: '',
      tasksPlanned: '',
      blockers: '',
      hoursWorked: 0,
      notes: '',
    };
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load projects list.');
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const submitData = { ...form, project: form.project || null };
      
      if (initialData?._id) {
        await reportService.updateReport(initialData._id, submitData);
        toast.success('Report updated successfully!');
      } else {
        if (form.status === 'Draft') {
          await reportService.saveDraft(submitData);
          toast.success('Draft saved successfully!');
        } else {
          await reportService.submitReport(submitData);
          toast.success('Report submitted successfully!');
        }
      }
      if (onClose) onClose();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save report.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      {error && <div className="text-error text-body-sm mb-sm">{error}</div>}
      
      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Report Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          type="text"
          required
          placeholder="e.g. Weekly Dev Sprint 43"
          className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Project</label>
          <div className="relative">
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">No Project / Generic</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
              expand_more
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Week</label>
          <input
            name="week"
            value={form.week}
            onChange={handleChange}
            type="week"
            required
            className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Tasks Completed</label>
          <textarea
            name="tasksCompleted"
            value={form.tasksCompleted}
            onChange={handleChange}
            rows={4}
            placeholder="What did you finish?"
            className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Tasks Planned (Next Week)</label>
          <textarea
            name="tasksPlanned"
            value={form.tasksPlanned}
            onChange={handleChange}
            rows={4}
            placeholder="What will you work on next?"
            className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Blockers (optional)</label>
          <textarea
            name="blockers"
            value={form.blockers}
            onChange={handleChange}
            rows={2}
            placeholder="Any blockers or dependencies?"
            className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">Notes & Hours</label>
          <div className="flex gap-sm">
            <input
              name="hoursWorked"
              value={form.hoursWorked}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="Hrs"
              className="w-24 border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              type="text"
              placeholder="Additional notes..."
              className="flex-1 border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">Status</label>
        <div className="relative">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="Draft">Draft</option>
            <option value="Submitted">Submit for Review</option>
          </select>
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
            expand_more
          </span>
        </div>
      </div>

      <div className="pt-xl border-t border-outline-variant flex justify-end gap-md">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-md border border-outline text-secondary hover:text-primary hover:border-primary hover:bg-surface-container rounded font-label-lg text-label-lg transition-colors bg-surface"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-lg py-md bg-primary text-on-primary hover:bg-surface-tint rounded font-label-lg text-label-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Report'}
        </button>
      </div>
    </form>
  );
}
