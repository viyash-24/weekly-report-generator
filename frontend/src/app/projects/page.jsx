'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { projectService } from '@/services/projectService';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'react-toastify';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
    if (projects.length === 0) setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'manager') fetchProjects();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projectService.updateProject(editingId, formData);
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created successfully');
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', description: '', status: 'Active' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const openEdit = (project) => {
    setEditingId(project._id);
    setFormData({ name: project.name, description: project.description, status: project.status });
    setShowModal(true);
  };

  if (user?.role !== 'manager') {
    return (
      <DashboardLayout activePage="/projects" activeTab="Projects">
        <div className="p-xl text-center text-secondary font-body-lg">Access Denied: Managers only.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="/projects" activeTab="Projects / Categories" searchPlaceholder="Search projects...">
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Manage Projects & Categories</h2>
            <p className="font-body-md text-body-md text-secondary mt-xs">Create and manage groupings for team reports.</p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({ name: '', description: '', status: 'Active' }); setShowModal(true); }}
            className="bg-primary text-on-primary py-[8px] px-md rounded flex items-center gap-xs font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined icon-fill text-[18px]">add</span>
            New Project
          </button>
        </div>

        {/* Project List */}
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          {loading ? (
             <div className="p-xl text-center text-secondary">Loading projects...</div>
          ) : projects.length === 0 ? (
             <div className="p-xl text-center text-secondary">No projects found. Create one to get started.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-label-md text-secondary">
                  <th className="py-sm px-md font-medium">Project Name</th>
                  <th className="py-sm px-md font-medium">Description</th>
                  <th className="py-sm px-md font-medium">Status</th>
                  <th className="py-sm px-md font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-sm px-md font-medium text-primary">{p.name}</td>
                    <td className="py-sm px-md text-secondary max-w-[300px] truncate">{p.description}</td>
                    <td className="py-sm px-md">
                       <span className={`px-[8px] py-[2px] rounded-full text-[12px] ${p.status === 'Active' ? 'bg-primary-fixed/20 text-primary-container' : 'bg-surface-variant text-secondary'}`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="py-sm px-md text-right">
                      <div className="flex justify-end gap-xs">
                        <button onClick={() => openEdit(p)} className="text-primary hover:text-primary-container p-xs rounded hover:bg-surface-container transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="text-error hover:text-on-error-container p-xs rounded hover:bg-error-container/20 transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg shadow-lg w-[90vw] md:w-[600px] shrink-0 p-xl border border-outline-variant block max-h-[90vh] overflow-y-auto">
            <div className="mb-lg border-b border-outline-variant pb-md flex justify-between items-center">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <p className="text-secondary text-body-md mt-xs">{editingId ? 'Update project details' : 'Create a new project category'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-lg mt-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Project Name</label>
                <input 
                  type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Core Infrastructure"
                />
              </div>
              
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Description</label>
                <textarea 
                  required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  rows={4}
                  placeholder="What is this project about?"
                />
              </div>
              
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Status</label>
                <div className="relative">
                  <select 
                    value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-outline-variant rounded p-md bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>
              
              <div className="pt-xl border-t border-outline-variant flex justify-end gap-md">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-lg py-md border border-outline text-secondary hover:text-primary hover:border-primary hover:bg-surface-container rounded font-label-lg text-label-lg transition-colors bg-surface"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-lg py-md bg-primary text-on-primary hover:bg-surface-tint rounded font-label-lg text-label-lg transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
