import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Compass,
  BookOpen,
  Code2,
  Brain,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Target,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  profile,
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Home',
    },
    {
      id: 'resume' as ActiveTab,
      label: 'Resume',
      icon: FileText,
      badge: profile.resumeUploaded ? 'Uploaded' : 'Action Req',
    },
    {
      id: 'direction' as ActiveTab,
      label: 'My Direction',
      icon: Compass,
      badge: 'Roadmap',
    },
    {
      id: 'courses-skills' as ActiveTab,
      label: 'Courses & Skills',
      icon: BookOpen,
    },
    {
      id: 'programming' as ActiveTab,
      label: 'Programming',
      icon: Code2,
    },
    {
      id: 'core-subjects' as ActiveTab,
      label: 'Core Subjects',
      icon: Brain,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projects',
      icon: Wrench,
    },
    {
      id: 'progress' as ActiveTab,
      label: 'My Progress',
      icon: BarChart3,
      badge: `${profile.overallProgress}%`,
    },
    {
      id: 'goal-selection' as ActiveTab,
      label: 'Career Goal',
      icon: Target,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'
        }`}
      >
        {/* Profile Card Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-xs text-sm">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {profile.name || 'Student User'}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {profile.branch}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-600">
                <span>{profile.year}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-indigo-700 truncate">
                  {profile.goal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Platform Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-mono tabular-nums ${
                      isActive
                        ? 'bg-indigo-100/80 text-indigo-800 font-medium'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer logout button */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
