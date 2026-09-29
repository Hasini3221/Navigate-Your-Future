import {
  BTechBranch,
  BTechYear,
  CareerGoal,
  CourseTopic,
  DetectedSkill,
  ProjectItem,
  RoadmapNode,
  SkillGapItem,
  StudentProfile,
} from '../types';
import {
  ALL_COURSE_TOPICS,
  ALL_PROJECTS,
  INITIAL_ROADMAP,
  INITIAL_SKILL_GAPS,
} from './learningData';

export interface UserAccount {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserRecord {
  account: UserAccount;
  profile: StudentProfile;
  detectedSkills: DetectedSkill[];
  skillGaps: SkillGapItem[];
  roadmap: RoadmapNode[];
  courseTopics: CourseTopic[];
  projects: ProjectItem[];
}

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'nyf_current_user_id',
  USERS_INDEX: 'nyf_users_index',
  USER_DATA_PREFIX: 'nyf_user_data_',
};

/**
 * Generate a dynamic roadmap tailored to a career goal.
 * For new users, status begins at 'current' for stage 1 and 'up_next' / 'later' for subsequent stages.
 */
export function generateGoalRoadmap(goal: CareerGoal): RoadmapNode[] {
  if (goal === 'AI / Machine Learning' || goal === 'Data Science') {
    return [
      {
        id: 'aiml-1',
        title: 'Python & Vectorization',
        subtitle: 'Syntax, NumPy arrays, vectorized operations',
        status: 'current',
        order: 1,
        whyThisNext: 'Essential language for model research and computational linear algebra.',
        keyTopics: ['NumPy Arrays & Broadcasting', 'Vector Operations', 'Memory Layout', 'Functions & Lambdas'],
        recommendedProject: {
          title: 'Matrix Vector Computation Engine',
          difficulty: 'Beginner',
          skills: ['Python', 'NumPy', 'Math'],
          description: 'Implement matrix multiplications and convolution filters using pure NumPy vectorization.',
        },
        timeEstimate: '2 Weeks · Current Focus',
      },
      {
        id: 'aiml-2',
        title: 'Applied Linear Algebra & Statistics',
        subtitle: 'Eigenvalues, SVD, probability distributions, hypothesis testing',
        status: 'up_next',
        order: 2,
        whyThisNext: 'Mathematical backbone for understanding gradient descent, PCA, and loss functions.',
        keyTopics: ['Eigenvectors & SVD', 'Multivariate Normal Distributions', 'Bayes Theorem', 'Hypothesis Testing'],
        recommendedProject: {
          title: 'Principal Component Analysis (PCA) from Scratch',
          difficulty: 'Intermediate',
          skills: ['NumPy', 'Linear Algebra', 'Math'],
          description: 'Dimensionality reduction implementation using eigenvalue decomposition.',
        },
        timeEstimate: '3 Weeks · Up Next',
      },
      {
        id: 'aiml-3',
        title: 'Data Wrangling with Pandas & EDA',
        subtitle: 'DataFrames, missing values, feature pipelines, visualization',
        status: 'later',
        order: 3,
        whyThisNext: '80% of real ML engineering is robust data cleaning, feature extraction, and exploratory analysis.',
        keyTopics: ['Pandas Groupby & Aggregations', 'Missing Value Imputation', 'Outlier Detection', 'Seaborn Heatmaps'],
        recommendedProject: {
          title: 'Engineering Placement Dataset Analysis',
          difficulty: 'Intermediate',
          skills: ['Pandas', 'EDA', 'Matplotlib'],
          description: 'Comprehensive exploratory data analysis with statistical hypothesis tests.',
        },
        timeEstimate: '3 Weeks · Later',
      },
      {
        id: 'aiml-4',
        title: 'Classical Machine Learning',
        subtitle: 'Regression, Classification, Ensembles, Hyperparameter tuning',
        status: 'later',
        order: 4,
        whyThisNext: 'Build strong intuition on baseline models (Random Forests, XGBoost) before diving into deep learning.',
        keyTopics: ['Linear & Logistic Regression', 'Decision Trees & Ensembles', 'Cross-Validation & Regularization', 'ROC-AUC & F1 Metrics'],
        recommendedProject: {
          title: 'Placement Probability Classifier',
          difficulty: 'Intermediate',
          skills: ['Scikit-Learn', 'Random Forest', 'Python'],
          description: 'Ensemble model predicting placement offers with feature importance explanation.',
        },
        timeEstimate: '4 Weeks · Later',
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
          title: 'Image Classifier with PyTorch',
          difficulty: 'Advanced',
          skills: ['PyTorch', 'CNN', 'Computer Vision'],
          description: 'Train a convolutional neural network on real image datasets with transfer learning.',
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
          title: 'Real-Time Inference Microservice',
          difficulty: 'Advanced',
          skills: ['FastAPI', 'Docker', 'MLOps'],
          description: 'Sub-20ms inference API deployed with Docker container.',
        },
        timeEstimate: '4 Weeks · Capstone',
      },
    ];
  }

  if (goal === 'Cybersecurity') {
    return [
      {
        id: 'cyber-1',
        title: 'Linux & Networking Fundamentals',
        subtitle: 'TCP/IP stack, Bash scripting, socket analysis, iptables',
        status: 'current',
        order: 1,
        whyThisNext: 'Operating systems and network traffic fundamentals are prerequisites for defensive security.',
        keyTopics: ['OSI 7 Layers vs TCP/IP', 'Wireshark Packet Analysis', 'Linux CLI & Permissions', 'Firewall Configurations'],
        recommendedProject: {
          title: 'Network Packet Sniffer & Flow Analyzer',
          difficulty: 'Beginner',
          skills: ['Python', 'Sockets', 'Linux'],
          description: 'Inspect raw network headers and count DNS queries in real time.',
        },
        timeEstimate: '3 Weeks · Current Focus',
      },
      {
        id: 'cyber-2',
        title: 'Python Scripting for Security',
        subtitle: 'Automation, Port scanners, Regex, Subnet calculators',
        status: 'up_next',
        order: 2,
        whyThisNext: 'Allows rapid automation of audits, log parsing, and system vulnerability verification.',
        keyTopics: ['Scapy Network Library', 'Regex Pattern Matching', 'Socket Programming', 'Automated Subnet Pingers'],
        recommendedProject: {
          title: 'Multi-Threaded TCP Port Scanner',
          difficulty: 'Intermediate',
          skills: ['Python', 'Sockets', 'Concurrency'],
          description: 'Scan 1,000 ports on authorized test hosts in under 3 seconds.',
        },
        timeEstimate: '3 Weeks · Up Next',
      },
      {
        id: 'cyber-3',
        title: 'Applied Cryptography & PKI',
        subtitle: 'AES, RSA, Public Key Infrastructure, TLS Handshake',
        status: 'later',
        order: 3,
        whyThisNext: 'Understand data protection in transit and at rest before addressing system exploitation.',
        keyTopics: ['Symmetric vs Asymmetric Ciphers', 'Diffie-Hellman Key Exchange', 'Digital Signatures & X.509', 'TLS 1.3 State Machine'],
        recommendedProject: {
          title: 'End-to-End Encrypted CLI Chat',
          difficulty: 'Intermediate',
          skills: ['Python', 'Cryptography', 'RSA', 'AES-GCM'],
          description: 'Command line chat application using hybrid RSA/AES encryption with integrity checks.',
        },
        timeEstimate: '3 Weeks · Later',
      },
      {
        id: 'cyber-4',
        title: 'Web Application Security & OWASP Top 10',
        subtitle: 'SQL injection, XSS, CSRF, IDOR, Broken Authentication',
        status: 'later',
        order: 4,
        whyThisNext: 'Web applications are the most common attack surface in enterprise environments.',
        keyTopics: ['SQLi Prevention & Parameterized Queries', 'XSS Sanitization & CSP', 'JWT Security & Session Hijacking', 'Burp Suite Interception'],
        recommendedProject: {
          title: 'Security Audit & Patching Lab',
          difficulty: 'Intermediate',
          skills: ['OWASP', 'Burp Suite', 'Web Security'],
          description: 'Identify 5 OWASP vulnerabilities in a vulnerable web app and document remediations.',
        },
        timeEstimate: '4 Weeks · Later',
      },
      {
        id: 'cyber-5',
        title: 'SOC Operations & SIEM Log Analysis',
        subtitle: 'Splunk/ELK, Incident response, Snort IDS, Threat hunting',
        status: 'later',
        order: 5,
        whyThisNext: 'Prepares students for entry-level Security Operations Center analyst roles.',
        keyTopics: ['Syslog & Windows Event IDs', 'Snort Rule Writing', 'Elastic SIEM Ingestion', 'Incident Triage Playbooks'],
        recommendedProject: {
          title: 'Intrusion Detection & Alerting Pipeline',
          difficulty: 'Advanced',
          skills: ['SIEM', 'Log Analysis', 'Linux'],
          description: 'Ingest server authentication logs and generate alerts on brute-force attempts.',
        },
        timeEstimate: '4 Weeks · Capstone',
      },
    ];
  }

  // Default: Software Development / Full-Stack / Core
  return INITIAL_ROADMAP.map((node, index) => ({
    ...node,
    status: index === 0 ? 'current' : index === 1 ? 'up_next' : 'later',
  }));
}

