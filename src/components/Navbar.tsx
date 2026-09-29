import React, { useState } from 'react';
import {
  Compass,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Users,
} from 'lucide-react';
import { ActiveTab, BTechBranch, BTechYear, CareerGoal, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSwitchPersona?: (persona: {
    name: string;
    email: string;
    branch: BTechBranch;
    year: BTechYear;
    goal: CareerGoal;
  }) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isLoggedIn,
  onOpenAuth,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  onSwitchPersona,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const personas: {
    name: string;
    email: string;
    branch: BTechBranch;
    year: BTechYear;
    goal: CareerGoal;
    badge: string;
  }[] = [
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@btech.edu',
      branch: 'Computer Science & Engineering',
      year: '2nd Year',
      goal: 'Software Development',
      badge: 'CSE · SDE',
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@btech.edu',
      branch: 'Artificial Intelligence & Machine Learning',
      year: '3rd Year',
      goal: 'AI / Machine Learning',
      badge: 'AI/ML Track',
    },
    {
      name: 'Karan Nair',
      email: 'karan.nair@btech.edu',
      branch: 'Cyber Security',
      year: '4th Year',
      goal: 'Cybersecurity',
      badge: 'Cybersecurity',
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@btech.edu',
      branch: 'Electronics & Communication Engineering',
      year: '2nd Year',
      goal: 'Core Engineering',
      badge: 'ECE · Embedded',
    },
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@btech.edu',
      branch: 'Information Technology',
      year: '1st Year',
      goal: "I'm not sure yet",
      badge: '1st Yr Explorer',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-slate-900 tracking-tight block">
                  Navigate Your Future
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'dashboard' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('direction')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'direction' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  My Direction
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('skill-gap')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'skill-gap' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Skill Gaps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('courses-skills')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'courses-skills' ||
                    activeTab === 'programming' ||
                    activeTab === 'core-subjects'
                      ? 'text-indigo-600 font-semibold'
                      : ''
                  }`}
                >
                  Courses & Skills
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'projects' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Projects
                </button>
              </>
            ) : (
              <>
                <a
                  href="#how-it-works"
                  className="hover:text-slate-900 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#why-us"
                  className="hover:text-slate-900 transition-colors"
                >
                  Why Us
                </a>
                <a
                  href="#branches"
                  className="hover:text-slate-900 transition-colors"
                >
                  Supported Branches
                </a>
                <button
                  type="button"
                  onClick={() => setActiveTab('goal-selection')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Explore Goals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('courses-skills')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Curriculum
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Persona quick-switch button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPersonaMenu((prev) => !prev)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    title="Switch student profile demonstration"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Switch Student</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showPersonaMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Student Profile
                      </div>
                      {personas.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            if (onSwitchPersona) {
                              onSwitchPersona(p);
                            }
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            profile.name === p.name
                              ? 'bg-indigo-50/70 text-indigo-900 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {p.year} · {p.branch.split(' ')[0]}
                            </div>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                            {p.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                    title="Academic reminders"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 pb-1 border-b border-slate-100">
                        Academic Notifications
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-50/70 text-indigo-950">
                        <span className="font-semibold block">DSA Arrays Quiz</span>
                        <span className="text-[11px] text-indigo-800/80">
                          Recommended self-check available for Arrays & Two Pointers.
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-800">
                        <span className="font-semibold block">Resume Evidence</span>
                        <span className="text-[11px] text-slate-500">
                          Add SQL project deliverables to elevate status to Demonstrated.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* User chip */}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-[10px]">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="font-semibold block truncate max-w-[120px]">
                      {profile.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {profile.year} · {profile.branch.split(' ')[0]}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
