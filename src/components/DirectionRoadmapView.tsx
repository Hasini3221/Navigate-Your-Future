import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Code2,
  Rocket,
  Check,
  Circle,
  HelpCircle,
} from 'lucide-react';
import { ProjectItem, RoadmapNode, StudentProfile } from '../types';

interface DirectionRoadmapViewProps {
  profile: StudentProfile;
  roadmap: RoadmapNode[];
  onSetRoadmapNodeStatus: (
    nodeId: string,
    status: 'completed' | 'current' | 'up_next' | 'later'
  ) => void;
  onOpenProject: (project: ProjectItem) => void;
}

export const DirectionRoadmapView: React.FC<DirectionRoadmapViewProps> = ({
  profile,
  roadmap,
  onSetRoadmapNodeStatus,
  onOpenProject,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    roadmap.find((n) => n.status === 'current')?.id || roadmap[0]?.id || 'node-3'
  );

  const activeNode =
    roadmap.find((n) => n.id === selectedNodeId) ||
    roadmap.find((n) => n.status === 'current') ||
    roadmap[0];

  const currentNode = roadmap.find((n) => n.status === 'current');
  const upNextNode = roadmap.find((n) => n.status === 'up_next');

  const metaPipeline = [
    { label: 'Profile', desc: `${profile.branch.split(' ')[0]} · ${profile.year}` },
    { label: 'Current Skills', desc: 'Analyzed & Verified' },
    { label: 'Skill Gaps', desc: 'Role Prioritized' },
    { label: 'Recommended Topics', desc: 'Sequential Order' },
    { label: 'Practice Projects', desc: 'Resume Portfolios' },
    { label: 'Next Stage', desc: 'Placement Ready' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
              Signature Navigation Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Your Learning Direction
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            A staged, milestone-driven trajectory designed for {profile.name} ({profile.branch}, {profile.year}) toward <strong className="text-indigo-600">{profile.goal}</strong>.
          </p>
        </div>

        {/* Status Callout Pill Box */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-indigo-700 font-semibold">You Are Here:</span>
            <span className="text-slate-900 font-bold">{currentNode?.title || 'DSA Foundations'}</span>
          </div>

          {upNextNode && (
            <button
              type="button"
              onClick={() => {
                if (currentNode) {
                  onSetRoadmapNodeStatus(currentNode.id, 'completed');
                }
                onSetRoadmapNodeStatus(upNextNode.id, 'current');
                setSelectedNodeId(upNextNode.id);
              }}
              className="px-3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              title="Mark current stage complete and advance 'You are here'"
            >
              <span>Advance to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Roadmap Completion Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Roadmap Progress:</span>
          <span className="text-slate-500">
            {roadmap.filter((n) => n.status === 'completed').length} of {roadmap.length} stages completed
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  (roadmap.filter((n) => n.status === 'completed').length /
                    Math.max(roadmap.length, 1)) *
                    100
                )}%`,
              }}
            />
          </div>
          <span className="font-mono font-bold text-slate-800 tabular-nums">
            {Math.round(
              (roadmap.filter((n) => n.status === 'completed').length /
                Math.max(roadmap.length, 1)) *
                100
            )}%
          </span>
        </div>
      </div>

      {/* High-Level Journey Pipeline */}
      <section className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Architecture of Your Navigation
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {metaPipeline.map((step, idx) => (
            <div
              key={step.label}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <div className="text-[10px] font-mono text-indigo-600 font-bold mb-1">
                Phase 0{idx + 1}
              </div>
              <div className="text-xs font-bold text-slate-900">{step.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Next Panel */}
      <section className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-800 uppercase">
                Why this next?
              </span>
              <span className="text-xs text-indigo-600">
                (Adaptive Sequencing Rationale)
              </span>
            </div>
            <h3 className="text-sm font-bold text-indigo-950">
              «Based on your selected goal and current progress, these topics build on the skills you've already started developing.»
            </h3>
            <p className="text-xs text-indigo-900/80 leading-relaxed pt-1">
              Currently focused on <strong className="text-indigo-950">{currentNode?.title}</strong>. Once completed, your direction smoothly unlocks <strong className="text-indigo-950">{upNextNode?.title || 'SQL & DBMS'}</strong>, ensuring prerequisite concepts are mastered before complex system architectures are introduced.
            </p>
          </div>
        </div>
      </section>

      {/* Main Roadmap & Detail Stage Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Vertical Flow (Nodes) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              Learning Nodes Sequence
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {roadmap.length} Milestones
            </span>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {roadmap.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const isCompleted = node.status === 'completed';
              const isCurrent = node.status === 'current';
              const isUpNext = node.status === 'up_next';

              return (
                <div key={node.id} className="relative group">
                  {/* Indicator Dot on the vertical line */}
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110'
                        : isUpNext
                        ? 'bg-white border-indigo-500 text-indigo-600'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold">
                        {index + 1}
                      </span>
                    )}
                  </button>

                  {/* Stage Card */}
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isUpNext
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCompleted
                          ? '✓ Completed'
                          : isCurrent
                          ? '● You Are Here'
                          : isUpNext
                          ? '▲ Up Next'
                          : 'Later'}
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {node.timeEstimate}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {node.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {node.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Node Deep-Dive Inspector */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 sticky top-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    activeNode.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeNode.status === 'current'
                      ? 'bg-indigo-100 text-indigo-800'
                      : activeNode.status === 'up_next'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {activeNode.status === 'completed'
                    ? 'Completed Stage'
                    : activeNode.status === 'current'
                    ? 'Current Stage: You Are Here'
                    : activeNode.status === 'up_next'
                    ? 'Up Next in Roadmap'
                    : 'Later Stage'}
                </span>
                <span className="text-xs text-slate-400">
                  Order: #{activeNode.order}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {activeNode.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeNode.subtitle}
              </p>
            </div>

            {/* Quick status switcher button */}
            <div className="flex items-center gap-2">
              {activeNode.status !== 'completed' ? (
                <button
                  type="button"
                  onClick={() =>
                    onSetRoadmapNodeStatus(activeNode.id, 'completed')
                  }
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Stage Completed</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onSetRoadmapNodeStatus(activeNode.id, 'current')
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Set as Current Focus
                </button>
              )}
            </div>
          </div>

          {/* Rationale for this stage */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Why this stage is positioned here
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {activeNode.whyThisNext}
            </div>
          </div>

          {/* Key Topics in Stage */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Core Technical Topics to Master
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeNode.keyTopics.map((topic, i) => (
                <div
                  key={topic}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span className="font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Stage Project */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Applied Stage Milestone Project
            </h4>
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-bold text-slate-900">
                    {activeNode.recommendedProject.title}
                  </h5>
                  <span className="text-[11px] font-medium text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded">
                    {activeNode.recommendedProject.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeNode.recommendedProject.description}
                </p>
                <div className="text-[11px] text-slate-500 mt-2">
                  <span className="font-semibold text-slate-700">Skills applied: </span>
                  {activeNode.recommendedProject.skills.join(', ')}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-indigo-200/60 flex items-center justify-between">
                <span className="text-xs text-indigo-700 font-medium">
                  Portfolio Capstone Deliverable
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenProject({
                      id: `roadmap-proj-${activeNode.id}`,
                      title: activeNode.recommendedProject.title,
                      branch: profile.branch,
                      difficulty: activeNode.recommendedProject.difficulty,
                      skills: activeNode.recommendedProject.skills,
                      summary: activeNode.recommendedProject.description,
                      fullDescription: activeNode.recommendedProject.description,
                      deliverables: [
                        'Architecture Blueprint & Schema design',
                        'Modular clean implementation in target language',
                        'Automated unit and integration test coverage',
                        'GitHub Readme with live demo instructions',
                      ],
                      resumeBulletExample: `Engineered ${activeNode.recommendedProject.title} applying ${activeNode.recommendedProject.skills.join(', ')} with high performance and test coverage.`,
                      tags: activeNode.recommendedProject.skills,
                      completed: false,
                    })
                  }
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                >
                  <span>Explore Project Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