/**
 * Generate skill gaps tailored to a career goal.
 * For new users, all gaps start with completed: false.
 */
export function generateGoalSkillGaps(goal: CareerGoal): SkillGapItem[] {
  if (goal === 'AI / Machine Learning' || goal === 'Data Science') {
    return [
      {
        id: 'gap-aiml-1',
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
        id: 'gap-aiml-2',
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
        id: 'gap-aiml-3',
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
        id: 'gap-aiml-4',
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
        id: 'gap-aiml-5',
        name: 'MLOps & Containerized Serving',
        category: 'Development',
        currentStatus: 'not_started',
        importance: 'High',
        recommendedStage: 'Stage 4 — Capstone',
        completed: false,
        whyNeeded: 'Serving model predictions reliably via REST APIs inside Docker containers.',
        actionItem: 'Build a FastAPI service serving model predictions with response caching.',
      },
    ];
  }

  if (goal === 'Cybersecurity') {
    return [
      {
        id: 'gap-cyber-1',
        name: 'TCP/IP Packet Inspection & Wireshark',
        category: 'Core Computer Science',
        currentStatus: 'needs_development',
        importance: 'Foundational',
        recommendedStage: 'Current Stage — Immediate Focus',
        completed: false,
        whyNeeded: 'Analyzing packet payloads and identifying anomalies requires deep protocol fluency.',
        actionItem: 'Capture and inspect HTTP, DNS, and TCP handshake packets using Wireshark.',
      },
      {
        id: 'gap-cyber-2',
        name: 'Linux System Administration & Bash',
        category: 'Core Computer Science',
        currentStatus: 'needs_development',
        importance: 'High',
        recommendedStage: 'Current Stage — Concurrent',
        completed: false,
        whyNeeded: 'Servers and security appliances predominantly run Linux operating systems.',
        actionItem: 'Write shell scripts for user audit, file permissions inspection, and process monitoring.',
      },
      {
        id: 'gap-cyber-3',
        name: 'OWASP Top 10 Web Security',
        category: 'Development',
        currentStatus: 'not_started',
        importance: 'High',
        recommendedStage: 'Stage 2 — Up Next',
        completed: false,
        whyNeeded: 'Securing web endpoints against injection attacks and broken access controls.',
        actionItem: 'Complete OWASP Juice Shop challenges covering SQLi, XSS, and IDOR vulnerabilities.',
      },
      {
        id: 'gap-cyber-4',
        name: 'Applied Cryptography & TLS Handshake',
        category: 'Core Computer Science',
        currentStatus: 'not_started',
        importance: 'High',
        recommendedStage: 'Stage 3 — Later',
        completed: false,
        whyNeeded: 'Securing data in transit and understanding certificate validation mechanics.',
        actionItem: 'Implement AES-GCM file encryption and verify RSA digital signatures in Python.',
      },
      {
        id: 'gap-cyber-5',
        name: 'SIEM Log Ingestion & Threat Detection',
        category: 'Emerging Technologies',
        currentStatus: 'not_started',
        importance: 'High',
        recommendedStage: 'Stage 4 — Capstone',
        completed: false,
        whyNeeded: 'Enterprise defense centers on central log aggregation and correlation rules.',
        actionItem: 'Configure Elastic Stack or Splunk to ingest server authentication logs and trigger alerts.',
      },
    ];
  }

  // Default Software Development
  return INITIAL_SKILL_GAPS.map((g) => ({
    ...g,
    completed: false,
  }));
}

