import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2 } from 'lucide-react';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090B] text-white flex flex-col items-center justify-center font-mono text-xs text-[#9299A3] space-y-3">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
        <span className="tracking-widest uppercase">Verifying Admin Access Key...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
