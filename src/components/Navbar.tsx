import React, { useState } from 'react';
import {
  Compass,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark & Mobile Hamburger */}
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
                <span className="text-[10px] text-slate-500 hidden sm:block">
                  Personalized B.Tech Career Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'dashboard'
                      ? 'text-indigo-600 font-semibold'
                      : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('direction')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'direction'
                      ? 'text-indigo-600 font-semibold'
                      : ''
                  }`}
                >
                  My Direction
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'resume' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('skill-gap')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'skill-gap'
                      ? 'text-indigo-600 font-semibold'
                      : ''
                  }`}
                >
                  Skill Gaps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('courses-skills')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'courses-skills'
                      ? 'text-indigo-600 font-semibold'
                      : ''
                  }`}
                >
                  Curriculum
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className={`hover:text-slate-900 transition-colors ${
                    activeTab === 'projects'
                      ? 'text-indigo-600 font-semibold'
                      : ''
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
                  Philosophy
                </a>
                <a
                  href="#branches"
                  className="hover:text-slate-900 transition-colors"
                >
                  Supported Branches
                </a>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Roadmaps
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Dynamic User Identity & Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Academic Notifications Bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                    title="Notifications"
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
                        <span className="font-semibold block">{profile.goal} Track</span>
                        <span className="text-[11px] text-indigo-800/80">
                          {profile.overallProgress === 0
                            ? 'Complete your profile & upload resume to begin personalized recommendations.'
                            : 'Personalized roadmap active. Next milestones ready for review.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Authenticated User Profile Pill */}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Open Account Settings"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden sm:block">
                    <span className="font-semibold block truncate max-w-[130px] text-slate-900">
                      {profile.name || 'Student User'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {profile.year} · {profile.branch.split(' ')[0]}
                    </span>
                  </div>
                </button>

                {/* Secure Log Out Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline text-xs font-medium">Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
