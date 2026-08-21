import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerAPI, progressAPI } from '../services/api';
import { CareerCard } from '../components/CareerCard';
import { SkillProgressBar } from '../components/SkillProgressBar';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Compass,
  Sparkles,
  User,
  ArrowRight,
  TrendingUp,
  Target,
  Trophy,
  BookOpen,
  FolderGit2,
  RefreshCw,
  CheckCircle2,
  Layers,
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reanalyzing, setReanalyzing] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch AI career recommendations
      const recRes = await careerAPI.getRecommendations();
      const recs = recRes.data?.recommendations || [];
      setRecommendations(recs);

      // If user has no recommendations yet, auto-trigger analysis or let them start assessment
      if (recs.length === 0) {
        try {
          const autoRes = await careerAPI.analyzeCareer({});
          setRecommendations(autoRes.data?.recommendations || []);
        } catch (e) {
          console.warn('Auto analysis deferred', e);
        }
      }

      // 2. Fetch student progress summary
      const progRes = await progressAPI.getProgressSummary();
      setProgressSummary(progRes.data);
    } catch (err) {
      console.error('Error loading dashboard data', err);
      setError('Unable to load career recommendations. You can start a fresh assessment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      await careerAPI.analyzeCareer({});
      await fetchDashboardData();
    } catch (e) {
      setError('Re-analysis failed. Please try again.');
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || reanalyzing) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <LoadingSpinner message={reanalyzing ? 'Refreshing AI career blueprint...' : 'Loading your student career dashboard...'} />
      </div>
    );
  }

  const topPick = recommendations[0] || null;
  const secondaryPicks = recommendations.slice(1, 3);
  const topSkillGaps = topPick?.skillGaps || [];
  const topProjects = topPick?.projects || [];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* 1. WELCOME & ACTION BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Student Career Dashboard
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {profile?.degree || 'B.Tech'} - {profile?.branch || 'Computer Science'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Here is your AI-curated career compatibility analysis, identified skill gaps, and active 30-day development milestones.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleReanalyze}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
            <span>Re-Analyze Profile</span>
          </button>

          <Link
            to="/profile"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edit Profile</span>
          </Link>

          <Link
            to="/assessment"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. TOP METRICS & PROGRESS WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Top Recommendation Score */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Top Career Match
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white truncate max-w-[180px]">
              {topPick?.careerTitle || 'Full Stack Developer'}
            </h3>
            <span className="text-2xl font-black text-brand-400 font-mono">
              {topPick?.matchScore || 88}%
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {topPick?.learningDifficulty || 'Moderate'} learning curve based on your skills
          </p>
        </div>

        {/* Roadmap Progress % */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Roadmap Execution
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white">
              {progressSummary?.completedMilestones || 0} / {progressSummary?.totalMilestones || 4} Completed
            </h3>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {progressSummary?.overallPercentage || 0}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressSummary?.overallPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* Skill Gaps Identified */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Critical Skill Gaps
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white">
              {topSkillGaps.length || 3} Focus Areas
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
              Action Plan Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Targeted weekly modules ready to bridge missing technical competencies
          </p>
        </div>

      </div>

      {/* 3. TOP RECOMMENDATION & SECONDARY RECOMMENDATIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>AI Career Recommendations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by compatibility against your education, languages, and work preferences.
            </p>
          </div>
        </div>

        {topPick ? (
          <div className="space-y-6">
            {/* Top Match - Large Card */}
            <CareerCard recommendation={topPick} isTopPick={true} />

            {/* Secondary Matches Grid */}
            {secondaryPicks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {secondaryPicks.map((rec) => (
                  <CareerCard key={rec.id || rec.matchRank} recommendation={rec} isTopPick={false} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 text-center space-y-3 border border-slate-800">
            <p className="text-slate-400 text-sm">No career recommendations calculated yet.</p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Start 5-Step Career Assessment
            </Link>
          </div>
        )}
      </div>

      {/* 4. SKILL GAP MATRIX SUMMARY */}
      {topSkillGaps.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <span>Skill Gap Analysis for {topPick?.careerTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing your current proficiency against industry hiring requirements.
              </p>
            </div>

            <Link
              to={`/career/${topPick?.slug || topPick?.id}`}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {topSkillGaps.map((skill, idx) => (
              <SkillProgressBar key={idx} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* 5. RECOMMENDED PORTFOLIO PROJECTS */}
      {topProjects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                <span>Recommended Portfolio Projects</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-world full-stack and distributed projects to prove your mastery to recruiters.
              </p>
            </div>

            <Link
              to="/projects"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topProjects.map((proj, idx) => (
              <ProjectCard key={idx} project={proj} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
