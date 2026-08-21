import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerAPI } from '../services/api';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BookOpen, Sparkles, ArrowRight, Target } from 'lucide-react';

export const RoadmapPage = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [activeDuration, setActiveDuration] = useState(30);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const recRes = await careerAPI.getRecommendations();
      const recs = recRes.data?.recommendations || [];
      if (recs.length > 0) {
        setRecommendation(recs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <LoadingSpinner message="Loading your customized learning roadmap..." />
      </div>
    );
  }

  const activeRoadmap = (recommendation?.roadmaps || []).find(r => r.durationDays === activeDuration) || (recommendation?.roadmaps || [])[0] || null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Active Learning Blueprint
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Target: {recommendation?.careerTitle || 'Full Stack Developer'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-400" />
            <span>Interactive Learning Roadmap</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete weekly topics, solve practical exercises, and build mini-milestones to bridge your skill gaps.
          </p>
        </div>

        {/* Duration Tabs */}
        <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          {[
            { days: 30, label: '30 Days' },
            { days: 60, label: '60 Days' },
            { days: 90, label: '90 Days' }
          ].map(tab => (
            <button
              key={tab.days}
              onClick={() => setActiveDuration(tab.days)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeDuration === tab.days
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeRoadmap ? (
        <RoadmapTimeline roadmap={activeRoadmap} onProgressUpdate={fetchRoadmap} />
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Roadmap Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Complete the 5-step career assessment to let AI generate your personalized week-by-week roadmap.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Career Assessment</span>
          </Link>
        </div>
      )}

    </div>
  );
};
