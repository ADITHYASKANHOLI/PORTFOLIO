import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { LiquidActionLink } from '@/components/ui';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Wrench,
  Share2,
  Image,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isSupabaseMode } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Site Content', path: '/admin/content', icon: FileText },
    { name: 'Skills & Tech', path: '/admin/skills', icon: Wrench },
    { name: 'Social Links', path: '/admin/socials', icon: Share2 },
    { name: 'Media Storage', path: '/admin/media', icon: Image },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#08090B] border-b border-[#292D33]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white text-[#08090B] font-display font-bold text-xs flex items-center justify-center">
            AK
          </div>
          <span className="font-display font-semibold text-sm">Admin CMS</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-[#9299A3] hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 w-64 bg-[#08090B] border-r border-[#292D33] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#292D33] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded border border-[#292D33] bg-[#12151A] flex items-center justify-center font-display font-bold text-white text-xs">
                AK
              </div>
              <div>
                <span className="font-display font-bold text-sm block">Kanholi Studio</span>
                <span className="font-mono text-[10px] text-[#9299A3]">Engineering Admin</span>
              </div>
            </Link>
          </div>

          {/* Database Mode Status Indicator */}
          <div className="px-6 py-3 bg-[#12151A]/60 border-b border-[#292D33] flex items-center gap-2 font-mono text-[11px]">
            <Database className="w-3.5 h-3.5 text-white" />
            <span className="text-[#9299A3]">DB:</span>
            {isSupabaseMode ? (
              <span className="text-white font-medium">Supabase Connected</span>
            ) : (
              <span className="text-[#D7DCE2] font-medium" title="Operating with local cache & seed data">
                Local / Demo Mode
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-mono text-xs transition-colors ${
                    active
                      ? 'bg-white text-[#08090B] font-semibold shadow-sm'
                      : 'text-[#9299A3] hover:text-white hover:bg-[#12151A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#292D33] space-y-3">
          <LiquidActionLink
            to="/"
            target="_blank"
            variant="clear"
            size="sm"
            intensity={4}
            thickness={1}
            className="w-full flex items-center justify-between text-[#D7DCE2] hover:text-white font-mono text-xs"
          >
            <span className="flex items-center justify-between w-full">
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </span>
          </LiquidActionLink>

          <div className="px-3.5 py-2 flex items-center justify-between font-mono text-xs text-[#9299A3]">
            <span className="truncate max-w-[120px]">{user?.email || 'admin'}</span>
            <button
              onClick={() => logout()}
              className="text-white hover:text-[#D7DCE2] p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-h-screen p-6 md:p-10 lg:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
