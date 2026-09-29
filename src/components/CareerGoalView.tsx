import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Compass,
  Check,
  Zap,
} from 'lucide-react';
import { CareerGoal, StudentProfile } from '../types';
import { CAREER_GOALS_LIST } from '../data/learningData';

interface CareerGoalViewProps {
  profile: StudentProfile;
  onSelectGoal: (goal: CareerGoal) => void;
  onNavigateToRoadmap: () => void;
}

export const CareerGoalView: React.FC<CareerGoalViewProps> = ({
  profile,
  onSelectGoal,
  onNavigateToRoadmap,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal>(profile.goal);
  const [showUndecidedQuiz, setShowUndecidedQuiz] = useState(
    profile.goal === "I'm not sure yet"
  );

  // Undecided quiz states
  const [interestType, setInterestType] = useState<
    'building_apps' | 'math_ai' | 'hardware_iot' | 'security' | null
  >(null);

  const handleApplyGoal = (goal: CareerGoal) => {
    setSelectedGoal(goal);
    onSelectGoal(goal);
    if (goal === "I'm not sure yet") {
      setShowUndecidedQuiz(true);
    } else {
      setShowUndecidedQuiz(false);
    }
  };

  const getQuizRecommendation = () => {
    if (interestType === 'building_apps') {
      return {
        goal: 'Software Development' as CareerGoal,
        reason: 'You enjoy writing structured code, working with data models, and creating reliable software.',
      };
    }
    if (interestType === 'math_ai') {
      return {
        goal: 'AI / Machine Learning' as CareerGoal,
        reason: 'You like probability, statistics, and training models to find patterns in data.',
      };
    }
    if (interestType === 'hardware_iot') {
      return {
        goal: 'Core Engineering' as CareerGoal,
        reason: 'You enjoy working close to the hardware, microcontrollers, circuits, and physical systems.',
      };
    }
    if (interestType === 'security') {
      return {
        goal: 'Cybersecurity' as CareerGoal,
        reason: 'You are curious about network protocols, defensive architecture, and preventing vulnerabilities.',
      };
    }
    return null;
  };

  const recommendation = getQuizRecommendation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
            Career Direction & Target Role
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Where do you want to go?
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            «Your goal helps us create a more relevant learning direction.»
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToRoadmap}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs self-start md:self-auto"
        >
          <span>See Roadmap for {selectedGoal}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Undecided Explorer Callout if "I'm not sure yet" */}
      {selectedGoal === "I'm not sure yet" && (
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-950">
                «That's okay. We'll help you explore possible directions based on your branch, interests, skills, and progress.»
              </h2>
              <p className="text-xs text-amber-900/80 leading-relaxed mt-1">
                More than 60% of 1st and 2nd year B.Tech students are still discovering what domain sparks their curiosity. Use this quick 1-click compass to test your interest profile:
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              What kind of engineering problems excite you most?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'building_apps' as const,
                  title: '💻 Building Applications',
                  desc: 'Writing logic, web backends, APIs, and software products',
                },
                {
                  id: 'math_ai' as const,
                  title: '🤖 Algorithms & Data Models',
                  desc: 'Machine learning, statistics, pattern detection, and intelligence',
                },
                {
                  id: 'hardware_iot' as const,
                  title: '⚙️ Hardware & Physical Systems',
                  desc: 'Microcontrollers, embedded C, sensors, robotics, and CAD',
                },
                {
                  id: 'security' as const,
                  title: '🔐 Defense & Networks',
                  desc: 'Investigating vulnerabilities, packet inspection, and system defense',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setInterestType(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    interestType === opt.id
                      ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/80 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 mb-1">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-slate-600">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {recommendation && (
            <div className="p-4 rounded-xl bg-white border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
              <div>
                <span className="text-[11px] font-mono text-amber-700 font-bold uppercase">
                  Suggested Direction Match
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {recommendation.goal}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {recommendation.reason}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyGoal(recommendation.goal)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Set this as My Career Goal
              </button>
            </div>
          )}
        </section>
      )}

      {/* Goal Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Available B.Tech Career Trajectories
          </h2>
          <span className="text-xs text-slate-500">
            Select a card to recalibrate your entire platform roadmap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_GOALS_LIST.map((item) => {
            const isSelected = selectedGoal === item.goal;
            return (
              <div
                key={item.goal}
                onClick={() => handleApplyGoal(item.goal)}
                className={`cursor-pointer rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Goal</span>
                  </div>
                )}

                <div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {item.goal}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.shortDesc}
                  </p>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Key Competencies
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.primarySkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Roles: <span className="text-slate-700">{item.jobRoles[0]}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyGoal(item.goal);
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Goal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
