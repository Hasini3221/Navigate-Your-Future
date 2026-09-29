export type BTechBranch =
  | 'Computer Science & Engineering'
  | 'Artificial Intelligence & Machine Learning'
  | 'Data Science'
  | 'Cyber Security'
  | 'Electronics & Communication Engineering'
  | 'Electrical & Electronics Engineering'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Information Technology'
  | 'Other';

export type BTechYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type CareerGoal =
  | 'Software Development'
  | 'Full-Stack Development'
  | 'AI / Machine Learning'
  | 'Data Science'
  | 'Data Analytics'
  | 'Cybersecurity'
  | 'Cloud / DevOps'
  | 'Mobile Development'
  | 'Core Engineering'
  | "I'm not sure yet";

export type SkillStatus = 'demonstrated' | 'mentioned' | 'not_detected';

export interface DetectedSkill {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  evidence: string;
  proficiencyScore: number; // 0 - 100
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  currentStatus: 'demonstrated' | 'needs_development' | 'not_started';
  importance: 'Foundational' | 'High' | 'Complementary';
  recommendedStage: string;
  completed: boolean;
  whyNeeded: string;
  actionItem: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'up_next' | 'later';
  order: number;
  whyThisNext: string;
  keyTopics: string[];
  recommendedProject: {
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    skills: string[];
    description: string;
  };
  timeEstimate: string;
}

export type CourseCategory =
  | 'Programming'
  | 'Data Structures & Algorithms'
  | 'Core Computer Science'
  | 'Development'
  | 'Emerging Technologies';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface CourseTopic {
  id: string;
  title: string;
  category: CourseCategory;
  level: SkillLevel;
  description: string;
  prerequisites: string[];
  recommendedOrder: number;
  progress: number; // 0 - 100
  completed: boolean;
  estimatedHours: number;
  syllabus: string[];
  coreConcepts: string[];
  interviewTips: string;
  recommendedProjectIdea: string;
  quiz?: QuizQuestion[];
  codeSnippet?: CodeSnippet;
}

export interface ProjectItem {
  id: string;
  title: string;
  branch: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  summary: string;
  fullDescription: string;
  deliverables: string[];
  resumeBulletExample: string;
  tags: string[];
  completed: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  branch: BTechBranch;
  year: BTechYear;
  goal: CareerGoal;
  resumeUploaded: boolean;
  resumeFileName?: string;
  resumeFileSize?: string;
  resumeUploadDate?: string;
  overallProgress: number; // 0 - 100
}

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'resume'
  | 'direction'
  | 'skill-gap'
  | 'goal-selection'
  | 'courses-skills'
  | 'programming'
  | 'core-subjects'
  | 'projects'
  | 'progress'
  | 'settings';
