import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  Target,
  Route,
  TrendingUp,
  BrainCircuit,
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronRight,
  Code2,
  Cpu,
  Shield,
  Binary,
  Flame,
  Zap,
} from 'lucide-react';
import { BTechBranch, CareerGoal } from '../types';
import { BRANCH_DIRECTIONS } from '../data/learningData';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSelectBranchDemo: (branch: BTechBranch, goal: CareerGoal) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onSelectBranchDemo,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<BTechBranch>(
    'Computer Science & Engineering'
  );

  const journeySteps = [
    { label: 'Profile', desc: 'Branch & Year' },
    { label: 'Resume', desc: 'Auto Scan' },
    { label: 'Skills', desc: 'Demonstrated' },
    { label: 'Goal', desc: 'Career Track' },
    { label: 'Skill Gaps', desc: 'Identified' },
    { label: 'Direction', desc: 'Clear Roadmap' },
    { label: 'Progress', desc: 'Real Growth' },
  ];

  const howItWorksSteps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Tell us your branch, year, interests, and career goal.',
      icon: GraduationCap,
    },
    {
      num: '02',
      title: 'Upload Your Resume',
      desc: 'Upload your current resume and let the platform identify demonstrated skills.',
      icon: FileCheck2,
    },
    {
      num: '03',
      title: 'Understand Your Skills',
      desc: 'See the skills you already have and the skills that may need development.',
      icon: Search,
    },
    {
      num: '04',
      title: 'Choose Your Goal',
      desc: 'Select a career direction such as Software Development, AI/ML, Cybersecurity, etc.',
      icon: Target,
    },
    {
      num: '05',
      title: 'Get Your Direction',
      desc: 'Receive a personalized learning sequence with skills, topics, projects, and milestones.',
      icon: Route,
    },
  ];

  const branchesList: { name: BTechBranch; icon: string; short: string }[] = [
    { name: 'Computer Science & Engineering', icon: '💻', short: 'CSE' },
    { name: 'Artificial Intelligence & Machine Learning', icon: '🤖', short: 'AI/ML' },
    { name: 'Data Science', icon: '📊', short: 'DS' },
    { name: 'Cyber Security', icon: '🔐', short: 'Cyber' },
    { name: 'Electronics & Communication Engineering', icon: '📡', short: 'ECE' },
    { name: 'Electrical & Electronics Engineering', icon: '⚡', short: 'EEE' },
    { name: 'Mechanical Engineering', icon: '⚙️', short: 'Mech' },
    { name: 'Civil Engineering', icon: '🏗️', short: 'Civil' },
    { name: 'Information Technology', icon: '🌐', short: 'IT' },
    { name: 'Other', icon: '🚀', short: 'Other Branches' },
  ];

  const activeBranchData = BRANCH_DIRECTIONS[selectedBranch] || BRANCH_DIRECTIONS['Other'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-white">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Subtle Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Know where you are. Discover where to go next.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6 text-balance">
            Navigate Your Future
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            A personalized career and learning platform built for B.Tech students.
            Understand your current skills, discover what you're missing, and get
            a clear path toward your career goal.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                onSelectBranchDemo('Computer Science & Engineering', 'Software Development')
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Demo Dashboard</span>
            </button>
          </div>

          {/* Visual Representation of the Platform's Journey */}
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-4xl mx-auto text-left shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>The B.Tech Career Navigation Journey</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                sequential roadmap
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 relative">
              {journeySteps.map((step, idx) => (
                <div
                  key={step.label}
                  className="flex flex-col p-3 rounded-lg bg-white border border-slate-200 relative group hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      0{idx + 1}
                    </span>
                    {idx < 6 && (
                      <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-xs hidden md:inline">
                        →
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-snug">
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Questions Section (Not Generic LMS) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Answering the 4 Real Questions of B.Tech
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Navigate Your Future is not a course marketplace. It helps you cut
              through information overload and navigate with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-2">
                QUESTION 01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                «What do I know?»
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Objective resume parsing highlights the tools, languages, and
                coursework you have already demonstrated or practiced.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-2">
                QUESTION 02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                «What am I missing?»
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Targeted skill-gap detection maps your current profile directly
                against the real requirements of your target engineering role.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-2">
                QUESTION 03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                «What should I learn next?»
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A staged, sequential roadmap so you never face the paralysis of
                deciding between 50 different tutorials at once.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-2">
                QUESTION 04
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                «Where can these skills take me?»
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Portfolio-ready capstone recommendations and industry job track
                alignments matching your specific engineering branch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works (5-Step Section with connecting lines) */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Proven 5-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How It Works
            </h2>
            <p className="text-base text-slate-600 mt-2">
              From first-year orientation to final-year placements, follow a clear
              navigational roadmap.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line behind steps on desktop */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-8 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {howItWorksSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs transition-all text-center items-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 mb-1">
                      Step {step.num}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Navigate Your Future? (4 feature cards) */}
      <section id="why-us" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Engineered For Results
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Why Navigate Your Future?
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Unlike generic platforms with uncurated libraries, we guide your
              engineering journey step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Personalized
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recommendations based on your branch, year, interests, and current
                progress rather than generic top-10 course lists that waste your
                semester.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-3">🔎</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Skill Gap Detection
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Know which skills may be missing for your chosen career goal with
                honest, transparent classification (demonstrated, mentioned, or
                not detected).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-3">🧭</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Clear Direction
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Know what to learn next instead of feeling overwhelmed by hundreds
                of trending frameworks, libraries, and conflicting online opinions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-3">📈</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor learning progress, completed topics, demonstrated skills,
                and milestone projects in an interactive student dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supported B.Tech Branches Section */}
      <section id="branches" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Branch-Adaptive Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Supported B.Tech Branches
            </h2>
            <p className="text-base text-slate-600 mt-2">
              We do not restrict the platform to CSE. Select your engineering
              discipline to preview how your learning direction adapts.
            </p>
          </div>

          {/* Branch Pill Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {branchesList.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelectedBranch(b.name)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedBranch === b.name
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.short}</span>
              </button>
            ))}
          </div>

          {/* Branch Detail Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-semibold text-indigo-600 uppercase">
                  Adaptive Trajectory
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedBranch}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeBranchData.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onSelectBranchDemo(selectedBranch, activeBranchData.sampleGoal)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
              >
                <span>Preview {selectedBranch.split(' ')[0]} Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sequence flow */}
            <div className="pt-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Recommended Learning Sequence
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeBranchData.sequence.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-indigo-600 font-bold">
                        {idx + 1}.
                      </span>
                      <span>{step}</span>
                    </div>
                    {idx < activeBranchData.sequence.length - 1 && (
                      <span className="text-slate-300 font-mono">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer Call to Action */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-6 text-indigo-300">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to find your direction?
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto mb-8">
            Create your B.Tech profile, analyze your current skills, and get your
            tailored roadmap today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-indigo-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onSelectBranchDemo('Computer Science & Engineering', 'Software Development')
              }
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-800/80 hover:bg-indigo-800 text-white text-sm font-semibold rounded-xl border border-indigo-700 transition-colors"
            >
              Explore Live Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">
              Navigate Your Future
            </span>
            <span aria-hidden="true">·</span>
            <span>Personalized B.Tech Career & Learning Platform</span>
          </div>
          <div>© 2026 Navigate Your Future. Built for Engineering Students.</div>
        </div>
      </footer>
    </div>
  );
};
