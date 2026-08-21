import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentAPI, careerAPI, profileAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Code,
  Heart,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AssessmentPage = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Assessment Form State
  const [assessment, setAssessment] = useState({
    // Step 1: Academic
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || 'Computer Science and Engineering',
    graduationYear: profile?.graduation_year || 2026,
    academicFocus: 'Software Engineering',

    // Step 2: Technical Skills
    selectedSkills: ['Java', 'SQL', 'HTML5/CSS3', 'JavaScript'],
    skillLevel: 'Intermediate',

    // Step 3: Engineering Interests
    interests: ['Full-Stack Web Development', 'Artificial Intelligence & LLMs'],
    preferredTypeOfWork: 'Building customer-facing interactive web applications',

    // Step 4: Problem-Solving Preference
    problemSolvingStyle: 'System design, APIs, and connecting databases with modern UI',
    workEnvironment: 'Agile collaborative software engineering team',

    // Step 5: Goals & Learning Commitment
    desiredCareer: profile?.desired_career || 'Full Stack Developer',
    hoursPerWeek: 15,
    targetTimeline: '30-60 Days'
  });

  const totalSteps = 5;

  const handleSkillToggle = (skill) => {
    setAssessment(prev => {
      const exists = prev.selectedSkills.includes(skill);
      return {
        ...prev,
        selectedSkills: exists
          ? prev.selectedSkills.filter(s => s !== skill)
          : [...prev.selectedSkills, skill]
      };
    });
  };

  const handleInterestToggle = (interest) => {
    setAssessment(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Sync updated fields to student profile
      await profileAPI.updateProfile({
        degree: assessment.degree,
        branch: assessment.branch,
        graduationYear: parseInt(assessment.graduationYear, 10),
        desiredCareer: assessment.desiredCareer,
        hoursPerWeek: parseInt(assessment.hoursPerWeek, 10),
        experienceLevel: assessment.skillLevel,
        skills: assessment.selectedSkills.map(s => ({
          name: s,
          category: 'General',
          proficiencyLevel: 65
        }))
      });

      await refreshProfile();

      // 2. Call backend LLM Career Analysis API
      const answersPayload = {
        answers: [
          { stepNumber: 1, questionKey: 'academic', answer: { degree: assessment.degree, branch: assessment.branch } },
          { stepNumber: 2, questionKey: 'skills', answer: assessment.selectedSkills },
          { stepNumber: 3, questionKey: 'interests', answer: assessment.interests },
          { stepNumber: 4, questionKey: 'preferences', answer: { style: assessment.problemSolvingStyle, type: assessment.preferredTypeOfWork } },
          { stepNumber: 5, questionKey: 'goals', answer: { career: assessment.desiredCareer, hours: assessment.hoursPerWeek } },
        ]
      };

      await careerAPI.analyzeCareer(answersPayload);

      // Navigate to dashboard with fresh recommendations
      navigate('/dashboard');
    } catch (err) {
      console.error('Analysis failed', err);
      setError(err.message || 'AI career analysis encounter an error. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <LoadingSpinner message="CareerPath AI is generating your personalized recommendations..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 animate-fade-in">
      
      {/* Header & Step Indicator */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Student Career Assessment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Discover Your Ideal Career Trajectory
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Complete the 5-step assessment to feed our AI model with your skills, goals, and learning velocity.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto pt-4 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-brand-400 font-mono">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP CONTAINER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        
        {/* STEP 1: EDUCATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <GraduationCap className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-bold text-white">Step 1 / 5: Academic & Education</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Degree
                </label>
                <input
                  type="text"
                  value={assessment.degree}
                  onChange={(e) => setAssessment({ ...assessment, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.E. / B.S. in Computer Science"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={assessment.branch}
                  onChange={(e) => setAssessment({ ...assessment, branch: e.target.value })}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Graduation Year
                </label>
                <select
                  value={assessment.graduationYear}
                  onChange={(e) => setAssessment({ ...assessment, graduationYear: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none font-mono"
                >
                  <option value={2025}>2025 (Final Year / Graduating)</option>
                  <option value={2026}>2026 (Third Year)</option>
                  <option value={2027}>2027 (Second Year)</option>
                  <option value={2028}>2028 (Freshman)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TECHNICAL SKILLS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Code className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Step 2 / 5: Technical Foundations</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Select Languages & Technologies you have touched:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Java', 'Python', 'JavaScript', 'TypeScript', 'C++',
                  'SQL', 'React', 'HTML5/CSS3', 'Node.js', 'Express.js',
                  'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Linux'
                ].map((skill) => {
                  const selected = assessment.selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span>{skill}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Overall Experience Level
              </label>
              <select
                value={assessment.skillLevel}
                onChange={(e) => setAssessment({ ...assessment, skillLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              >
                <option value="Beginner">Beginner (Classroom exercises / Basic syntax)</option>
                <option value="Intermediate">Intermediate (Built 1-2 functional apps / coursework)</option>
                <option value="Advanced">Advanced (Prior internship / open source / production code)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: INTERESTS & DOMAINS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Step 3 / 5: Preferred Domains & Technologies</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Which domains do you find most exciting?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Full-Stack Web Development',
                  'Backend Engineering & Distributed Systems',
                  'Frontend Architecture & UI/UX',
                  'Artificial Intelligence & LLMs',
                  'Data Science & Analytics',
                  'Cloud Infrastructure & DevOps',
                  'Cybersecurity & Application Defense'
                ].map((domain) => {
                  const selected = assessment.interests.includes(domain);
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => handleInterestToggle(domain)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span>{domain}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: WORK PREFERENCES & PROBLEM SOLVING */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Step 4 / 5: Problem-Solving & Work Style</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  What type of technical tasks do you enjoy the most?
                </label>
                <select
                  value={assessment.problemSolvingStyle}
                  onChange={(e) => setAssessment({ ...assessment, problemSolvingStyle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
                >
                  <option value="System design, APIs, and connecting databases with modern UI">
                    Building complete features end-to-end (Frontend + Backend + DB)
                  </option>
                  <option value="Writing efficient database queries, server performance, and concurrency">
                    Deep backend algorithms, database schema tuning, and microservices
                  </option>
                  <option value="Analyzing data patterns, machine learning models, and statistics">
                    Exploring datasets, visualizing trends, and training predictive models
                  </option>
                  <option value="Automating deployments, CI/CD pipelines, and cloud containers">
                    Infrastructure automation, Docker, Kubernetes, and cloud security
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Preferred Work Environment
                </label>
                <select
                  value={assessment.workEnvironment}
                  onChange={(e) => setAssessment({ ...assessment, workEnvironment: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
                >
                  <option value="Agile collaborative software engineering team">
                    Agile Product Engineering Team (Startups / Tech Companies)
                  </option>
                  <option value="Enterprise Architecture and High-Volume Systems">
                    Enterprise Financial / Health Tech Scale (High reliability)
                  </option>
                  <option value="Remote / Global asynchronous team">
                    Asynchronous Remote Engineering Team
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: GOALS & LEARNING COMMITMENT */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Step 5 / 5: Goals & Time Commitment</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Primary Career Target (Optional)
                </label>
                <input
                  type="text"
                  value={assessment.desiredCareer}
                  onChange={(e) => setAssessment({ ...assessment, desiredCareer: e.target.value })}
                  placeholder="e.g. Full Stack Developer, Data Scientist, Cloud Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hours Available Per Week for Dedicated Learning: <strong className="text-brand-400 font-mono">{assessment.hoursPerWeek} hrs/week</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={assessment.hoursPerWeek}
                  onChange={(e) => setAssessment({ ...assessment, hoursPerWeek: parseInt(e.target.value, 10) })}
                  className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-850 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>5 hrs (Casual)</span>
                  <span>15 hrs (Recommended)</span>
                  <span>40 hrs (Intensive)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRunAnalysis}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center gap-2 animate-pulse-subtle"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Career Path</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
