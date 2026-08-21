import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Code2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Target,
  Trophy
} from 'lucide-react';
import { roadmapAPI } from '../services/api';

export const RoadmapTimeline = ({ roadmap, onProgressUpdate }) => {
  const [weeks, setWeeks] = useState(roadmap?.weeks || []);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);

  if (!roadmap || !weeks || weeks.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
        <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p>No roadmap items available yet. Generate an AI analysis to view your customized learning path.</p>
      </div>
    );
  }

  const completedCount = weeks.filter(w => w.status === 'completed').length;
  const progressPercent = Math.round((completedCount / weeks.length) * 100);

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatingId(itemId);
    try {
      await roadmapAPI.updateItemStatus(itemId, newStatus);
      
      // Update local state
      const updated = weeks.map(w => w.id === itemId ? { ...w, status: newStatus } : w);
      setWeeks(updated);

      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Progress Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            <span>{roadmap.title || '30-Day Accelerated Learning Roadmap'}</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            {roadmap.overview || 'Master key competencies through structured weekly objectives, hands-on mini-projects, and verified checkpoints.'}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Milestones Completed</span>
            <span className="text-lg font-bold text-white font-mono">{completedCount} / {weeks.length}</span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-slate-800 flex items-center justify-center relative font-bold text-xs font-mono text-brand-400">
            <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-500 transition-all duration-500"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Weekly Accordion Cards */}
      <div className="space-y-4">
        {weeks.map((week) => {
          const isExpanded = expandedWeek === week.weekNumber;
          const isCompleted = week.status === 'completed';
          const isInProgress = week.status === 'in_progress';

          return (
            <div
              key={week.id || week.weekNumber}
              className={`rounded-2xl transition-all duration-200 border ${
                isCompleted
                  ? 'bg-slate-900/40 border-emerald-500/30'
                  : isInProgress
                  ? 'bg-slate-900/90 border-brand-500/40 shadow-lg shadow-brand-500/5'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = isCompleted ? 'not_started' : 'completed';
                      handleStatusChange(week.id, next);
                    }}
                    disabled={updatingId === week.id}
                    title="Toggle completion status"
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : isInProgress ? (
                      <Clock className="w-6 h-6 text-brand-400 animate-spin-slow" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                        Week {week.weekNumber}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isInProgress
                            ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">{week.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Action Buttons */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs font-medium"
                  >
                    <button
                      onClick={() => handleStatusChange(week.id, 'not_started')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        week.status === 'not_started' || !week.status
                          ? 'bg-slate-700 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => handleStatusChange(week.id, 'in_progress')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        week.status === 'in_progress'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(week.id, 'completed')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        week.status === 'completed'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Done
                    </button>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/60 space-y-4 animate-fade-in text-sm">
                  
                  {/* Objective */}
                  <div className="bg-slate-850/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-brand-400 block mb-1">
                      Weekly Objective
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {week.objective}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Topics */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                        Core Topics to Study
                      </span>
                      <ul className="space-y-1.5">
                        {(week.topics || []).map((topic, idx) => (
                          <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 bg-slate-850/40 p-2 rounded-lg border border-slate-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0"></span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        Hands-On Exercises
                      </span>
                      <ul className="space-y-1.5">
                        {(week.exercises || []).map((exercise, idx) => (
                          <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 bg-slate-850/40 p-2 rounded-lg border border-slate-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                            <span>{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mini Project */}
                  {week.miniProject && week.miniProject.title && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/40 to-indigo-950/40 border border-brand-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Weekly Milestone Mini-Project
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-sm mb-1">{week.miniProject.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{week.miniProject.description}</p>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  {week.expectedOutcome && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Expected Deliverable: </strong>{week.expectedOutcome}</span>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
