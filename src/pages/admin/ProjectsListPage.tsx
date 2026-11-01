import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject, toggleProjectPublish, toggleProjectFeatured } from '@/lib/data/api';
import { Project } from '@/types';
import { LiquidActionLink } from '@/components/ui';
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects(true); // Include drafts
      setProjects(data);
    } catch (err) {
      console.warn('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await toggleProjectPublish(id, !current);
      await loadProjects();
    } catch (err) {
      console.warn('Failed to toggle publish status:', err);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleProjectFeatured(id, !current);
      await loadProjects();
    } catch (err) {
      console.warn('Failed to toggle featured status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setDeleteConfirmId(null);
      await loadProjects();
    } catch (err) {
      console.warn('Failed to delete project:', err);
    }
  };

  const filtered = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Engineering Archives
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Project Management
          </h1>
        </div>

        <LiquidActionLink
          to="/admin/projects/new"
          variant="glass"
          size="md"
          intensity={5}
          thickness={1}
          icon={<Plus className="w-4 h-4" />}
          className="font-mono text-xs font-semibold uppercase tracking-technical text-white self-start"
        >
          New Project
        </LiquidActionLink>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-sage absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, tag or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-surface border border-borderBase/20 text-paper font-sans text-xs focus:outline-none focus:border-copper"
          />
        </div>

        <div className="font-mono text-xs text-sage self-end sm:self-center">
          Showing {filtered.length} of {projects.length} total builds
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-surface border border-borderBase/15 rounded overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-surface-elevated font-mono text-xs text-sage uppercase border-b border-borderBase/15">
            <tr>
              <th className="px-6 py-3.5">Order</th>
              <th className="px-6 py-3.5">Title & Slug</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Featured</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderBase/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sage font-mono text-xs">
                  No projects match your query.
                </td>
              </tr>
            ) : (
              filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-sage">
                    {proj.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-paper flex items-center gap-2">
                      <span>{proj.title}</span>
                      <Link
                        to={`/project/${proj.slug}`}
                        target="_blank"
                        className="text-sage hover:text-copper"
                        title="View Live Detail Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <span className="font-mono text-[11px] text-sage/70 block">
                      /{proj.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-sage">
                    {proj.category}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(proj.id, proj.featured)}
                      className={`p-1.5 rounded transition-colors ${
                        proj.featured
                          ? 'text-copper bg-copper/10 hover:bg-copper/20'
                          : 'text-sage/40 hover:text-sage'
                      }`}
                      title={proj.featured ? 'Featured on homepage' : 'Mark as featured'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(proj.id, proj.published)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                        proj.published
                          ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60'
                          : 'bg-amber-950/60 border border-amber-500/30 text-amber-400 hover:bg-amber-900/60'
                      }`}
                    >
                      {proj.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/projects/edit/${proj.id}`}
                        className="p-1.5 rounded hover:bg-surface-elevated text-sage hover:text-copper transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {deleteConfirmId === proj.id ? (
                        <div className="flex items-center gap-1 bg-red-950 border border-red-500/40 px-2 py-1 rounded">
                          <span className="font-mono text-[10px] text-red-300">Confirm?</span>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="text-red-400 hover:text-red-200 font-bold px-1"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-sage hover:text-paper px-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-1.5 rounded hover:bg-surface-elevated text-sage hover:text-red-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
