import React from 'react';
import { Link } from 'react-router-dom';
import { MatchBadge } from './MatchBadge';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Code, 
  Layers, 
  Zap,
  TrendingUp 
} from 'lucide-react';

export const CareerCard = ({ recommendation, isTopPick = false }) => {
  const {
    id,
    careerTitle,
    slug,
    matchScore,
    matchRank = 1,
    reason,
    strengths = [],
    missingSkills = [],
    recommendedTechnologies = [],
    learningDifficulty = 'Moderate',
    nextSteps = []
  } = recommendation;

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between ${
        isTopPick
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-brand-500/50 shadow-xl shadow-brand-500/10'
          : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Tag */}
      {isTopPick && (
        <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TOP AI RECOMMENDATION</span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rank #{matchRank}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {learningDifficulty} Difficulty
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight hover:text-brand-400 transition-colors">
              {careerTitle}
            </h3>
          </div>

          <MatchBadge score={matchScore} size="md" />
        </div>

        {/* Reason */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {reason}
        </p>

        {/* Strengths & Missing Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-800/80">
          
          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Your Strengths
            </span>
            <ul className="space-y-1">
              {strengths.slice(0, 3).map((strength, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Key Skill Gaps
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Recommended Tech Stack */}
        {recommendedTechnologies.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Recommended Technologies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {recommendedTechnologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Personalized 30-Day Roadmap Ready
        </span>

        <Link
          to={`/career/${slug || id}`}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isTopPick
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <span>View Career Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