/**
 * Creates a clean UserRecord for a new student.
 * Never copies personal data from any existing user.
 * Progress starts at 0% and skills start empty until the student uploads or enters them.
 */
export function createNewUserRecord(params: {
  name: string;
  email: string;
  password?: string;
  branch?: BTechBranch;
  year?: BTechYear;
  goal?: CareerGoal;
}): UserRecord {
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim();
  const branch = params.branch || 'Computer Science & Engineering';
  const year = params.year || '1st Year';
  const goal = params.goal || "I'm not sure yet";

  const account: UserAccount = {
    userId,
    name: cleanName,
    email: cleanEmail,
    passwordHash: params.password || 'password123',
    createdAt: new Date().toISOString(),
  };

  const profile: StudentProfile = {
    id: userId,
    name: cleanName,
    email: cleanEmail,
    branch,
    year,
    goal,
    resumeUploaded: false,
    resumeFileName: undefined,
    resumeFileSize: undefined,
    resumeUploadDate: undefined,
    overallProgress: 0,
  };

  // Fresh unstarted course topics with 0% progress
  const courseTopics: CourseTopic[] = ALL_COURSE_TOPICS.map((t) => ({
    ...t,
    progress: 0,
    completed: false,
  }));

  // Fresh uncompleted projects
  const projects: ProjectItem[] = ALL_PROJECTS.map((p) => ({
    ...p,
    completed: false,
  }));

  // Clean empty skills list (no data copied from any demo user)
  const detectedSkills: DetectedSkill[] = [];

  // Goal-calibrated roadmap and skill gaps
  const roadmap = generateGoalRoadmap(goal);
  const skillGaps = generateGoalSkillGaps(goal);

  return {
    account,
    profile,
    detectedSkills,
    skillGaps,
    roadmap,
    courseTopics,
    projects,
  };
}

