import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner = () => {
  const { isAuthenticated, user, demoLogin } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  const handleDemoClick = async () => {
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border-b border-brand-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-slate-300">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20 text-brand-400">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="truncate">
            <strong className="text-white font-semibold">Hackathon Judge & Evaluator Mode:</strong>{' '}
            {isAuthenticated ? (
              <span>Logged in as <strong>{user?.name}</strong> ({user?.email})</span>
            ) : (
              <span>Pre-loaded student profile with Java, SQL & Web skills ready for instantaneous 1-click test.</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={handleDemoClick}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-white font-medium text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              <UserCheck className="w-3 h-3" />
              {loading ? 'Launching...' : '1-Click Demo Login'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-2.5 py-1 rounded bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 font-medium text-xs transition-colors flex items-center gap-1"
            >
              Go to Dashboard
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
