import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '@/lib/data/api';
import { Project } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { LiquidActionLink } from '@/components/ui';
import {
  FolderGit2,
  FileCheck2,
  FileClock,
  Sparkles,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const DashboardPage: React.FC = () => {
  const { isSupabaseMode } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchProjects(true); // Include drafts
        setProjects(all);
      } catch (err) {
        console.warn('Failed to load projects for dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = projects.length;
  const published = projects.filter((p) => p.published).length;
  const drafts = total - published;
  const featured = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-10">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase/15">
        <div>
          <span className="font-mono text-xs text-copper uppercase tracking-technical">
            Overview & Telemetry
          </span>
          <h1 className="font-display text-3xl font-bold text-paper">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LiquidActionLink
            to="/admin/projects/new"
            variant="glass"
            size="md"
            intensity={5}
            thickness={1}
            icon={<Plus className="w-4 h-4" />}
            className="font-mono text-xs font-semibold uppercase tracking-technical text-white"
          >
            Create New Project
          </LiquidActionLink>
        </div>
      </div>

      {/* Database Connection Notice */}
      {!isSupabaseMode ? (
        <div className="p-5 rounded bg-surface border border-amber-500/30 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono text-xs">
            <p className="text-amber-300 font-semibold">
              Currently Operating in Local Offline Mode
            </p>
            <p className="font-sans text-sage text-xs">
              All CRUD operations and media uploads are persisting locally in browser storage. To connect your live Supabase cloud database, configure <code className="text-copper">VITE_SUPABASE_URL</code> and <code className="text-copper">VITE_SUPABASE_ANON_KEY</code> in <code className="text-copper">.env</code> and run the provided SQL migrations.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded bg-surface border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="font-mono text-xs text-emerald-300">
            Connected to Supabase PostgreSQL • Row Level Security Enforced
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-sage">
            <span>TOTAL PROJECTS</span>
            <FolderGit2 className="w-4 h-4 text-copper" />
          </div>
          <div className="font-display text-3xl font-bold text-paper">{total}</div>
          <span className="font-mono text-[11px] text-sage/70">In database archive</span>
        </div>

        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-sage">
            <span>PUBLISHED</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-3xl font-bold text-emerald-400">{published}</div>
          <span className="font-mono text-[11px] text-sage/70">Visible to public</span>
        </div>

        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-sage">
            <span>DRAFTS</span>
            <FileClock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-400">{drafts}</div>
          <span className="font-mono text-[11px] text-sage/70">Hidden from public</span>
        </div>

        <div className="p-6 rounded bg-surface border border-borderBase/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-sage">
            <span>FEATURED</span>
            <Sparkles className="w-4 h-4 text-copper" />
          </div>
          <div className="font-display text-3xl font-bold text-copper">{featured}</div>
          <span className="font-mono text-[11px] text-sage/70">Highlighted builds</span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-paper">
          Quick Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/admin/content"
            className="p-6 rounded bg-surface border border-borderBase/15 hover:border-copper/50 transition-all group"
          >
            <div className="flex items-center justify-between font-mono text-xs text-copper mb-2">
              <span>SITE CONTENT</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-display text-lg font-bold text-paper">
              Editorial Sections
            </h3>
            <p className="font-sans text-xs text-sage mt-1">
              Edit Hero, About, Portrait note, FOLE narrative, Hardware areas, and Contact details.
            </p>
          </Link>

          <Link
            to="/admin/skills"
            className="p-6 rounded bg-surface border border-borderBase/15 hover:border-copper/50 transition-all group"
          >
            <div className="flex items-center justify-between font-mono text-xs text-copper mb-2">
              <span>TECHNICAL STACK</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-display text-lg font-bold text-paper">
              Skills & Categories
            </h3>
            <p className="font-sans text-xs text-sage mt-1">
              Add or reorder programming languages, embedded protocols, and tools.
            </p>
          </Link>

          <Link
            to="/admin/media"
            className="p-6 rounded bg-surface border border-borderBase/15 hover:border-copper/50 transition-all group"
          >
            <div className="flex items-center justify-between font-mono text-xs text-copper mb-2">
              <span>STORAGE BUCKETS</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-display text-lg font-bold text-paper">
              Media Management
            </h3>
            <p className="font-sans text-xs text-sage mt-1">
              Upload project cover images, gallery photos, and portrait photographs.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-paper">
            Recent Projects
          </h2>
          <Link
            to="/admin/projects"
            className="font-mono text-xs text-copper hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-surface border border-borderBase/15 rounded overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-surface-elevated font-mono text-xs text-sage uppercase border-b border-borderBase/15">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderBase/10">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-paper">
                    {project.title}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-sage">
                    {project.category}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-sage">
                    {formatDate(project.project_date)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-[11px] ${
                        project.published
                          ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-950/60 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="font-mono text-xs text-copper hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
