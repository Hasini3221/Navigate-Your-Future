import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Code2,
  FileCheck2,
  ExternalLink,
  Filter,
  Check,
} from 'lucide-react';
import { ProjectItem, StudentProfile } from '../types';

interface ProjectsViewProps {
  profile: StudentProfile;
  projects: ProjectItem[];
  onToggleProjectCompleted: (projectId: string) => void;
  onOpenProjectDetail: (project: ProjectItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  profile,
  projects,
  onToggleProjectCompleted,
  onOpenProjectDetail,
}) => {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredProjects = projects.filter((p) => {
    const matchBranch =
      selectedBranchFilter === 'All' || p.branch === selectedBranchFilter;
    const matchDiff =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchBranch && matchDiff;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
            Applied Engineering Portfolio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Recommended B.Tech Projects
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Build resume-ready portfolio pieces demonstrating end-to-end engineering rigor with quantifiable achievements.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredProjects.length}</span> projects
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Branch:</span>
          {['All', profile.branch, 'Computer Science & Engineering', 'Artificial Intelligence & Machine Learning', 'Cyber Security'].slice(0, 4).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBranchFilter(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedBranchFilter === b
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {b === 'All' ? 'All Branches' : b.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
              project.completed
                ? 'bg-slate-50/70 border-slate-200'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-indigo-600">
                  {project.branch}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    project.difficulty === 'Beginner'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : project.difficulty === 'Intermediate'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                >
                  {project.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {project.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {project.summary}
              </p>

              {/* Skills applied */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Demonstrated Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume bullet preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-indigo-600" />
                  <span>Ready Resume Bullet</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-snug">
                  "{project.resumeBulletExample}"
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onToggleProjectCompleted(project.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  project.completed
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{project.completed ? 'Completed' : 'Mark as Done'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenProjectDetail(project)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>View Full Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
