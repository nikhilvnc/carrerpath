import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { 
  User, 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save,
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    college: '',
    graduationYear: 2026,
    experienceLevel: 'Beginner',
    bio: '',
    desiredCareer: 'Full Stack Developer',
    preferredJobType: 'Full-time',
    targetIndustry: 'Technology / SaaS',
    preferredLocation: 'Hybrid / Remote',
    hoursPerWeek: 15,
    skills: []
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(60);
  const [newSkillCategory, setNewSkillCategory] = useState('Programming');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill from existing profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.name || '',
        degree: profile.degree || 'B.Tech',
        branch: profile.branch || 'Computer Science and Engineering',
        college: profile.college || '',
        graduationYear: profile.graduation_year || 2026,
        experienceLevel: profile.experience_level || 'Beginner',
        bio: profile.bio || '',
        desiredCareer: profile.desired_career || 'Full Stack Developer',
        preferredJobType: profile.preferred_job_type || 'Full-time',
        targetIndustry: profile.target_industry || 'Technology / SaaS',
        preferredLocation: profile.preferred_location || 'Hybrid / Remote',
        hoursPerWeek: profile.hours_per_week || 15,
        skills: (profile.skills || []).map(s => ({
          skillId: s.skill_id || s.id,
          name: s.name || s.skill_name,
          category: s.category || 'General',
          proficiencyLevel: s.proficiency_level || 50
        }))
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' || name === 'hoursPerWeek' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    // Check duplicate
    if (formData.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setErrorMsg('Skill already added.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: newSkillName.trim(),
          category: newSkillCategory,
          proficiencyLevel: parseInt(newSkillProficiency, 10) || 50
        }
      ]
    }));

    setNewSkillName('');
    setNewSkillProficiency(60);
    setErrorMsg('');
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  };

  const handleSkillLevelChange = (index, newLevel) => {
    const updated = [...formData.skills];
    updated[index].proficiencyLevel = parseInt(newLevel, 10);
    setFormData(prev => ({ ...prev, skills: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await profileAPI.updateProfile(formData);
      await refreshProfile();
      setSuccessMsg('Your student profile and skills were updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-brand-400" />
            <span>Student Profile & Skills</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep your academic background, experience, and skills up-to-date for accurate AI career matching.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Academic & Education */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <GraduationCap className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-white text-base">Academic Background</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech / B.E. / B.S."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Major / Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                min="2020"
                max="2035"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Skills & Proficiency Manager */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Technical Skills & Proficiency</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {formData.skills.length} Skills Listed
            </span>
          </div>

          {/* Add Skill Row */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-brand-300">Add Technical Skill:</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Skill name (e.g. React, SQL, Java)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              />

              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:border-brand-500 outline-none"
              >
                <option value="Programming">Programming</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>
          </div>

          {/* Current Skills List */}
          <div className="space-y-3">
            {formData.skills.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No technical skills added yet. Add languages and tools to calculate skill gap analysis accurately.
              </p>
            ) : (
              formData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="w-full sm:w-1/3 flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{skill.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {skill.category}
                    </span>
                  </div>

                  <div className="w-full sm:w-1/2 flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={skill.proficiencyLevel}
                      onChange={(e) => handleSkillLevelChange(idx, e.target.value)}
                      className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <span className="text-xs font-mono font-bold text-sky-400 min-w-[40px] text-right">
                      {skill.proficiencyLevel}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    title="Remove skill"
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors self-end sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Experience & Career Goals */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Career Aspirations & Time Commitment</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target / Desired Career</label>
              <input
                type="text"
                name="desiredCareer"
                value={formData.desiredCareer}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer, Data Scientist"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              >
                <option value="Beginner">Beginner (College Student / Explorer)</option>
                <option value="Intermediate">Intermediate (Has built 1-2 projects / coursework)</option>
                <option value="Advanced">Advanced (Prior internship / published apps)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Job Type</label>
              <select
                name="preferredJobType"
                value={formData.preferredJobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              >
                <option value="Full-time">Full-time Graduate Role</option>
                <option value="Internship">Summer / Winter Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hours Available Per Week for Learning</label>
              <input
                type="number"
                name="hoursPerWeek"
                min="5"
                max="60"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Short Bio / Passion Statement</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your current engineering interests and what kind of technical challenges excite you..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save CTA */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Profile...' : 'Save Profile & Update Matching'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
