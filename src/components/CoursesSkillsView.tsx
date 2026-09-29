import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Sparkles,
  Award,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';
import { CourseCategory, CourseTopic, SkillLevel } from '../types';

interface CoursesSkillsViewProps {
  topics: CourseTopic[];
  initialCategoryFilter?: CourseCategory | 'All';
  onUpdateTopicProgress: (topicId: string, progress: number, completed: boolean) => void;
  onOpenTopicModal: (topic: CourseTopic) => void;
}

export const CoursesSkillsView: React.FC<CoursesSkillsViewProps> = ({
  topics,
  initialCategoryFilter = 'All',
  onUpdateTopicProgress,
  onOpenTopicModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>(
    initialCategoryFilter
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'All'>('All');

  const categories: (CourseCategory | 'All')[] = [
    'All',
    'Programming',
    'Data Structures & Algorithms',
    'Core Computer Science',
    'Development',
    'Emerging Technologies',
  ];

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchCat =
        selectedCategory === 'All' || t.category === selectedCategory;
      const matchLevel =
        selectedLevel === 'All' || t.level === selectedLevel;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLevel && matchSearch;
    });
  }, [topics, selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
            Curated Academic Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Courses & Skills
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Structured B.Tech engineering curriculum organized into 5 foundational domains with prerequisites and milestone verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{filteredTopics.length}</span> of {topics.length} topics shown
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Level Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics by name, concept, or description (e.g. Arrays, SQL, React)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as SkillLevel | 'All')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">🟢 Beginner</option>
              <option value="Intermediate">🟡 Intermediate</option>
              <option value="Advanced">🔴 Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const isDone = topic.completed || topic.progress === 100;

          return (
            <div
              key={topic.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    Order #{topic.recommendedOrder}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      topic.level === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700'
                        : topic.level === 'Intermediate'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {topic.level === 'Beginner'
                      ? '🟢 Beginner'
                      : topic.level === 'Intermediate'
                      ? '🟡 Intermediate'
                      : '🔴 Advanced'}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-indigo-600 mb-1">
                  {topic.category}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {topic.description}
                </p>

                {/* Prerequisites */}
                <div className="text-[11px] text-slate-500 mb-4">
                  <span className="font-semibold text-slate-700">Prerequisites: </span>
                  <span>{topic.prerequisites.join(', ')}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-mono font-semibold text-slate-700 tabular-nums">
                      {topic.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDone ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateTopicProgress(
                      topic.id,
                      isDone ? 0 : 100,
                      !isDone
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTopicModal(topic)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
