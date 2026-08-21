import React from 'react';
import { FolderGit2, CheckCircle2, Star, Sparkles, Layers, Cpu, Code } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const {
    title,
    difficulty = 'Intermediate',
    description,
    technologies = [],
    skillsDeveloped = [],
    expectedOutcome,
    portfolioValue,
    whyRecommended
  } = project;

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }[difficulty] || 'bg-brand-500/10 text-brand-400 border-brand-500/20';

  return (
    <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${difficultyColors}`}>
              {difficulty}
            </span>
          </div>

          {portfolioValue && (
            <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              High Resume Impact
            </span>
          )}
        </div>

        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
          {title}
        </h4>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {description}
        </p>

        {/* Why Recommended Callout */}
        {whyRecommended && (
          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-xs text-brand-300 mb-4 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <span>{whyRecommended}</span>
          </div>
        )}

        {/* Tech Stack */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Technologies Used:</span>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-mono border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Developed */}
        {skillsDeveloped.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Competencies Developed:</span>
            <div className="flex flex-wrap gap-1.5">
              {skillsDeveloped.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Outcome Deliverable */}
      {expectedOutcome && (
        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span><strong>Deliverable: </strong>{expectedOutcome}</span>
        </div>
      )}
    </div>
  );
};
