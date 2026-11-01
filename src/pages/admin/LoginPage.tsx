import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { KeyRound, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';
import { LiquidActionButton, LiquidActionLink } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const { user, isAdmin, loginWithKey, isLoading, serverConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminKey, setAdminKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated with a valid session, automatically redirect to dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter the Admin Access Key.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await loginWithKey(adminKey.trim());
      if (res.error) {
        setError(res.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col justify-between p-6">
      {/* Top Bar: Return to Website */}
      <div className="max-w-md w-full mx-auto pt-6">
        <LiquidActionLink
          to="/"
          variant="clear"
          size="sm"
          intensity={4}
          thickness={1}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
          className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] hover:text-white"
        >
          Return to Public Website
        </LiquidActionLink>
      </div>

      {/* Center Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#12151A] border border-[#292D33] p-8 md:p-10 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-white mb-4 shadow-inner">
            <KeyRound className="w-7 h-7 text-[#D7DCE2]" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Admin Access Key
          </h1>
          <p className="font-sans text-xs text-[#9299A3] leading-relaxed max-w-sm mx-auto">
            Restricted editorial portal. Enter the verified access key configured in your deployment settings to authenticate.
          </p>
        </div>

        {/* Server Misconfiguration Notice (if ADMIN_KEY is not configured on the server) */}
        {serverConfigured === false && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-amber-300 text-xs font-mono">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <p className="font-semibold">ADMIN_KEY not configured</p>
              <p className="text-[11px] font-sans text-amber-200/80 leading-normal">
                The server environment is missing the <code className="text-white font-mono bg-amber-900/60 px-1 py-0.5 rounded">ADMIN_KEY</code> variable. Please configure it in your Vercel Project Settings &rarr; Environment Variables.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-[#9299A3] uppercase tracking-technical mb-2">
              Admin Access Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter access key..."
                autoFocus
                required
                disabled={submitting || isLoading}
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#08090B] border border-[#292D33] text-white font-mono text-sm placeholder:text-[#9299A3]/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide access key' : 'Show access key'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9299A3] hover:text-white transition-colors cursor-pointer p-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <LiquidActionButton
            type="submit"
            variant="glass"
            size="md"
            intensity={5}
            thickness={1}
            shimmer
            loading={submitting || isLoading}
            loadingText="Verifying Access Key..."
            className="w-full font-mono text-xs font-semibold uppercase tracking-technical text-white py-3 rounded-xl shadow-lg"
          >
            Verify & Enter Admin Portal
          </LiquidActionButton>
        </form>

        <div className="pt-2 text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#9299A3]/70 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
            Constant-Time Verification • HTTP-Only Session
          </span>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="max-w-md w-full mx-auto pb-6 text-center font-mono text-[11px] text-[#9299A3]/40">
        Row Level Security &bull; Cryptographically Signed Session
      </div>
    </div>
  );
};
