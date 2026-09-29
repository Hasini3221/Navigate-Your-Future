import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Code2,
  Wrench,
  Check,
  Copy,
  ChevronRight,
  Brain,
  Lightbulb,
} from 'lucide-react';
import { CourseTopic } from '../types';

interface TopicDetailModalProps {
  topic: CourseTopic | null;
  onClose: () => void;
  onUpdateProgress: (topicId: string, progress: number, completed: boolean) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  onUpdateProgress,
}) => {
  if (!topic) return null;

  const [activeTab, setActiveTab] = useState<'syllabus' | 'quiz' | 'code'>('syllabus');
  const [currentProgress, setCurrentProgress] = useState(topic.progress);
  const [completedList, setCompletedList] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  const isCompleted = topic.completed || currentProgress === 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentProgress(val);
    onUpdateProgress(topic.id, val, val === 100);
  };

  const handleToggleComplete = () => {
    const next = !isCompleted;
    const nextProg = next ? 100 : 40;
    setCurrentProgress(nextProg);
    onUpdateProgress(topic.id, nextProg, next);
  };

  const toggleSyllabusItem = (item: string) => {
    setCompletedList((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Fallback demo quiz if not explicitly provided
  const quizQuestions = topic.quiz && topic.quiz.length > 0 ? topic.quiz : [
    {
      id: `q-default-1`,
      question: `Which fundamental principle is most critical when writing production-level code in ${topic.title}?`,
      options: [
        'Ignoring time complexity in favor of quick prototyping',
        'Separation of concerns, clean interfaces, and proper error handling',
        'Writing all logic in a single monolithic function',
        'Avoiding version control systems',
      ],
      correctIndex: 1,
      explanation: 'Engineering best practices mandate modular decomposition, input validation, and predictable error handling to ensure scalability.',
    },
    {
      id: `q-default-2`,
      question: `What is the primary evaluation metric used in technical placement rounds for ${topic.title}?`,
      options: [
        'Number of code lines written',
        'Memory allocation efficiency, algorithmic correctness, and edge-case handling',
        'Using as many nested loops as possible',
        'Memorizing answers without understanding underlying invariants',
      ],
      correctIndex: 1,
      explanation: 'Interviewers look for sound reasoning around time/space complexity, edge cases (empty inputs, integer overflow), and clean idiomatic code.',
    },
  ];

  const defaultSnippet = topic.codeSnippet || {
    language: 'java',
    title: `${topic.title} Canonical Example`,
    code: `// ${topic.title} - Core Pattern Implementation
public class Solution {
    public static void solve() {
        // High-performance pattern demonstration
        System.out.println("Mastering ${topic.title} for B.Tech placements.");
    }
}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                {topic.category}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                Order #{topic.recommendedOrder}
              </span>
              <span className="text-slate-300">·</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  topic.level === 'Beginner'
                    ? 'bg-emerald-50 text-emerald-700'
                    : topic.level === 'Intermediate'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {topic.level}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {topic.title}
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

        {/* Tab switchers */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('syllabus')}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors ${
              activeTab === 'syllabus'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Syllabus & Invariants
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Interactive Self-Check ({quizQuestions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Pattern</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {activeTab === 'syllabus' && (
            <>
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Topic Description
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Interactive Progress Slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-800">
                    Topic Mastery Level
                  </span>
                  <span className="font-mono font-bold text-indigo-600 tabular-nums">
                    {currentProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentProgress}
                  onChange={handleSliderChange}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% Not Started</span>
                  <span>50% In Progress</span>
                  <span>100% Mastered</span>
                </div>
              </div>

              {/* Syllabus checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Structured Curriculum Syllabus
                </h4>
                <div className="space-y-1.5">
                  {topic.syllabus.map((syl) => {
                    const checked = completedList[syl] || isCompleted;
                    return (
                      <div
                        key={syl}
                        onClick={() => toggleSyllabusItem(syl)}
                        className="cursor-pointer p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs flex items-center justify-between transition-colors"
                      >
                        <span className={checked ? 'line-through text-slate-400' : 'text-slate-800'}>
                          {syl}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            checked
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Core Concepts */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Core Technical Invariants
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.coreConcepts.map((c) => (
                    <div
                      key={c}
                      className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium"
                    >
                      • {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview & Placement Tips */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Campus Interview & Placement Tip</span>
                </div>
                {topic.interviewTips}
              </div>

              {/* Recommended Practice Mini-Project */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span>Suggested Mini Practice Project</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {topic.recommendedProjectIdea}
                </p>
              </div>
            </>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Test your conceptual understanding with instant feedback and technical explanations.</span>
              </div>

              {quizQuestions.map((q, qIndex) => {
                const selected = selectedQuizAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="font-bold text-xs text-slate-900 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[11px] shrink-0">
                        {qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-1.5 pl-7">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selected === optIdx;
                        let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                          } else if (isThisSelected) {
                            optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`mt-2 p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'
                      }`}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {defaultSnippet.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(defaultSnippet.code)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{defaultSnippet.code}</pre>
              </div>

              <div className="text-[11px] text-slate-500">
                💡 Tip: Copy this template to test in your local IDE or online compiler.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isCompleted ? 'Marked Completed' : 'Mark Topic as Completed'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
          >
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
