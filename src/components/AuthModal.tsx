import React, { useState } from 'react';
import { X, Compass, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { BTechBranch, BTechYear, CareerGoal, StudentProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onAuthenticate: (profile: StudentProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onAuthenticate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@btech.edu');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [branch, setBranch] = useState<BTechBranch>('Computer Science & Engineering');
  const [year, setYear] = useState<BTechYear>('2nd Year');
  const [careerInterest, setCareerInterest] = useState<CareerGoal>('Software Development');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
    }

    // Realistic authenticated profile
    const profile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: fullName || 'Aarav Sharma',
      email: email || 'aarav.sharma@btech.edu',
      branch,
      year,
      goal: careerInterest,
      resumeUploaded: true,
      resumeFileName: `${(fullName || 'Aarav').replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: '1.4 MB',
      resumeUploadDate: 'Sep 24, 2026',
      overallProgress: 52,
    };

    onAuthenticate(profile);
    onClose();
  };

  const loadPreset = (
    name: string,
    mail: string,
    b: BTechBranch,
    y: BTechYear,
    g: CareerGoal
  ) => {
    setFullName(name);
    setEmail(mail);
    setBranch(b);
    setYear(y);
    setCareerInterest(g);
    setPassword('password123');
    setConfirmPassword('password123');

    const profile: StudentProfile = {
      id: `student-${Date.now()}`,
      name,
      email: mail,
      branch: b,
      year: y,
      goal: g,
      resumeUploaded: true,
      resumeFileName: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: '1.4 MB',
      resumeUploadDate: 'Sep 24, 2026',
      overallProgress: y === '1st Year' ? 18 : y === '2nd Year' ? 52 : y === '3rd Year' ? 68 : 84,
    };
    onAuthenticate(profile);
    onClose();
  };

  const branchOptions: BTechBranch[] = [
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

  const yearOptions: BTechYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const careerOptions: CareerGoal[] = [
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">
              Navigate Your Future
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase transition-colors text-center border-b-2 ${
              mode === 'signup'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase transition-colors text-center border-b-2 ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Login
          </button>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div className="p-3 bg-indigo-50/60 border-b border-indigo-100 text-xs text-indigo-900 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold flex items-center gap-1.5 text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            Quick Test Accounts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  'Aarav Sharma',
                  'aarav.sharma@btech.edu',
                  'Computer Science & Engineering',
                  '2nd Year',
                  'Software Development'
                )
              }
              className="px-2 py-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-[11px] font-medium text-indigo-700 transition-colors"
            >
              CSE 2nd Yr (Aarav)
            </button>
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  'Priya Patel',
                  'priya.patel@btech.edu',
                  'Artificial Intelligence & Machine Learning',
                  '3rd Year',
                  'AI / Machine Learning'
                )
              }
              className="px-2 py-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-[11px] font-medium text-indigo-700 transition-colors"
            >
              AI/ML 3rd Yr (Priya)
            </button>
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  'Rohan Verma',
                  'rohan.verma@btech.edu',
                  'Information Technology',
                  '1st Year',
                  "I'm not sure yet"
                )
              }
              className="px-2 py-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-[11px] font-medium text-indigo-700 transition-colors"
            >
              1st Yr Undecided
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {mode === 'signup' ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@btech.edu"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* B.Tech Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  B.Tech Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as BTechBranch)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year & Career Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as BTechYear)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Career Interest
                  </label>
                  <select
                    value={careerInterest}
                    onChange={(e) => setCareerInterest(e.target.value as CareerGoal)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {careerOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Already have an account? <span className="font-semibold text-indigo-600 underline">Login</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@btech.edu"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link simulated: check student mailbox.');
                    }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600">
                  Remember me on this browser
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Don't have an account? <span className="font-semibold text-indigo-600 underline">Sign Up</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
