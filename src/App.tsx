/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  BTechBranch,
  BTechYear,
  CareerGoal,
  CourseCategory,
  CourseTopic,
  DetectedSkill,
  ProjectItem,
  RoadmapNode,
  SkillGapItem,
  StudentProfile,
  ToastMessage,
} from './types';
import {
  ALL_COURSE_TOPICS,
  ALL_PROJECTS,
  BRANCH_DIRECTIONS,
} from './data/learningData';
import {
  getCurrentUserRecord,
  saveUserRecord,
  logoutUser,
  generateGoalRoadmap,
  generateGoalSkillGaps,
  UserRecord,
} from './data/userStorage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { ResumeView } from './components/ResumeView';
import { SkillGapView } from './components/SkillGapView';
import { DirectionRoadmapView } from './components/DirectionRoadmapView';
import { CareerGoalView } from './components/CareerGoalView';
import { CoursesSkillsView } from './components/CoursesSkillsView';
import { ProjectsView } from './components/ProjectsView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { TopicDetailModal } from './components/TopicDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { ChatbotWidget } from './components/ChatbotWidget';

const EMPTY_PROFILE: StudentProfile = {
  id: '',
  name: '',
  email: '',
  branch: 'Computer Science & Engineering',
  year: '1st Year',
  goal: "I'm not sure yet",
  resumeUploaded: false,
  overallProgress: 0,
};

