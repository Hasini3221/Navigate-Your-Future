import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  Compass,
  Download,
  BookOpen,
  Wrench,
  Check,
} from 'lucide-react';
import { CourseTopic, DetectedSkill, ProjectItem, StudentProfile } from '../types';

interface ProgressViewProps {
  profile: StudentProfile;
  topics: CourseTopic[];
  skills: DetectedSkill[];
  projects: ProjectItem[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  topics,
  skills,
  projects,
}) => {
  const completedTopics = topics.filter((t) => t.completed || t.progress === 100);
  const completedProjects = projects.filter((p) => p.completed);
  const demonstratedSkills = skills.filter((s) => s.status === 'demonstrated');

  // Breakdown by category
  const categories = [
    'Programming',
    'Data Structures & Algorithms',
    'Core Computer Science',
    'Development',
    'Emerging Technologies',
  ] as const;

  const categoryStats = categories.map((cat) => {
    const inCat = topics.filter((t) => t.category === cat);
    const doneInCat = inCat.filter((t) => t.completed || t.progress === 100);
    const avgProg =
      inCat.length > 0
        ? Math.round(
            inCat.reduce((acc, curr) => acc + curr.progress, 0) / inCat.length
          )
        : 0;
    return {
      category: cat,
      total: inCat.length,
      completed: doneInCat.length,
      percentage: avgProg,
    };
  });

  const milestones = [
    {
      year: '1st Year',
      goal: 'Foundations & Problem Solving',
      items: [
        'Mastered C / Python programming syntax and control structures',
        'Built CLI mini-projects with modular functions',
        'Understood Basic Math, Logic, and Engineering Physics/Chemistry',
      ],
      status: 'completed',
    },
    {
      year: '2nd Year',
      goal: 'Core DSA & Object-Oriented Architecture',
      items: [
        'Mastering Data Structures: Arrays, Strings, Stacks, Queues, Trees',
        'Database systems (SQL & Relational schema design)',
        'Object-Oriented Programming (Java/C++) and SOLID concepts',
      ],
      status: 'current',
    },
    {
      year: '3rd Year',
      goal: 'Full-Stack Systems, OS, Networks & Internships',
      items: [
        'Operating Systems, Computer Networks & System Design',
        'Industry internship with backend APIs or ML models',
        'End-to-End Capstone project with cloud deployment',
      ],
      status: 'upcoming',
    },
    {
      year: '4th Year',
      goal: 'Campus Placement Drives & Industry Transition',
      items: [
        'Technical mock rounds & behavioral interviews',
        'Advanced system design and scalability questions',
        'Accepting placement offer & engineering graduation',
      ],
      status: 'upcoming',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
            Student Analytics & Milestones
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            My Learning Progress
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time tracking of coursework, verified competencies, and placement readiness milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.print();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Print / Export Progress Summary</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Overall Readiness
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
            {profile.overallProgress}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Targeting {profile.goal}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Completed Topics
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {completedTopics.length} / {topics.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across 5 core domains
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Demonstrated Skills
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {demonstratedSkills.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified with evidence
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Milestone Projects
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {completedProjects.length} / {projects.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Portfolio capstone ready
          </p>
        </div>
      </div>

      {/* Domain Breakdown Bars */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-6">
          Competency Breakdown by Engineering Domain
        </h2>

        <div className="space-y-5">
          {categoryStats.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">
                  {item.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    {item.completed} of {item.total} mastered
                  </span>
                  <span className="font-mono font-bold text-indigo-600 tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Year B.Tech Milestone Matrix */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-900">
            4-Year B.Tech Career Milestone Road
          </h2>
          <span className="text-xs text-slate-400">
            Current Stage: {profile.year}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((m) => (
            <div
              key={m.year}
              className={`p-5 rounded-xl border ${
                m.status === 'completed'
                  ? 'bg-slate-50/70 border-slate-200'
                  : m.status === 'current'
                  ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    m.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.status === 'current'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m.year} · {m.status === 'current' ? '● You Are Here' : m.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {m.goal}
              </h3>

              <ul className="space-y-1.5 text-xs text-slate-600">
                {m.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
