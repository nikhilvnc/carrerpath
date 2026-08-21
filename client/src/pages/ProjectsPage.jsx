import React, { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FolderGit2, Sparkles, Filter } from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await projectAPI.getAllProjects();
        setProjects(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <LoadingSpinner message="Loading portfolio project repository..." />
      </div>
    );
  }

  const filtered = filterDifficulty === 'All'
    ? projects
    : projects.filter(p => p.difficulty?.toLowerCase() === filterDifficulty.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Resume Boosters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-emerald-400" />
            <span>Recommended Portfolio Projects</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Curated, deployable engineering projects designed to prove your skill readiness to recruiters.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterDifficulty === diff
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => (
          <ProjectCard key={proj.id || proj.slug} project={proj} />
        ))}
      </div>

    </div>
  );
};