export default function App() {
  // Load initial authenticated user from persistent storage
  const [currentUserRecord, setCurrentUserRecord] = useState<UserRecord | null>(() => {
    return getCurrentUserRecord();
  });

  const isLoggedIn = currentUserRecord !== null;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return currentUserRecord ? 'dashboard' : 'landing';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({ isOpen: false, mode: 'signup' });

  // Core Data States - initialized strictly from authenticated user record
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return currentUserRecord ? currentUserRecord.profile : EMPTY_PROFILE;
  });

  const [detectedSkills, setDetectedSkills] = useState<DetectedSkill[]>(() => {
    return currentUserRecord ? currentUserRecord.detectedSkills : [];
  });

  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(() => {
    return currentUserRecord ? currentUserRecord.skillGaps : [];
  });

  const [roadmap, setRoadmap] = useState<RoadmapNode[]>(() => {
    return currentUserRecord ? currentUserRecord.roadmap : [];
  });

  const [courseTopics, setCourseTopics] = useState<CourseTopic[]>(() => {
    return currentUserRecord ? currentUserRecord.courseTopics : [];
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    return currentUserRecord ? currentUserRecord.projects : [];
  });

  // Active Modals
  const [activeTopicModal, setActiveTopicModal] = useState<CourseTopic | null>(null);
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Enforce authentication boundary: unauthenticated users cannot access dashboard or internal tabs
  useEffect(() => {
    if (!isLoggedIn && activeTab !== 'landing') {
      setActiveTab('landing');
      setAuthModalConfig({ isOpen: true, mode: 'login' });
    }
  }, [isLoggedIn, activeTab]);

  // Compute Overall Progress authentically for the logged-in user
  useEffect(() => {
    if (!isLoggedIn || !currentUserRecord) return;

    const completedTopicCount = courseTopics.filter(
      (t) => t.completed || t.progress === 100
    ).length;
    const completedGapsCount = skillGaps.filter((g) => g.completed).length;
    const completedProjectsCount = projects.filter((p) => p.completed).length;

    // A brand new user with 0 completed topics, 0 gaps, 0 projects, and no resume has strictly 0%
    if (
      completedTopicCount === 0 &&
      completedGapsCount === 0 &&
      completedProjectsCount === 0 &&
      !profile.resumeUploaded
    ) {
      if (profile.overallProgress !== 0) {
        setProfile((prev) => ({ ...prev, overallProgress: 0 }));
      }
      return;
    }

    const topicProg = (completedTopicCount / Math.max(courseTopics.length, 1)) * 40;
    const gapProg = (completedGapsCount / Math.max(skillGaps.length, 1)) * 30;
    const projProg = (completedProjectsCount / Math.max(projects.length, 1)) * 20;
    const resumeProg = profile.resumeUploaded ? 10 : 0;

    const computed = Math.min(100, Math.round(topicProg + gapProg + projProg + resumeProg));
    if (profile.overallProgress !== computed) {
      setProfile((prev) => ({ ...prev, overallProgress: computed }));
    }
  }, [courseTopics, skillGaps, projects, profile.resumeUploaded, isLoggedIn]);

  // Save changes automatically and isolated to this user's persistent record
  useEffect(() => {
    if (isLoggedIn && currentUserRecord && profile.id) {
      const updatedRecord: UserRecord = {
        account: currentUserRecord.account,
        profile,
        detectedSkills,
        skillGaps,
        roadmap,
        courseTopics,
        projects,
      };
      saveUserRecord(updatedRecord);
    }
  }, [profile, detectedSkills, skillGaps, roadmap, courseTopics, projects, isLoggedIn]);

  // Handle Authentication (Login / Signup)
  const handleAuthenticate = (record: UserRecord) => {
    setCurrentUserRecord(record);
    setProfile(record.profile);
    setDetectedSkills(record.detectedSkills);
    setSkillGaps(record.skillGaps);
    setRoadmap(record.roadmap);
    setCourseTopics(record.courseTopics);
    setProjects(record.projects);
    setActiveTab('dashboard');
    addToast(
      'success',
      `Welcome, ${record.profile.name}!`,
      'Your personalized dashboard and learning milestones are ready.'
    );
  };

  // Handle Logout (Complete Session Teardown)
  const handleLogout = () => {
    logoutUser();
    setCurrentUserRecord(null);
    setProfile(EMPTY_PROFILE);
    setDetectedSkills([]);
    setSkillGaps([]);
    setRoadmap([]);
    setCourseTopics([]);
    setProjects([]);
    setActiveTab('landing');
    setIsSidebarOpen(false);
    addToast('info', 'Logged Out', 'You have been safely signed out. Your progress is saved.');
  };

  // Recalibrate roadmap when goal changes
  const handleSelectGoal = (newGoal: CareerGoal) => {
    const updatedRoadmap = generateGoalRoadmap(newGoal);
    const updatedGaps = generateGoalSkillGaps(newGoal);

    setProfile((prev) => ({ ...prev, goal: newGoal }));
    setRoadmap(updatedRoadmap);
    setSkillGaps(updatedGaps);
    addToast('info', 'Goal Updated', `Your trajectory has been calibrated for ${newGoal}.`);
  };

  const handleToggleGapCompletion = (gapId: string) => {
    setSkillGaps((prev) =>
      prev.map((g) => {
        if (g.id === gapId) {
          const nextState = !g.completed;
          addToast(
            nextState ? 'success' : 'info',
            nextState ? 'Skill Gap Completed' : 'Skill Gap Reopened',
            `"${g.name}" marked as ${nextState ? 'completed' : 'in progress'}.`
          );
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  const handleUpdateTopicProgress = (
    topicId: string,
    progress: number,
    completed: boolean
  ) => {
    setCourseTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          if (completed && !t.completed) {
            addToast('success', 'Topic Mastered! 🎉', `Completed ${t.title}. Progress updated.`);
          }
          return { ...t, progress, completed };
        }
        return t;
      })
    );
  };

  const handleSetRoadmapNodeStatus = (
    nodeId: string,
    status: 'completed' | 'current' | 'up_next' | 'later'
  ) => {
    setRoadmap((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          addToast(
            'success',
            'Roadmap Stage Updated',
            `Stage "${n.title}" status changed to ${status}.`
          );
          return { ...n, status };
        }
        if (status === 'current' && n.status === 'current') {
          return { ...n, status: 'completed' };
        }
        return n;
      })
    );
  };

  const handleToggleProjectCompleted = (projId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projId) {
          const next = !p.completed;
          addToast(
            next ? 'success' : 'info',
            next ? 'Project Finished! 🚀' : 'Project Reopened',
            `"${p.title}" ${next ? 'is now portfolio ready' : 'moved back to active projects'}.`
          );
          return { ...p, completed: next };
        }
        return p;
      })
    );
  };

  // Reset current logged in user's data back to initial 0% state
  const handleResetData = () => {
    if (!currentUserRecord) return;

    const freshRoadmap = generateGoalRoadmap(profile.goal);
    const freshGaps = generateGoalSkillGaps(profile.goal);
    const freshTopics = ALL_COURSE_TOPICS.map((t) => ({ ...t, progress: 0, completed: false }));
    const freshProjects = ALL_PROJECTS.map((p) => ({ ...p, completed: false }));

    setProfile((prev) => ({
      ...prev,
      resumeUploaded: false,
      resumeFileName: undefined,
      resumeFileSize: undefined,
      resumeUploadDate: undefined,
      overallProgress: 0,
    }));
    setDetectedSkills([]);
    setSkillGaps(freshGaps);
    setRoadmap(freshRoadmap);
    setCourseTopics(freshTopics);
    setProjects(freshProjects);
    addToast('info', 'Learning Data Reset', 'Your account learning progress has been reset.');
  };

  const handleOpenTopicBySkillName = (skillName: string) => {
    const matched =
      courseTopics.find((t) =>
        t.title.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(t.title.toLowerCase())
      ) || courseTopics[0];
    if (matched) {
      setActiveTopicModal(matched);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Universal Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isLoggedIn={isLoggedIn}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* 2. Main Viewport & Collapsible Navigation Shell */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation (When logged in) */}
        {isLoggedIn && activeTab !== 'landing' && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profile={profile}
            onLogout={handleLogout}
          />
        )}

        {/* Content Container */}
        <main
          className={`flex-1 min-w-0 transition-all duration-200 ${
            isLoggedIn && activeTab !== 'landing' ? 'lg:pl-64' : ''
          }`}
        >
          {/* Landing Page (Shown when logged out, or if visitor navigates to overview) */}
          {(!isLoggedIn || activeTab === 'landing') && (
            <LandingPage
              onGetStarted={() => {
                if (isLoggedIn) {
                  setActiveTab('dashboard');
                } else {
                  setAuthModalConfig({ isOpen: true, mode: 'signup' });
                }
              }}
              onLogin={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
              onSelectBranchDemo={(branch, goal) => {
                if (isLoggedIn) {
                  setProfile((prev) => ({ ...prev, branch, goal }));
                  handleSelectGoal(goal);
                  setActiveTab('dashboard');
                } else {
                  setAuthModalConfig({ isOpen: true, mode: 'signup' });
                }
              }}
            />
          )}

          {/* Student Dashboard (Dynamic for authenticated user) */}
          {isLoggedIn && activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              roadmap={roadmap}
              continueTopics={courseTopics.filter((t) => !t.completed)}
              skills={detectedSkills}
              recommendedProject={projects[0]}
              setActiveTab={setActiveTab}
              onOpenTopic={(topic) => setActiveTopicModal(topic)}
              onOpenProject={(proj) => setActiveProjectModal(proj)}
            />
          )}

          {/* Resume Management & Analysis */}
          {isLoggedIn && activeTab === 'resume' && (
            <ResumeView
              profile={profile}
              skills={detectedSkills}
              onUpdateSkills={setDetectedSkills}
              onUpdateProfile={(updated) =>
                setProfile((prev) => ({ ...prev, ...updated }))
              }
              onNavigateToGaps={() => setActiveTab('skill-gap')}
              onUpdateSkillGaps={setSkillGaps}
            />
          )}

          {/* Skill Gap Analysis */}
          {isLoggedIn && activeTab === 'skill-gap' && (
            <SkillGapView
              profile={profile}
              skills={detectedSkills}
              skillGaps={skillGaps}
              onToggleGapCompletion={handleToggleGapCompletion}
              onOpenTopicBySkillName={handleOpenTopicBySkillName}
              onNavigateToRoadmap={() => setActiveTab('direction')}
            />
          )}

          {/* Signature Feature: My Direction Roadmap */}
          {isLoggedIn && activeTab === 'direction' && (
            <DirectionRoadmapView
              profile={profile}
              roadmap={roadmap}
              onSetRoadmapNodeStatus={handleSetRoadmapNodeStatus}
              onOpenProject={(proj) => setActiveProjectModal(proj)}
            />
          )}

          {/* Career Goal Selection */}
          {isLoggedIn && activeTab === 'goal-selection' && (
            <CareerGoalView
              profile={profile}
              onSelectGoal={handleSelectGoal}
              onNavigateToRoadmap={() => setActiveTab('direction')}
            />
          )}

          {/* Courses & Skills Library (All Categories) */}
          {isLoggedIn && activeTab === 'courses-skills' && (
            <CoursesSkillsView
              topics={courseTopics}
              initialCategoryFilter="All"
              onUpdateTopicProgress={handleUpdateTopicProgress}
              onOpenTopicModal={(t) => setActiveTopicModal(t)}
            />
          )}

          {/* Sub-view: Programming Only */}
          {isLoggedIn && activeTab === 'programming' && (
            <CoursesSkillsView
              topics={courseTopics}
              initialCategoryFilter="Programming"
              onUpdateTopicProgress={handleUpdateTopicProgress}
              onOpenTopicModal={(t) => setActiveTopicModal(t)}
            />
          )}

          {/* Sub-view: Core Subjects Only */}
          {isLoggedIn && activeTab === 'core-subjects' && (
            <CoursesSkillsView
              topics={courseTopics}
              initialCategoryFilter="Core Computer Science"
              onUpdateTopicProgress={handleUpdateTopicProgress}
              onOpenTopicModal={(t) => setActiveTopicModal(t)}
            />
          )}

          {/* Recommended Projects View */}
          {isLoggedIn && activeTab === 'projects' && (
            <ProjectsView
              profile={profile}
              projects={projects}
              onToggleProjectCompleted={handleToggleProjectCompleted}
              onOpenProjectDetail={(proj) => setActiveProjectModal(proj)}
            />
          )}

          {/* Progress Tracker View */}
          {isLoggedIn && activeTab === 'progress' && (
            <ProgressView
              profile={profile}
              topics={courseTopics}
              skills={detectedSkills}
              projects={projects}
            />
          )}

          {/* Settings View */}
          {isLoggedIn && activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile((prev) => ({ ...prev, ...updated }));
                if (updated.goal && updated.goal !== profile.goal) {
                  handleSelectGoal(updated.goal);
                }
              }}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* 3. Global Interactive Modals */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ isOpen: false, mode: 'signup' })}
        onAuthenticate={handleAuthenticate}
      />

      <TopicDetailModal
        topic={activeTopicModal}
        onClose={() => setActiveTopicModal(null)}
        onUpdateProgress={handleUpdateTopicProgress}
      />

      <ProjectDetailModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        onToggleCompleted={handleToggleProjectCompleted}
      />

      {/* 4. Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 5. Live AI Career Chatbot Agent (Isolated to active student profile) */}
      <ChatbotWidget profile={profile} />
    </div>
  );
}
