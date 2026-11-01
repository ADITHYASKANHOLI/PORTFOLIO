import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { Shield, AlertCircle, ArrowLeft, Database, CheckCircle2 } from 'lucide-react';
import { LiquidActionButton, LiquidActionLink } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const { user, isAdmin, login, isSupabaseMode, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  useEffect(() => {
    if (user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSubmitting(true);
    await login('adithya.admin@kanholi.dev');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col justify-between p-6">
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

      <div className="max-w-md w-full mx-auto my-auto bg-forest border border-borderBase/20 p-8 rounded-sm shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-copper/50 bg-surface flex items-center justify-center mx-auto text-copper mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-paper">
            Admin Authentication
          </h1>
          <p className="font-sans text-xs text-sage">
            Secure management console for Adithya S. Kanholi's portfolio
          </p>
        </div>

        {/* Database Status Notice */}
        <div className="p-3 rounded bg-surface border border-borderBase/10 flex items-start gap-2.5 text-xs font-mono">
          <Database className="w-4 h-4 text-copper shrink-0 mt-0.5" />
          <div className="space-y-1">
            {isSupabaseMode ? (
              <p className="text-emerald-400">
                Connected to Supabase PostgreSQL & Auth.
              </p>
            ) : (
              <div>
                <p className="text-amber-400 font-semibold">
                  Local / Offline Mode Active
                </p>
                <p className="text-sage/80 text-[11px] font-sans">
                  Supabase credentials are not yet set in <code className="text-copper">.env</code>. You can sign in using Demo mode to test the CMS and preview edits.
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-red-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required={isSupabaseMode}
              className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
            />
          </div>

          {isSupabaseMode && (
            <div>
              <label className="block font-mono text-xs text-sage uppercase tracking-technical mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded bg-surface border border-borderBase/20 text-paper font-sans text-sm focus:outline-none focus:border-copper"
              />
            </div>
          )}

          <LiquidActionButton
            type="submit"
            variant="glass"
            size="md"
            intensity={5}
            thickness={1}
            shimmer
            loading={submitting || isLoading}
            loadingText="Authenticating..."
            className="w-full font-mono text-xs font-semibold uppercase tracking-technical text-white"
          >
            Sign In as Administrator
          </LiquidActionButton>
        </form>

        {/* Demo Login Button if Supabase is not active */}
        {!isSupabaseMode && (
          <div className="pt-4 border-t border-[#292D33] space-y-3">
            <LiquidActionButton
              type="button"
              variant="clear"
              size="md"
              intensity={4}
              thickness={1}
              onClick={handleDemoLogin}
              loading={submitting}
              icon={<CheckCircle2 className="w-4 h-4 text-white" />}
              className="w-full font-mono text-xs uppercase tracking-technical text-white"
            >
              One-Click Demo Admin Login
            </LiquidActionButton>
            <p className="text-center font-mono text-[10px] text-[#9299A3]/70">
              Allows immediate verification of all CMS features, forms & edits.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-md w-full mx-auto pb-6 text-center font-mono text-[11px] text-[#9299A3]/40">
        Row Level Security (RLS) Enforced • Secure Admin Session
      </div>
    </div>
  );
};