/**
 * Retrieve all registered user accounts index.
 */
export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_INDEX);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save user accounts index.
 */
function saveUsersIndex(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_INDEX, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users index:', err);
  }
}

/**
 * Get current authenticated user ID.
 */
export function getCurrentUserId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  } catch {
    return null;
  }
}

/**
 * Set current authenticated user ID.
 */
export function setCurrentUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  } catch (err) {
    console.error('Failed to set current user ID:', err);
  }
}

/**
 * Load complete user data record by userId.
 */
export function getUserRecord(userId: string): UserRecord | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load data for user ${userId}:`, err);
    return null;
  }
}

/**
 * Save complete user data record by userId (guarantees isolated persistence).
 */
export function saveUserRecord(record: UserRecord): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.USER_DATA_PREFIX}${record.account.userId}`,
      JSON.stringify(record)
    );
  } catch (err) {
    console.error(`Failed to save data for user ${record.account.userId}:`, err);
  }
}

/**
 * Register a new user account.
 * Rejects duplicate emails, initializes fresh isolated record, and logs the user in.
 */
export function registerUser(params: {
  name: string;
  email: string;
  password?: string;
  branch?: BTechBranch;
  year?: BTechYear;
  goal?: CareerGoal;
}): { success: boolean; record?: UserRecord; error?: string } {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!cleanEmail) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const existingUsers = getAllUsers();
  const existing = existingUsers.find((u) => u.email === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in instead.',
    };
  }

  const newRecord = createNewUserRecord(params);

  // Save record and update index
  saveUserRecord(newRecord);
  saveUsersIndex([...existingUsers, newRecord.account]);

  // Set as current logged in user
  setCurrentUserId(newRecord.account.userId);

  return { success: true, record: newRecord };
}

/**
 * Authenticate an existing user by email and password.
 */
export function loginUser(
  email: string,
  password?: string
): { success: boolean; record?: UserRecord; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const existingUsers = getAllUsers();
  const userAccount = existingUsers.find((u) => u.email === cleanEmail);

  if (!userAccount) {
    return {
      success: false,
      error: 'No account found with this email. Please check your credentials or create a new account.',
    };
  }

  if (password && userAccount.passwordHash && userAccount.passwordHash !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.',
    };
  }

  const record = getUserRecord(userAccount.userId);
  if (!record) {
    // If index existed without data, construct a fresh record for this account
    const freshRecord = createNewUserRecord({
      name: userAccount.name,
      email: userAccount.email,
    });
    freshRecord.account = userAccount;
    saveUserRecord(freshRecord);
    setCurrentUserId(userAccount.userId);
    return { success: true, record: freshRecord };
  }

  setCurrentUserId(userAccount.userId);
  return { success: true, record };
}

