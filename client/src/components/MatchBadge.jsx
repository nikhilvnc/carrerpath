import React from 'react';

export const MatchBadge = ({ score, size = 'md' }) => {
  let colorClasses = 'from-emerald-500 to-teal-600 text-white';
  let label = 'Strong Fit';

  if (score >= 85) {
    colorClasses = 'from-emerald-500 to-teal-500 text-white shadow-emerald-500/20';
    label = 'Top Match';
  } else if (score >= 75) {
    colorClasses = 'from-brand-500 to-indigo-600 text-white shadow-brand-500/20';
    label = 'High Fit';
  } else if (score >= 60) {
    colorClasses = 'from-amber-500 to-orange-600 text-white shadow-amber-500/20';
    label = 'Moderate Fit';
  } else {
    colorClasses = 'from-slate-600 to-slate-700 text-slate-200';
    label = 'Exploring';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-bold',
  }[size] || 'px-3 py-1 text-sm font-semibold';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${colorClasses} shadow-md ${sizeClasses}`}>
      <span className="font-mono">{score}%</span>
      <span className="opacity-90 font-medium text-[11px] uppercase tracking-wider">{label}</span>
    </div>
  );
};
