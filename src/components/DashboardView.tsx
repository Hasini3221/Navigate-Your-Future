import React from 'react';
import {
  FileText,
  Compass,
  BookOpen,
  BarChart2,
  Rocket,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Target,
  PlusCircle,
} from 'lucide-react';
import {
  ActiveTab,
  CourseTopic,
  DetectedSkill,
  ProjectItem,
  RoadmapNode,
  StudentProfile,
} from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  roadmap: RoadmapNode[];
  continueTopics: CourseTopic[];
  skills: DetectedSkill[];
  recommendedProject?: ProjectItem;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTopic: (topic: CourseTopic) => void;
  onOpenProject: (project: ProjectItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  roadmap,
  continueTopics,
  skills,
  recommendedProject,
  setActiveTab,
  onOpenTopic,
  onOpenProject,
}) => {
  // Find current node in roadmap
  const currentNode =
    roadmap.find((r) => r.status === 'current') ||
    roadmap.find((r) => r.status === 'up_next') ||
    roadmap[0];

  const upNextNode =
    roadmap.find((r) => r.status === 'up_next') ||
    roadmap[1] ||
    currentNode;

  // New user condition
  const isNewUser = profile.overallProgress === 0 && !profile.resumeUploaded && skills.length === 0;

  // Project fallback
  const activeProject = recommendedProject || {
    id: 'proj-default',
    title: `${profile.goal} Capstone Project`,
    branch: profile.branch,
    difficulty: 'Beginner',
    skills: skills.length > 0 ? skills.slice(0, 3).map((s) => s.name) : ['Core CS', 'Git', 'CLI'],
    summary: 'Build a practical, portfolio-ready project demonstrating your foundational engineering knowledge.',
    fullDescription: '',
    deliverables: [],
    resumeBulletExample: '',
    tags: ['Portfolio'],
    completed: false,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 0. New User Friendly Welcome Banner (Requirement 3) */}
      {isNewUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-indigo-950">
                Welcome, {profile.name}! Complete your profile to personalize your learning journey.
              </h2>
              <p className="text-xs text-indigo-800 mt-1 max-w-2xl leading-relaxed">
                Upload your resume or syllabus in the Resume tab to detect your current engineering skills and discover your exact placement gaps.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs self-start sm:self-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume Now</span>
          </button>
        </div>
      )}

      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {profile.name} 👋
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            «Let's see where you are and what you should learn next.»
          </p>

          {/* Compact Profile Summary */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Branch:</span>
            <span>{profile.branch}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-semibold text-slate-800">Year:</span>
            <span>{profile.year}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-semibold text-slate-800">Goal:</span>
            <span className="text-indigo-600 font-semibold">{profile.goal}</span>
            <button
              type="button"
              onClick={() => setActiveTab('goal-selection')}
              className="text-xs text-slate-400 hover:text-indigo-600 underline ml-1"
            >
              (change)
            </button>
          </div>
        </div>

        {/* Overall Learning Progress Widget */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs self-start md:self-auto min-w-[280px]">
          <div className="relative flex items-center justify-center">
            {/* Circular progress visual */}
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-indigo-600 transition-all duration-500 ease-out"
                fill="transparent"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * profile.overallProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 text-sm font-mono tabular-nums">
              {profile.overallProgress}%
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Learning Progress
            </div>
            <div className="text-xs text-slate-600 mt-1 leading-tight">
              {profile.overallProgress === 0
                ? '«Get started by completing foundational topics or uploading your resume.»'
                : '«You are making steady progress toward your current goal.»'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Most Prominent Dashboard Card: 🧭 My Direction */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-300">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
                  Primary Sequence
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Your Current Direction
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('direction')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-950 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm self-start sm:self-auto"
            >
              <span>View My Direction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dynamic Sequential Path */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 mb-6">
            <div className="text-xs text-indigo-200 mb-3 font-medium">
              Goal Road:{' '}
              {roadmap.length > 0
                ? roadmap.map((n) => n.title.split(' ')[0]).join(' → ')
                : 'Foundations → Core Skills → Projects'}
            </div>

            {/* Dynamic visual stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
              {roadmap.slice(0, 7).map((step) => {
                const isActive = step.status === 'current';
                const isDone = step.status === 'completed';
                return (
                  <div
                    key={step.id}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-white text-indigo-950 font-bold border-white shadow-md ring-2 ring-indigo-400'
                        : isDone
                        ? 'bg-white/15 text-indigo-100 border-white/10'
                        : 'bg-black/15 text-indigo-300/70 border-white/5'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono tracking-wider mb-0.5 opacity-80">
                      {isActive
                        ? '● You Are Here'
                        : isDone
                        ? '✓ Complete'
                        : 'Step'}
                    </div>
                    <div className="text-xs truncate">{step.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Current Stage and Next Step banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/20 rounded-xl p-3.5 border border-white/10 flex items-start gap-3">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold">
                01
              </span>
              <div>
                <span className="text-indigo-300 font-medium block">
                  Current Stage
                </span>
                <span className="text-sm font-semibold text-white">
                  {currentNode?.title || 'Foundations'}
                </span>
                <p className="text-indigo-200/90 text-xs mt-0.5">
                  {currentNode?.subtitle || 'Master the essential building blocks'}
                </p>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-3.5 border border-white/10 flex items-start gap-3">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                02
              </span>
              <div>
                <span className="text-indigo-300 font-medium block">Next Step</span>
                <span className="text-sm font-semibold text-white">
                  {currentNode?.keyTopics?.[0] || upNextNode?.title || 'Core Problem Solving'}
                </span>
                <p className="text-indigo-200/90 text-xs mt-0.5">
                  {currentNode?.whyThisNext || 'Directly prepares you for the next milestone.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dashboard Multi-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: 📄 Resume Intelligence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Resume Intelligence
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Resume Status
            </h3>

            {profile.resumeUploaded ? (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {profile.resumeFileName || 'Resume uploaded'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 pl-6">
                  {profile.resumeFileSize || '1.4 MB'} · Uploaded {profile.resumeUploadDate || 'Recently'}
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
                Upload your resume to discover your demonstrated skills and missing gaps.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            {profile.resumeUploaded ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-center"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-center"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-center shadow-xs"
                >
                  Analyze
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('resume')}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Resume</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: 📊 Dynamic Skill Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Demonstrated vs Gap
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Skill Snapshot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Competency estimates for your selected track ({profile.goal}):
            </p>

            {/* Dynamic List of skills */}
            <div className="space-y-3">
              {skills.length > 0 ? (
                skills.slice(0, 4).map((item) => (
                  <div key={item.id || item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {item.proficiencyScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.proficiencyScore >= 60
                            ? 'bg-emerald-500'
                            : item.proficiencyScore >= 30
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.proficiencyScore}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-500 mb-3">
                    No skills recorded yet. Scan your resume or add coursework skills.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('resume')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors border border-indigo-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Scan or Add Skills</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('skill-gap')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-1 transition-colors"
            >
              <span>View All Skills & Gaps</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: 🚀 Milestone / Recommended Project */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                Milestone Project
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeProject.title}
            </h3>

            <div className="text-xs text-slate-500 mb-3">
              Difficulty:{' '}
              <span className="font-semibold text-slate-700">
                {activeProject.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
              {activeProject.summary}
            </p>

            <div className="text-xs text-slate-600 mb-2">
              <span className="font-semibold text-slate-700">Skills applied: </span>
              <span>{activeProject.skills.join(' • ')}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onOpenProject(activeProject)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Explore Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Continue Learning (3-4 currently recommended topics) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Continue Learning
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active topics aligned with your current learning stage:
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('courses-skills')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors self-start sm:self-auto"
          >
            Browse Full Library →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {continueTopics.slice(0, 4).map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-indigo-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-medium text-slate-600">{topic.category}</span>
                  <span className="font-mono text-slate-700 font-semibold tabular-nums">
                    {topic.progress}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  {topic.title}
                </h4>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenTopic(topic)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-2 border-t border-slate-200/60"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
