import React from 'react';
import { AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const SkillProgressBar = ({ skill }) => {
  const {
    skillName,
    currentProficiency = 0,
    requiredProficiency = 80,
    gapPercentage = 50,
    priority = 'High Priority',
    learningRecommendation = '',
    estimatedHoursToBridge = 20
  } = skill;

  // Priority color config
  const priorityConfig = {
    'High Priority': {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      barRequired: 'bg-rose-500',
      icon: AlertCircle
    },
    'Medium Priority': {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      barRequired: 'bg-amber-500',
      icon: TrendingUp
    },
    'Nice to Have': {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      barRequired: 'bg-emerald-500',
      icon: CheckCircle2
    }
  }[priority] || {
    badge: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    barRequired: 'bg-brand-500',
    icon: TrendingUp
  };

  const Icon = priorityConfig.icon;

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-base">{skillName}</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 ${priorityConfig.badge}`}>
            <Icon className="w-3 h-3" />
            {priority}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            Current: <strong className="text-sky-400">{currentProficiency}%</strong>
          </div>
          <div>
            Target: <strong className="text-slate-200">{requiredProficiency}%</strong>
          </div>
          <div>
            Gap: <strong className="text-rose-400">+{gapPercentage}%</strong>
          </div>
        </div>
      </div>

      {/* Dual Progress Track */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative flex">
          {/* Current user skill level */}
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-brand-500 transition-all duration-500 rounded-l-full relative z-10"
            style={{ width: `${Math.min(100, currentProficiency)}%` }}
            title={`Current: ${currentProficiency}%`}
          />
          {/* Skill Gap delta */}
          <div
            className="h-full bg-slate-700/60 border-l border-white/20 relative"
            style={{ width: `${Math.max(0, Math.min(100 - currentProficiency, gapPercentage))}%` }}
            title={`Gap: ${gapPercentage}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Your Proficiency
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            Target Proficiency Gap
          </span>
        </div>
      </div>

      {/* Recommendation & bridge time */}
      <div className="pt-1 flex items-start justify-between gap-4 text-xs text-slate-300">
        <p className="flex-1 text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Action Plan: </strong>
          {learningRecommendation || 'Follow recommended weekly module to bridge this competency.'}
        </p>

        {estimatedHoursToBridge && (
          <div className="flex-shrink-0 flex items-center gap-1 text-slate-400 font-mono bg-slate-800/80 px-2 py-1 rounded">
            <Clock className="w-3 h-3 text-brand-400" />
            <span>~{estimatedHoursToBridge} hrs</span>
          </div>
        )}
      </div>

    </div>
  );
};
