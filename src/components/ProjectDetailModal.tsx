import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, FileCheck2, ArrowRight, Check, Copy, Terminal, ExternalLink } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onToggleCompleted: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onToggleCompleted,
}) => {
  if (!project) return null;

  const [copiedBullet, setCopiedBullet] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const handleCopyBullet = () => {
    navigator.clipboard.writeText(project.resumeBulletExample);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 2000);
  };

  const sampleCloneCommand = `git clone https://github.com/btech-projects/${project.id}.git\ncd ${project.id} && npm install || mvn clean install`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(sampleCloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                {project.branch}
              </span>
              <span className="text-slate-300">·</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  project.difficulty === 'Beginner'
                    ? 'bg-emerald-50 text-emerald-700'
                    : project.difficulty === 'Intermediate'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}
              >
                {project.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Project Architecture & Overview
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Implementation Deliverables
            </h4>
            <div className="space-y-2">
              {project.deliverables.map((del, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies & Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Demonstrated Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map((sk) => (
                <span
                  key={sk}
                  className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Ready Resume Bullet with 1-click Copy */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resume Bullet Format</span>
              </div>
              <button
                type="button"
                onClick={handleCopyBullet}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {copiedBullet ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Bullet</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-800 italic leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              "{project.resumeBulletExample}"
            </p>
          </div>

          {/* Terminal Starter Scaffold */}
          <div className="p-4 bg-slate-950 text-slate-100 rounded-xl text-xs space-y-2 font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase">Scaffold Setup</span>
              </div>
              <button
                type="button"
                onClick={handleCopyClone}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedClone ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-emerald-400 overflow-x-auto text-[11px]">
              {sampleCloneCommand}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleCompleted(project.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              project.completed
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{project.completed ? 'Marked Completed' : 'Mark as Completed'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
