import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  ChevronRight,
  TrendingUp,
  Check,
} from 'lucide-react';
import { CourseTopic, DetectedSkill, SkillGapItem, StudentProfile } from '../types';

interface SkillGapViewProps {
  profile: StudentProfile;
  skills: DetectedSkill[];
  skillGaps: SkillGapItem[];
  onToggleGapCompletion: (id: string) => void;
  onOpenTopicBySkillName: (skillName: string) => void;
  onNavigateToRoadmap: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  skills,
  skillGaps,
  onToggleGapCompletion,
  onOpenTopicBySkillName,
  onNavigateToRoadmap,
}) => {
  const demonstratedSkills = skills.filter((s) => s.status === 'demonstrated');

  // Filter skills to develop
  const completedGapsCount = skillGaps.filter((g) => g.completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
              Target Career Role
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Skill Gap Analysis for {profile.goal}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Compare your demonstrated competencies with industry standards to focus your study time on high-leverage topics.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToRoadmap}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs self-start md:self-auto"
        >
          <span>View Sequential Direction</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Language policy callout */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Guidance Principle:</span> We formulate learning items as <span className="font-semibold underline">recommended next skills</span> rather than rigid barriers. Every student develops at their own cadence based on their semester goals and prior exposure.
        </div>
      </div>

      {/* 1. Skills You Already Have */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Skills You Already Have
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-medium">
            {demonstratedSkills.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {demonstratedSkills.map((sk) => (
            <div
              key={sk.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {sk.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {sk.category}
                </span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Demonstrated
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Skills To Develop */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Skills to Develop
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by importance and relevance to {profile.goal}:
            </p>
          </div>
          <div className="text-xs text-slate-600">
            Completed: <span className="font-bold text-slate-900">{completedGapsCount}</span> of {skillGaps.length}
          </div>
        </div>

        <div className="space-y-4">
          {skillGaps.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleGapCompletion(item.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-500'
                    }`}
                    title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        0{idx + 1}.
                      </span>
                      <h3
                        className={`text-sm font-bold ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </h3>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                          item.importance === 'Foundational'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : item.importance === 'High'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.importance} Importance
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                      {item.whyNeeded}
                    </p>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                      <span>
                        <strong className="text-slate-700">Stage:</strong> {item.recommendedStage}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        <strong className="text-slate-700">Recommended action:</strong> {item.actionItem}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenTopicBySkillName(item.name)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Start Learning</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
