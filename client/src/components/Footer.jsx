import React from 'react';
import { Compass, Heart, Github, Sparkles, Shield, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">CareerPath AI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Empowering college students and aspiring engineers to discover tailored tech career paths, bridge critical skill gaps, and execute weekly milestone roadmaps.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-850 text-slate-300 border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                Gemini LLM Driven
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-850 text-slate-300 border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Zero PII Exposure
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/assessment" className="hover:text-white transition-colors">Career Assessment</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Skill Gap Matrix</a></li>
              <li><a href="/roadmap" className="hover:text-white transition-colors">Learning Roadmaps</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors">Portfolio Projects</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Architecture & Docs</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1 text-slate-300">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>PostgreSQL + Express + React</span>
              </li>
              <li><span className="text-xs text-slate-500">Modular Monolith Architecture</span></li>
              <li><span className="text-xs text-slate-500">Structured JSON AI Output</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CareerPath AI. Built for Academic & Engineering Hackathon Excellence.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>REST API Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
