import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  GraduationCap,
  Target,
  RefreshCcw,
  Check,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { BTechBranch, BTechYear, CareerGoal, StudentProfile } from '../types';

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [branch, setBranch] = useState<BTechBranch>(profile.branch);
  const [year, setYear] = useState<BTechYear>(profile.year);
  const [goal, setGoal] = useState<CareerGoal>(profile.goal);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setBranch(profile.branch);
    setYear(profile.year);
    setGoal(profile.goal);
  }, [profile]);

  const branches: BTechBranch[] = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Machine Learning',
    'Data Science',
    'Cyber Security',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Other',
  ];

  const years: BTechYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const goals: CareerGoal[] = [
    'Software Development',
    'Full-Stack Development',
    'AI / Machine Learning',
    'Data Science',
    'Data Analytics',
    'Cybersecurity',
    'Cloud / DevOps',
    'Mobile Development',
    'Core Engineering',
    "I'm not sure yet",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      branch,
      year,
      goal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & Academic Settings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Update your profile, engineering branch, current academic year, and career aspirations.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes updated successfully! Roadmap recalculating...</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Student Credentials & Identity</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 pt-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Academic Discipline & Year</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              B.Tech Engineering Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as BTechBranch)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Academic Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value as BTechYear)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 pt-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Target Career Goal</span>
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Industry Role
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as CareerGoal)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
          >
            {goals.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Changing this will recalibrate your skill gap analysis and sequential learning roadmap.
          </p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Reset Account Progress */}
      <section className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-rose-900 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Reset Account Learning Data</span>
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Reset all curriculum topics, skill gaps, and milestone progress for this account back to the starting state.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Reset all learning progress and resume data for ${profile.name}?`)) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset My Learning Progress</span>
        </button>
      </section>
    </div>
  );
};
