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
} from './types';
import {
  ALL_COURSE_TOPICS,
  ALL_PROJECTS,
  BRANCH_DIRECTIONS,
  INITIAL_DETECTED_SKILLS,
  INITIAL_ROADMAP,
  INITIAL_SKILL_GAPS,
  INITIAL_STUDENT_PROFILE,
} from './data/learningData';
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
import { ToastMessage } from './types';

export default function App() {
  // Global States
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({ isOpen: false, mode: 'signup' });

  // Core Data States
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [detectedSkills, setDetectedSkills] = useState<DetectedSkill[]>(
    INITIAL_DETECTED_SKILLS
  );
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(INITIAL_SKILL_GAPS);
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>(INITIAL_ROADMAP);
  const [courseTopics, setCourseTopics] = useState<CourseTopic[]>(ALL_COURSE_TOPICS);
  const [projects, setProjects] = useState<ProjectItem[]>(ALL_PROJECTS);

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

  const handleSwitchPersona = (p: {
    name: string;
    email: string;
    branch: BTechBranch;
    year: BTechYear;
    goal: CareerGoal;
  }) => {
    setProfile({
      id: `student-${Date.now()}`,
      name: p.name,
      email: p.email,
      branch: p.branch,
      year: p.year,
      goal: p.goal,
      resumeUploaded: true,
      resumeFileName: `${p.name.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: '1.4 MB',
      resumeUploadDate: 'Sep 24, 2026',
      overallProgress: p.year === '1st Year' ? 22 : p.year === '2nd Year' ? 52 : p.year === '3rd Year' ? 68 : 84,
    });
    handleSelectGoal(p.goal);
    addToast('success', 'Student Switched', `Active profile changed to ${p.name} (${p.branch}, ${p.year}). Roadmap calibrated.`);
  };

  // Dynamic Overall Progress calculation
  useEffect(() => {
    const completedTopicCount = courseTopics.filter(
      (t) => t.completed || t.progress === 100
    ).length;
    const completedGapsCount = skillGaps.filter((g) => g.completed).length;
    const completedProjectsCount = projects.filter((p) => p.completed).length;

    // Weighting: topics 50%, gaps 30%, projects 20%
    const topicProg = (completedTopicCount / Math.max(courseTopics.length, 1)) * 50;
    const gapProg = (completedGapsCount / Math.max(skillGaps.length, 1)) * 30;
    const projProg = (completedProjectsCount / Math.max(projects.length, 1)) * 20;

    const computed = Math.min(
      95,
      Math.max(20, Math.round(topicProg + gapProg + projProg + 25))
    );
    setProfile((prev) => ({ ...prev, overallProgress: computed }));
  }, [courseTopics, skillGaps, projects]);

  // Recalibrate roadmap when goal changes
  const handleSelectGoal = (newGoal: CareerGoal) => {
    setProfile((prev) => ({ ...prev, goal: newGoal }));

    if (newGoal === 'AI / Machine Learning') {
      setRoadmap([
        {
          id: 'aiml-1',
          title: 'Python & Vectorization',
          subtitle: 'Syntax, NumPy arrays, vectorized operations',
          status: 'completed',
          order: 1,
          whyThisNext: 'Essential language for model research and computational linear algebra.',
          keyTopics: ['NumPy Arrays & Broadcasting', 'Vector Operations', 'Memory Layout', 'Functions & Lambdas'],
          recommendedProject: {
            title: 'Matrix Vector Computation Engine',
            difficulty: 'Beginner',
            skills: ['Python', 'NumPy', 'Math'],
            description: 'Implement matrix multiplications and convolution filters using pure NumPy vectorization.',
          },
          timeEstimate: '2 Weeks · Completed',
        },
        {
          id: 'aiml-2',
          title: 'Applied Linear Algebra & Statistics',
          subtitle: 'Eigenvalues, SVD, probability distributions, hypothesis testing',
          status: 'completed',
          order: 2,
          whyThisNext: 'Mathematical backbone for understanding gradient descent, PCA, and loss functions.',
          keyTopics: ['Eigenvectors & SVD', 'Multivariate Normal Distributions', 'Bayes Theorem', 'Hypothesis Testing'],
          recommendedProject: {
            title: 'Principal Component Analysis (PCA) from Scratch',
            difficulty: 'Intermediate',
            skills: ['NumPy', 'Linear Algebra', 'Math'],
            description: 'Dimensionality reduction implementation using eigenvalue decomposition.',
          },
          timeEstimate: '3 Weeks · Completed',
        },
        {
          id: 'aiml-3',
          title: 'Data Wrangling with Pandas & EDA',
          subtitle: 'DataFrames, missing values, feature pipelines, visualization',
          status: 'current',
          order: 3,
          whyThisNext: '80% of real ML engineering is robust data cleaning, feature extraction, and exploratory analysis.',
          keyTopics: ['Pandas Groupby & Aggregations', 'Missing Value Imputation', 'Outlier Detection (IQR / Z-score)', 'Seaborn Heatmaps'],
          recommendedProject: {
            title: 'Higher Education Engineering Salary EDA',
            difficulty: 'Intermediate',
            skills: ['Pandas', 'EDA', 'Matplotlib'],
            description: 'Comprehensive data analysis on 50,000 graduate salary records with statistical hypothesis testing.',
          },
          timeEstimate: '3 Weeks · Current Focus',
        },
        {
          id: 'aiml-4',
          title: 'Classical Machine Learning',
          subtitle: 'Regression, Classification, Ensembles, Hyperparameter tuning',
          status: 'up_next',
          order: 4,
          whyThisNext: 'Build strong intuition on baseline models (Random Forests, XGBoost) before diving into deep learning.',
          keyTopics: ['Linear & Logistic Regression', 'Decision Trees & Ensembles', 'Cross-Validation & Regularization', 'ROC-AUC & F1 Metrics'],
          recommendedProject: {
            title: 'Campus Placement Probability Classifier',
            difficulty: 'Intermediate',
            skills: ['Scikit-Learn', 'Random Forest', 'Python'],
            description: 'Ensemble model predicting placement offers with feature importance explanation.',
          },
          timeEstimate: '4 Weeks · Up Next',
        },
        {
          id: 'aiml-5',
          title: 'Deep Learning & Neural Networks',
          subtitle: 'Backpropagation, PyTorch, CNNs, Transformers basics',
          status: 'later',
          order: 5,
          whyThisNext: 'Enables high-capacity models for computer vision, NLP, and multimodal intelligence.',
          keyTopics: ['PyTorch Tensors & Autograd', 'Feedforward Networks', 'Convolutional Networks (CNN)', 'Attention Mechanisms'],
          recommendedProject: {
            title: 'Satellite Land Cover Classifier with PyTorch',
            difficulty: 'Advanced',
            skills: ['PyTorch', 'CNN', 'Computer Vision'],
            description: 'Train a convolutional neural network on satellite imagery with transfer learning.',
          },
          timeEstimate: '5 Weeks · Later',
        },
        {
          id: 'aiml-6',
          title: 'MLOps & Inference Serving',
          subtitle: 'FastAPI, Model serialization (ONNX), Docker, Monitoring',
          status: 'later',
          order: 6,
          whyThisNext: 'Prepares you for industry production where models must be hosted with latency SLAs.',
          keyTopics: ['FastAPI Inference API', 'Model Quantization', 'Docker Containerization', 'Data Drift Detection'],
          recommendedProject: {
            title: 'Real-Time Fraud Detection Inference Microservice',
            difficulty: 'Advanced',
            skills: ['FastAPI', 'Docker', 'MLOps', 'ONNX'],
            description: 'Sub-20ms inference API deployed with Docker container and Prometheus health checks.',
          },
          timeEstimate: '4 Weeks · Capstone',
        },
      ]);

      // Adjust skill gaps for AI/ML
      setSkillGaps([
        {
          id: 'aiml-gap-1',
          name: 'Applied Linear Algebra & Statistics',
          category: 'Core Math',
          currentStatus: 'needs_development',
          importance: 'Foundational',
          recommendedStage: 'Current Stage — Immediate Focus',
          completed: false,
          whyNeeded: 'Understanding gradient descent, matrix multiplication, and loss optimization.',
          actionItem: 'Review matrix operations, eigenvalues, and multivariate normal distributions.',
        },
        {
          id: 'aiml-gap-2',
          name: 'Pandas & Feature Engineering',
          category: 'Data Science',
          currentStatus: 'needs_development',
          importance: 'High',
          recommendedStage: 'Current Stage — Concurrent',
          completed: false,
          whyNeeded: 'Preparing raw engineering datasets for machine learning model ingestion.',
          actionItem: 'Implement data preprocessing pipelines handling missing values and one-hot encoding.',
        },
        {
          id: 'aiml-gap-3',
          name: 'Scikit-Learn Modeling & Validation',
          category: 'Emerging Technologies',
          currentStatus: 'not_started',
          importance: 'High',
          recommendedStage: 'Stage 2 — Up Next',
          completed: false,
          whyNeeded: 'Standard library for supervised, unsupervised, and ensemble models.',
          actionItem: 'Train Random Forest and Gradient Boosting models with 5-fold cross-validation.',
        },
        {
          id: 'aiml-gap-4',
          name: 'PyTorch Deep Learning',
          category: 'Emerging Technologies',
          currentStatus: 'not_started',
          importance: 'High',
          recommendedStage: 'Stage 3 — Later',
          completed: false,
          whyNeeded: 'State-of-the-art framework for neural networks and transformer architectures.',
          actionItem: 'Implement a multi-layer perceptron with custom loss and optimizer in PyTorch.',
        },
        {
          id: 'aiml-gap-5',
          name: 'MLOps & Containerized Serving',
          category: 'Development',
          currentStatus: 'not_started',
          importance: 'High',
          recommendedStage: 'Stage 4 — Capstone',
          completed: false,
          whyNeeded: 'Serving model predictions reliably via REST APIs inside Docker containers.',
          actionItem: 'Build a FastAPI service serving model predictions with response caching.',
        },
      ]);
    } else if (newGoal === 'Cybersecurity') {
      setRoadmap([
        {
          id: 'cyber-1',
          title: 'Linux & Networking Fundamentals',
          subtitle: 'TCP/IP stack, Bash scripting, socket analysis, iptables',
          status: 'completed',
          order: 1,
          whyThisNext: 'Operating systems and network traffic fundamentals are prerequisites for defensive security.',
          keyTopics: ['OSI 7 Layers vs TCP/IP', 'Wireshark Packet Analysis', 'Linux CLI & Permissions', 'Firewall Configurations'],
          recommendedProject: {
            title: 'Network Packet Sniffer & Flow Analyzer',
            difficulty: 'Beginner',
            skills: ['Python', 'Sockets', 'Linux'],
            description: 'Inspect raw network headers and count DNS queries in real time.',
          },
          timeEstimate: '3 Weeks · Completed',
        },
        {
          id: 'cyber-2',
          title: 'Python Scripting for Security',
          subtitle: 'Automation, Port scanners, Regex, Subnet calculators',
          status: 'current',
          order: 2,
          whyThisNext: 'Allows rapid automation of audits, log parsing, and system vulnerability verification.',
          keyTopics: ['Scapy Network Library', 'Regex Pattern Matching', 'Socket Programming', 'Automated Subnet Pingers'],
          recommendedProject: {
            title: 'Multi-Threaded TCP Port Scanner',
            difficulty: 'Intermediate',
            skills: ['Python', 'Sockets', 'Concurrency'],
            description: 'Scan 1,000 ports on authorized test hosts in under 3 seconds.',
          },
          timeEstimate: '3 Weeks · Current Focus',
        },
        {
          id: 'cyber-3',
          title: 'Applied Cryptography & PKI',
          subtitle: 'AES, RSA, Public Key Infrastructure, TLS Handshake',
          status: 'up_next',
          order: 3,
          whyThisNext: 'Protects data in transit and at rest; explains certificate verification chains.',
          keyTopics: ['Symmetric vs Asymmetric Ciphers', 'HMAC & Digital Signatures', 'TLS 1.3 Key Exchange', 'Certificate Authorities (CA)'],
          recommendedProject: {
            title: 'End-to-End Encrypted File Vault',
            difficulty: 'Intermediate',
            skills: ['Python / Cryptography', 'AES-256', 'RSA'],
            description: 'Zero-knowledge local encrypted file store with salted PBKDF2 key derivation.',
          },
          timeEstimate: '3 Weeks · Up Next',
        },
        {
          id: 'cyber-4',
          title: 'OWASP Top 10 Web Security',
          subtitle: 'SQLi, XSS, CSRF, SSRF, Broken Access Control mitigation',
          status: 'later',
          order: 4,
          whyThisNext: 'Most security breaches exploit application-layer web vulnerabilities.',
          keyTopics: ['SQL Injection Remediation', 'Cross-Site Scripting (XSS) CSP Headers', 'CSRF Tokens & SameSite', 'Broken Object Level Auth (BOLA)'],
          recommendedProject: {
            title: 'Vulnerability Audit Lab & Mitigation Suite',
            difficulty: 'Advanced',
            skills: ['Cybersecurity', 'Python', 'OWASP', 'Burp Suite'],
            description: 'Demonstrate detection and patched code fixes for 5 high-severity web flaws.',
          },
          timeEstimate: '4 Weeks · Later',
        },
        {
          id: 'cyber-5',
          title: 'Security Operations & Incident Response',
          subtitle: 'SIEM (Splunk/ELK), Log analysis, Threat hunting, SOC playbooks',
          status: 'later',
          order: 5,
          whyThisNext: 'Aligns directly with entry-level Security Analyst and SOC roles.',
          keyTopics: ['Log Ingestion & Parsing', 'Correlation Rules', 'Incident Response Playbooks', 'MITRE ATT&CK Framework'],
          recommendedProject: {
            title: 'Simulated SOC SIEM Incident Dashboard',
            difficulty: 'Advanced',
            skills: ['SIEM', 'Log Analysis', 'Linux'],
            description: 'Ingest Apache/Nginx authentication logs and generate alerts on brute-force attempts.',
          },
          timeEstimate: '4 Weeks · Capstone',
        },
      ]);
    } else {
      // Default to Software Development
      setRoadmap(INITIAL_ROADMAP);
      setSkillGaps(INITIAL_SKILL_GAPS);
    }
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

  const handleResetData = () => {
    setProfile(INITIAL_STUDENT_PROFILE);
    setDetectedSkills(INITIAL_DETECTED_SKILLS);
    setSkillGaps(INITIAL_SKILL_GAPS);
    setRoadmap(INITIAL_ROADMAP);
    setCourseTopics(ALL_COURSE_TOPICS);
    setProjects(ALL_PROJECTS);
    addToast('info', 'Demo State Reset', 'Restored pristine Aarav Sharma demo profile.');
  };

  const handleOpenTopicBySkillName = (skillName: string) => {
    const matched =
      courseTopics.find((t) =>
        t.title.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(t.title.toLowerCase())
      ) || courseTopics[0];
    setActiveTopicModal(matched);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Universal Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isLoggedIn={isLoggedIn}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onLogout={() => {
          setIsLoggedIn(false);
          setActiveTab('landing');
          addToast('info', 'Logged Out', 'You have returned to the overview landing page.');
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSwitchPersona={handleSwitchPersona}
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
            onLogout={() => {
              setIsLoggedIn(false);
              setActiveTab('landing');
            }}
          />
        )}

        {/* Content Container */}
        <main
          className={`flex-1 min-w-0 transition-all duration-200 ${
            isLoggedIn && activeTab !== 'landing' ? 'lg:pl-64' : ''
          }`}
        >
          {/* Landing Page */}
          {(!isLoggedIn || activeTab === 'landing') && (
            <LandingPage
              onGetStarted={() => {
                setIsLoggedIn(true);
                setActiveTab('dashboard');
              }}
              onLogin={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
              onSelectBranchDemo={(b, g) => {
                setProfile((prev) => ({
                  ...prev,
                  branch: b,
                  goal: g,
                }));
                handleSelectGoal(g);
                setIsLoggedIn(true);
                setActiveTab('dashboard');
              }}
            />
          )}

          {/* Student Dashboard */}
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
                if (updated.goal) {
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
        onAuthenticate={(authProfile) => {
          setProfile(authProfile);
          setIsLoggedIn(true);
          setActiveTab('dashboard');
        }}
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
    </div>
  );
}