/**
 * Log out current active user. Completely clears active session reference.
 */
export function logoutUser(): void {
  setCurrentUserId(null);
}

/**
 * Get active user record, or null if no user is logged in.
 */
export function getCurrentUserRecord(): UserRecord | null {
  const currentId = getCurrentUserId();
  if (!currentId) return null;
  return getUserRecord(currentId);
}

/**
 * Optional Helper: Seed a dedicated test demo account (isolated from real users).
 * Used only when an evaluator explicitly clicks a quick test account in the Auth modal.
 */
export function seedDemoAccount(
  name: string,
  email: string,
  branch: BTechBranch,
  year: BTechYear,
  goal: CareerGoal,
  sampleProgress: number = 52
): UserRecord {
  const cleanEmail = email.toLowerCase();
  const existingUsers = getAllUsers();
  const existing = existingUsers.find((u) => u.email === cleanEmail);

  if (existing) {
    const existingRecord = getUserRecord(existing.userId);
    if (existingRecord) {
      setCurrentUserId(existing.userId);
      return existingRecord;
    }
  }

  const userId = `demo_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const account: UserAccount = {
    userId,
    name,
    email: cleanEmail,
    passwordHash: 'password123',
    createdAt: new Date().toISOString(),
  };

  const profile: StudentProfile = {
    id: userId,
    name,
    email: cleanEmail,
    branch,
    year,
    goal,
    resumeUploaded: true,
    resumeFileName: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
    resumeFileSize: '1.4 MB',
    resumeUploadDate: 'Sep 24, 2026',
    overallProgress: sampleProgress,
  };

  // Seed with realistic demo sample data
  const roadmap = generateGoalRoadmap(goal);
  // Mark early nodes completed for demo accounts
  if (roadmap.length > 2 && sampleProgress > 40) {
    roadmap[0].status = 'completed';
    roadmap[1].status = 'completed';
    roadmap[2].status = 'current';
  }

  const skillGaps = generateGoalSkillGaps(goal);
  if (skillGaps.length > 1 && sampleProgress > 40) {
    skillGaps[0].completed = true;
  }

  const courseTopics = ALL_COURSE_TOPICS.map((t, idx) => ({
    ...t,
    progress: idx < 3 ? 100 : idx < 6 ? 40 : 0,
    completed: idx < 3,
  }));

  const projects = ALL_PROJECTS.map((p, idx) => ({
    ...p,
    completed: idx === 0 && sampleProgress > 50,
  }));

  const detectedSkills: DetectedSkill[] = [
    {
      id: `sk-${userId}-1`,
      name: branch.includes('AI') ? 'Python' : 'Java',
      category: 'Programming',
      status: 'demonstrated',
      evidence: 'Coursework projects and Git commits verified',
      proficiencyScore: 70,
    },
    {
      id: `sk-${userId}-2`,
      name: branch.includes('AI') ? 'NumPy & Math' : 'DSA Foundations',
      category: 'Core Computer Science',
      status: 'demonstrated',
      evidence: 'Academic problem-solving grade A',
      proficiencyScore: 60,
    },
    {
      id: `sk-${userId}-3`,
      name: 'SQL & DBMS',
      category: 'Core Computer Science',
      status: 'demonstrated',
      evidence: 'Mini-project database schema queries',
      proficiencyScore: 55,
    },
    {
      id: `sk-${userId}-4`,
      name: 'Git & GitHub',
      category: 'Development',
      status: 'mentioned',
      evidence: 'Basic commits on college repositories',
      proficiencyScore: 35,
    },
  ];

  const record: UserRecord = {
    account,
    profile,
    detectedSkills,
    skillGaps,
    roadmap,
    courseTopics,
    projects,
  };

  saveUserRecord(record);
  saveUsersIndex([...existingUsers.filter((u) => u.email !== cleanEmail), account]);
  setCurrentUserId(userId);
  return record;
}
