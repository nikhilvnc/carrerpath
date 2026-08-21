import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MatchBadge } from '../components/MatchBadge';
import { History, Sparkles, ArrowRight, Clock, Calendar, CheckCircle } from 'lucide-react';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await careerAPI.getHistory();
        setHistory(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <LoadingSpinner message="Loading historical AI analyses..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Audit & Snapshot History
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-brand-400" />
            <span>AI Career Analysis History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past career recommendations and prompt caching snapshots.
          </p>
        </div>

        <Link
          to="/assessment"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Analysis</span>
        </Link>
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                  #{item.match_rank || 1}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{item.career_title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{item.learning_difficulty || 'Moderate'} Curve</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <MatchBadge score={item.match_score} size="sm" />
                <Link
                  to={`/career/${item.career_title?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Analysis History Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Take the 5-step career assessment to save your first AI snapshot.
          </p>
        </div>
      )}

    </div>
  );
};
