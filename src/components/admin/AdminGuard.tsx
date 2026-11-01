import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090B] text-white flex flex-col items-center justify-center font-mono text-xs text-[#9299A3] space-y-3">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
        <span>VERIFYING ADMIN CREDENTIALS...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#08090B] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#12151A] border border-red-500/30 p-8 rounded-sm space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Access Unauthorized
          </h2>
          <p className="font-sans text-sm text-[#9299A3]">
            Your user account is authenticated, but your user ID has not been granted administrative privileges in the <code className="text-[#D7DCE2]">admin_users</code> table.
          </p>
          <div className="pt-4">
            <a
              href="/"
              className="inline-block px-4 py-2 bg-white text-[#08090B] font-mono text-xs uppercase tracking-technical rounded font-semibold hover:bg-[#D7DCE2] transition-colors"
            >
              Return to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

