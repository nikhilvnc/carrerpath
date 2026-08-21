import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Cpu,
  TrendingUp,
  Brain,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-24 py-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto pt-8 pb-12 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Generation AI Career Intelligence for College Students</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Find the Career Path <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-brand-400 to-indigo-400">
            Built for You.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          CareerPath AI analyzes your education, skills, interests, and goals to generate personalized career recommendations, skill-gap analysis, and actionable weekly roadmaps.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={handleDemo}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>1-Click Hackathon Demo</span>
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-medium text-slate-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl text-base font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/25 transition-all flex items-center gap-2"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Metrics Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-850 text-left">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl font-bold text-white font-mono">12+</span>
            <span className="text-xs text-slate-400">Tech Career Trajectories</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl font-bold text-brand-400 font-mono">100%</span>
            <span className="text-xs text-slate-400">Personalized Roadmaps</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl font-bold text-emerald-400 font-mono">30-90</span>
            <span className="text-xs text-slate-400">Day Action Milestones</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="block text-2xl font-bold text-indigo-400 font-mono">0ms</span>
            <span className="text-xs text-slate-400">Cached Prompt Response</span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
            Structured Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            How CareerPath AI Works
          </h3>
          <p className="text-slate-400 text-sm mt-3">
            From fragmented profile to a battle-tested career development plan in 4 streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Build Student Profile',
              desc: 'Enter your degree, technical coursework, current skills, and weekly learning availability.',
              icon: Target,
              color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
            },
            {
              step: '02',
              title: 'Career Assessment',
              desc: 'Answer a 5-step guided assessment covering problem-solving styles, interests, and target roles.',
              icon: Brain,
              color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
            },
            {
              step: '03',
              title: 'Gemini AI Analysis',
              desc: 'Our backend LLM service parses your competencies and outputs top-3 matches with compatibility scores.',
              icon: Sparkles,
              color: 'text-brand-400 bg-brand-500/10 border-brand-500/20'
            },
            {
              step: '04',
              title: 'Execute & Track Roadmap',
              desc: 'Bridge skill gaps with 30-day weekly milestones, mini projects, and live progress check-offs.',
              icon: Trophy,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition-all group"
              >
                <span className="text-4xl font-black text-slate-800 absolute top-4 right-5 group-hover:text-slate-700 transition-colors font-mono">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE PLATFORM PILLARS */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Intelligence Suite
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Designed to Solve Career Ambiguity
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Visual Skill Gap Analysis</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Never wonder what you're missing. View exact percentage gaps categorized into High Priority, Medium Priority, and Nice to Have with estimated hours to bridge.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>React State Management</span>
                <span className="text-rose-400">Gap: 45%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-[40%] bg-sky-500"></div>
                <div className="w-[45%] bg-slate-700"></div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Adaptive 30-90 Day Roadmaps</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Step-by-step weekly guides configured to your schedule. Includes theoretical concepts, practical coding exercises, and tangible weekly mini-projects.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Week 1: Core Foundations & ES6+</span>
              </div>
              <div className="flex items-center gap-2 text-brand-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Week 2: Component Architecture</span>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Curated Portfolio Projects</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stand out to recruiters with resume-worthy portfolio projects tailored specifically to demonstrate the skills needed for your target career.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300">
              <span className="font-semibold text-white">AI-Powered Resume Matcher</span>
              <p className="text-slate-400 text-[11px] mt-1">Full-stack SaaS with PostgreSQL, REST APIs, and Gemini LLM integration.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY CAREERPATH AI */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            The Competitive Edge
          </span>
          <h3 className="text-3xl font-extrabold text-white">
            Why CareerPath AI Outperforms Generic Advice
          </h3>
          <p className="text-slate-300 text-sm">
            Traditional advice is scattered across hundreds of blogs and videos without assessing your unique baseline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
              Traditional Approach (Pain Points)
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Scattered blogs, conflicting YouTube roadmaps, and information overload</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Generic "learn to code" advice that ignores existing Java or SQL knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>No quantitative skill-gap calculation or timeline estimation</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              CareerPath AI Solution
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Single consolidated AI platform assessing specific student competency</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Personalized roadmaps respecting available weekly hours (10-30 hrs/wk)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Interactive database-persisted progress tracking with milestone verification</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FUTURE ROADMAP & ENTERPRISE VISION */}
      <section className="space-y-8 text-center max-w-4xl mx-auto">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
            Long-Term Impact
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Future Vision & Institutional Scale
          </h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Architected to expand from an individual student platform into an enterprise university placement and recruitment intelligence ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
            <Users className="w-6 h-6 text-brand-400 mb-2" />
            <h5 className="font-bold text-white text-base">University Placement Cells</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional cohort dashboards revealing aggregate skill gaps across entire computer science departments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
            <Award className="w-6 h-6 text-indigo-400 mb-2" />
            <h5 className="font-bold text-white text-base">AI Mock Interview Prep</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive conversational technical voice/chat agents grounded in target role interview focus areas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
            <TrendingUp className="w-6 h-6 text-emerald-400 mb-2" />
            <h5 className="font-bold text-white text-base">Real-Time Market Ingestion</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamic pipeline scraping live labor market hiring trends to adjust skill weights continuously.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-tr from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Take Control of Your Career Path?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Join hundreds of engineering students uncovering high-fit careers and executing weekly learning milestones.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Your Assessment</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Launch 1-Click Demo</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
