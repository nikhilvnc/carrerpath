import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careerAPI, roadmapAPI } from '../services/api';
import { MatchBadge } from '../components/MatchBadge';
import { SkillProgressBar } from '../components/SkillProgressBar';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Compass,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  BookOpen,
  HelpCircle,
  Calendar,
  Briefcase
} from 'lucide-react';

export const CareerDetailPage = () => {
  const { id } = useParams();

  const [career, setCareer] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [activeDuration, setActiveDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch recommendations to find matching rec details
      const recRes = await careerAPI.getRecommendations();
      const recs = recRes.data?.recommendations || [];
      const matchedRec = recs.find(r => r.slug === id || r.id === id || r.careerTitle?.toLowerCase().replace(/\s+/g, '-') === id) || recs[0];
      setRecommendation(matchedRec);

      // 2. Fetch static career taxonomy details
      try {
        const pathRes = await careerAPI.getPathDetail(id);
        setCareer(pathRes.data);
      } catch (e) {
        // Use matchedRec data if static endpoint 404s on custom slug
        setCareer({
          title: matchedRec?.careerTitle || id,
          description: matchedRec?.reason || 'Technology career trajectory.',
          avg_salary_range: '$80,000 - $140,000',
          market_outlook: 'High Demand (20%+ Growth)',
          difficulty_level: matchedRec?.learningDifficulty || 'Moderate',
          interview_focus: 'System design, core algorithmic problem solving, REST APIs, and database fundamentals.',
          future_growth_outlook: 'Strong long-term advancement into Staff/Principal Architect and Engineering Leadership.'
        });
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load career details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <LoadingSpinner message="Loading Career Blueprint & Learning Plan..." />
      </div>
    );
  }

  const activeRoadmap = (recommendation?.roadmaps || []).find(r => r.durationDays === activeDuration) || (recommendation?.roadmaps || [])[0] || null;

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Back Link */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Career Blueprint
              </span>
              {recommendation?.matchRank && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold">
                  Rank #{recommendation.matchRank} Recommendation
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {career?.title || recommendation?.careerTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              {career?.description || recommendation?.reason}
            </p>
          </div>

          {recommendation?.matchScore && (
            <div className="flex-shrink-0">
              <MatchBadge score={recommendation.matchScore} size="lg" />
            </div>
          )}
        </div>

        {/* Quick Industry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Avg Salary Range</span>
              <span className="text-sm font-bold text-white font-mono">{career?.avg_salary_range || '$80k - $140k'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Market Outlook</span>
              <span className="text-sm font-bold text-white">{career?.market_outlook || 'Very High Growth'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Difficulty Curve</span>
              <span className="text-sm font-bold text-white">{career?.difficulty_level || recommendation?.learningDifficulty || 'Moderate'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHY THIS CAREER FITS YOU */}
      {recommendation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Why This Career Fits You</h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {recommendation.reason}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Your Confirmed Strengths
              </span>
              <ul className="space-y-1.5 pt-1">
                {(recommendation.strengths || []).map((s, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/20 space-y-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Recommended Next Steps
              </span>
              <ul className="space-y-1.5 pt-1">
                {(recommendation.nextSteps || []).map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-brand-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. SKILL GAP ANALYSIS */}
      {recommendation?.skillGaps && recommendation.skillGaps.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Skill Gap Analysis & Bridging Priorities</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes your current baseline against hiring standards. Complete the roadmap below to close these gaps.
            </p>
          </div>

          <div className="space-y-4">
            {recommendation.skillGaps.map((gap, idx) => (
              <SkillProgressBar key={idx} skill={gap} />
            ))}
          </div>
        </div>
      )}

      {/* 4. PERSONALIZED LEARNING ROADMAP */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              <span>Personalized Learning Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured weekly milestones tailored to your schedule. Check off items as you complete them.
            </p>
          </div>

          {/* Duration Selector Tabs */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-semibold">
            {[
              { days: 30, label: '30-Day Accelerated' },
              { days: 60, label: '60-Day Deep Dive' },
              { days: 90, label: '90-Day Industry Ready' }
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
          <RoadmapTimeline roadmap={activeRoadmap} onProgressUpdate={loadData} />
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>Roadmap being generated for {activeDuration} days.</p>
          </div>
        )}
      </div>

      {/* 5. RECOMMENDED PORTFOLIO PROJECTS */}
      {recommendation?.projects && recommendation.projects.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-400" />
              <span>Recommended Portfolio Projects</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Proven projects that close your specific skill gaps and demonstrate hands-on competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendation.projects.map((proj, idx) => (
              <ProjectCard key={idx} project={proj} />
            ))}
          </div>
        </div>
      )}

      {/* 6. TECHNICAL INTERVIEW PREPARATION & CAREER LADDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Interview Focus */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            Technical Interview Focus
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {career?.interview_focus || 'Focus on system design fundamentals, REST API design, database indexing, and state management.'}
          </p>
        </div>

        {/* Career Progression */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            Career Ladder & Growth Outlook
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {career?.future_growth_outlook || 'Associate Engineer → Software Engineer II → Senior Engineer → Staff Architect / Engineering Manager.'}
          </p>
        </div>

      </div>

    </div>
  );
};
