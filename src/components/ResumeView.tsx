import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Eye,
  Plus,
  HelpCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Briefcase,
  GraduationCap,
  Code2,
  Terminal,
  ExternalLink,
  Target,
  Award,
  Layers,
  FileSearch,
  BookOpen,
} from 'lucide-react';
import { DetectedSkill, SkillGapItem, SkillStatus, StudentProfile } from '../types';
import { extractResumeText, formatFileSize } from '../data/resumeExtractor';
import {
  analyzeResumeContent,
  ResumeAnalysisResult,
} from '../data/resumeAnalyzer';

interface ResumeViewProps {
  profile: StudentProfile;
  skills: DetectedSkill[];
  onUpdateSkills: (skills: DetectedSkill[]) => void;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onNavigateToGaps: () => void;
  onUpdateSkillGaps?: (gaps: SkillGapItem[]) => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  profile,
  skills,
  onUpdateSkills,
  onUpdateProfile,
  onNavigateToGaps,
  onUpdateSkillGaps,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillStatus, setNewSkillStatus] = useState<SkillStatus>('demonstrated');
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Cached analysis result scoped per student
  const storageKey = profile.id
    ? `nyf_resume_analysis_${profile.id}`
    : 'nyf_resume_analysis_guest';

  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  // Extracted raw text preview
  const [rawExtractedText, setRawExtractedText] = useState<string>(() => {
    const key = profile.id ? `nyf_resume_raw_text_${profile.id}` : 'nyf_resume_raw_text_guest';
    return localStorage.getItem(key) || '';
  });

  // Sync analysis to localStorage whenever it changes
  useEffect(() => {
    if (analysisResult) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(analysisResult));
      } catch (err) {
        console.error('Failed to cache resume analysis:', err);
      }
    }
  }, [analysisResult, storageKey]);

  // Handle actual file upload and trigger real extraction + analysis
  const processResumeFile = async (file: File) => {
    setExtractionError(null);
    setIsAnalyzing(true);
    setScanStep(1);

    try {
      // Step 1: Text extraction from PDF or DOCX
      const extraction = await extractResumeText(file);

      if (!extraction.success) {
        setIsAnalyzing(false);
        setScanStep(0);
        setExtractionError(extraction.error || 'Failed to extract text from the file.');
        return;
      }

      setScanStep(2);

      // Save raw text for transparent viewing
      setRawExtractedText(extraction.text);
      if (profile.id) {
        localStorage.setItem(`nyf_resume_raw_text_${profile.id}`, extraction.text);
      }

      // Step 2: Comprehensive structured analysis & skill categorization
      setTimeout(() => {
        setScanStep(3);

        const result = analyzeResumeContent(extraction.text, profile, file.name);
        setAnalysisResult(result);

        // Update profile in parent
        onUpdateProfile({
          resumeUploaded: true,
          resumeFileName: file.name,
          resumeFileSize: extraction.fileSizeFormatted,
          resumeUploadDate: 'Just now',
        });

        // Update skills in parent
        onUpdateSkills(result.allDetectedSkills);

        // Update skill gaps in parent if callback provided
        if (onUpdateSkillGaps) {
          onUpdateSkillGaps(result.skillGaps);
        }

        setIsAnalyzing(false);
        setScanStep(0);
      }, 400);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      setScanStep(0);
      const msg = err instanceof Error ? err.message : 'Unknown parsing error';
      setExtractionError(`Failed to process resume: ${msg}. Please ensure the file is not corrupted.`);
    }
  };

  // Sample resume texts for instant evaluation without uploading
  const processSampleResume = (sampleType: 'CSE' | 'AIML' | 'FullStack') => {
    let sampleText = '';
    let fileName = '';

    if (sampleType === 'CSE') {
      fileName = `${(profile.name || 'Student').replace(/\s+/g, '_')}_CSE_Resume.pdf`;
      sampleText = `${profile.name || 'Aarav Sharma'}
Email: ${profile.email || 'aarav.sharma@btech.edu'} | Phone: +91 98765 43210
LinkedIn: linkedin.com/in/aarav-sharma-cse | GitHub: github.com/aarav-sharma-dev

EDUCATION
Indian Institute of Technology / Engineering College, Hyderabad
Bachelor of Technology in Computer Science & Engineering (2023 - 2027)
Current CGPA: 8.45 / 10.0
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Java, Database Systems (DBMS), Operating Systems, Computer Networks

TECHNICAL SKILLS
• Programming Languages: Java (Core & Advanced), C++, C, Python, SQL
• Core Concepts: Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), Relational Schema Design, REST APIs
• Databases & Tools: MySQL, PostgreSQL, Git, GitHub, Linux, Postman, VS Code

ACADEMIC PROJECTS
1. Departmental Event Billing System (Java, OOP, MySQL)
- Engineered desktop billing application processing 500+ departmental receipts with 100% financial calculation accuracy.
- Applied encapsulation, inheritance, and polymorphism to structure scalable invoice models.
- Integrated MySQL database transactions with JDBC connection pools for persistent transaction storage.

2. Algorithmic Log Analysis Engine (C++, Data Structures)
- Implemented high-throughput CLI tool parsing Apache web server access logs using sliding window and hash maps.
- Optimized query execution time by 45% using customized binary search trees over 100,000 log records.
- Added automated error code histogram generation and exported diagnostic summaries.

3. Student Coding Club Portal (HTML5, CSS3, JavaScript, Git)
- Collaborated in a team of 3 to build responsive registration portal for annual coding symposium with 350 participants.
- Managed version control workflows on GitHub using feature branches and pull requests.

ACHIEVEMENTS & CERTIFICATIONS
• Winner (Rank 2), Departmental Algorithmic Hackathon 2025
• Certified Java Foundations by Oracle Academy
• Technical Lead, Campus Open Source Club`;
    } else if (sampleType === 'AIML') {
      fileName = `${(profile.name || 'Student').replace(/\s+/g, '_')}_AIML_Resume.pdf`;
      sampleText = `${profile.name || 'Priya Patel'}
Email: ${profile.email || 'priya.patel@btech.edu'} | Phone: +91 98450 12345
LinkedIn: linkedin.com/in/priya-patel-aiml | GitHub: github.com/priyapatel-ml

EDUCATION
National Institute of Technology, B.Tech in Artificial Intelligence & Machine Learning
Graduation: 2026 | CGPA: 8.9 / 10.0
Relevant Coursework: Machine Learning, Linear Algebra, Probability & Statistics, Deep Learning, Data Mining

TECHNICAL SKILLS
• Programming: Python, R, SQL, C++
• ML & Data Science Libraries: NumPy, Pandas, Scikit-Learn, PyTorch, Matplotlib, Seaborn
• Tools & Platforms: Git, GitHub, Linux, Jupyter Notebook, Google Colab

PROJECTS
1. Campus Placement Probability Classifier (Python, Scikit-Learn, Pandas)
- Built ensemble classification pipeline predicting student placement offers with 87% ROC-AUC accuracy.
- Handled categorical encoding, missing value imputation, and feature importance analysis using Random Forests.

2. Satellite Imagery Land Cover Segmentation (PyTorch, OpenCV)
- Trained convolutional neural network on 10,000 aerial images achieving 0.81 Mean Intersection-over-Union.
- Implemented data augmentation pipelines and transfer learning with ResNet backbones.

CERTIFICATIONS
• Deep Learning Specialization - Coursera
• Python for Data Science and Machine Learning Bootcamp`;
    } else {
      fileName = `${(profile.name || 'Student').replace(/\s+/g, '_')}_FullStack_Resume.docx`;
      sampleText = `${profile.name || 'Karan Nair'}
Email: ${profile.email || 'karan.nair@btech.edu'} | Phone: +91 97654 32109
LinkedIn: linkedin.com/in/karan-nair-dev | GitHub: github.com/karannair-fullstack

EDUCATION
Bachelor of Technology in Information Technology (2023 - 2027)
CGPA: 8.2 / 10.0
Relevant Coursework: Web Engineering, Database Management, Software Engineering, Object-Oriented Systems

TECHNICAL SKILLS
• Languages: JavaScript, TypeScript, HTML/CSS, SQL
• Frameworks: React, Node.js, Express.js, Tailwind CSS, Next.js
• Databases & Tools: MongoDB, PostgreSQL, Redis, Git, GitHub, Docker, Postman

PROJECTS
1. Collaborative Engineering Task Management Hub (React, Node.js, Express, MongoDB)
- Developed responsive web application supporting real-time task board updates and status transitions.
- Designed RESTful API endpoints with JWT authentication and bcrypt password hashing.

2. Campus Resource Booking Microservice (TypeScript, PostgreSQL, Docker)
- Architected booking microservice with concurrent slot validation preventing double-booking anomalies.
- Deployed multi-container environment with Docker Compose and automated API testing in Postman.`;
    }

    setRawExtractedText(sampleText);
    if (profile.id) {
      localStorage.setItem(`nyf_resume_raw_text_${profile.id}`, sampleText);
    }

    setIsAnalyzing(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        const result = analyzeResumeContent(sampleText, profile, fileName);
        setAnalysisResult(result);

        onUpdateProfile({
          resumeUploaded: true,
          resumeFileName: fileName,
          resumeFileSize: '1.4 MB',
          resumeUploadDate: 'Just now',
        });

        onUpdateSkills(result.allDetectedSkills);

        if (onUpdateSkillGaps) {
          onUpdateSkillGaps(result.skillGaps);
        }

        setIsAnalyzing(false);
        setScanStep(0);
      }, 400);
    }, 400);
  };

  const handleRemoveResume = () => {
    onUpdateProfile({
      resumeUploaded: false,
      resumeFileName: undefined,
      resumeFileSize: undefined,
      resumeUploadDate: undefined,
    });
    setAnalysisResult(null);
    setRawExtractedText('');
    if (profile.id) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`nyf_resume_raw_text_${profile.id}`);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: DetectedSkill = {
      id: `custom-sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: 'General',
      status: newSkillStatus,
      evidence: 'Manually verified and confirmed by student in skill editor',
      proficiencyScore:
        newSkillStatus === 'demonstrated' ? 70 : newSkillStatus === 'mentioned' ? 40 : 15,
    };

    onUpdateSkills([...skills, newSkill]);
    setNewSkillName('');
  };

  const handleToggleSkillStatus = (id: string, current: SkillStatus) => {
    const next: SkillStatus =
      current === 'demonstrated'
        ? 'mentioned'
        : current === 'mentioned'
        ? 'not_detected'
        : 'demonstrated';

    onUpdateSkills(
      skills.map((s) =>
        s.id === id
          ? {
              ...s,
              status: next,
              proficiencyScore:
                next === 'demonstrated' ? 70 : next === 'mentioned' ? 40 : 20,
            }
          : s
      )
    );
  };

  const handleDeleteSkill = (id: string) => {
    onUpdateSkills(skills.filter((s) => s.id !== id));
  };

  // Skill groupings from active skills state
  const demonstratedSkills = skills.filter((s) => s.status === 'demonstrated');
  const mentionedSkills = skills.filter((s) => s.status === 'mentioned');
  const notDetectedSkills = skills.filter((s) => s.status === 'not_detected');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Intelligence & Skill Scanner
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Upload your PDF or DOCX resume to extract verified skills, audit placement gaps, and benchmark ATS readability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEditSkillsModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-slate-600" />
          <span>Edit Skills</span>
        </button>
      </div>

      {/* 1. Upload & File Area */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Upload Resume Document
          </h2>
          <span className="text-xs text-slate-500">
            Real file extraction: PDF • DOCX • DOC (Max 12 MB)
          </span>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              processResumeFile(files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Drag and drop your real resume here
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Supports standard PDF (.pdf) and Word documents (.docx)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
              <span>Choose PDF or DOCX File</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processResumeFile(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Quick Sample Resume Loaders for instant testing */}
            <button
              type="button"
              onClick={() => processSampleResume('CSE')}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-2xs"
            >
              Load Sample CSE Resume
            </button>
            <button
              type="button"
              onClick={() => processSampleResume('AIML')}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-2xs"
            >
              Load Sample AI/ML Resume
            </button>
            <button
              type="button"
              onClick={() => processSampleResume('FullStack')}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-2xs"
            >
              Load Sample Full-Stack Resume
            </button>
          </div>
        </div>

        {/* Extraction Error Notice */}
        {extractionError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Extraction Notice</p>
              <p className="mt-0.5 leading-relaxed">{extractionError}</p>
            </div>
          </div>
        )}

        {/* Uploaded File Bar */}
        {profile.resumeUploaded && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {profile.resumeFileName || 'Uploaded_Resume.pdf'}
                </span>
                <span className="text-xs text-slate-500">
                  {profile.resumeFileSize || '1.4 MB'} · Uploaded {profile.resumeUploadDate || 'Recently'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Extracted Text</span>
              </button>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processResumeFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Scanning Simulation Bar */}
        {isAnalyzing && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>
                  {scanStep === 1
                    ? 'Extracting raw text from document streams...'
                    : scanStep === 2
                    ? 'Parsing contact, education, skills, and project deliverables...'
                    : 'Benchmarking competencies against target career direction...'}
                </span>
              </span>
              <span className="font-mono text-indigo-700">
                {scanStep === 1 ? '35%' : scanStep === 2 ? '70%' : '95%'}
              </span>
            </div>
            <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: scanStep === 1 ? '35%' : scanStep === 2 ? '70%' : '95%',
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* 2. Structured Analysis Presentation (When Analysis Exists) */}
      {analysisResult ? (
        <div className="space-y-8">
          {/* Card: Resume Score & Transparent Breakdown */}
          <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                  Transparent Evaluation Matrix
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                  Resume Quality & Career Readiness Score
                </h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
                  Evaluated against your selected career track:{' '}
                  <strong className="text-white">{profile.goal}</strong>. Calculated using 7 explainable dimensions rather than an arbitrary number.
                </p>
              </div>

              {/* Overall Score Dial */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 self-start lg:self-auto">
                <div className="text-right">
                  <div className="text-[10px] text-indigo-300 font-mono uppercase">
                    Overall Score
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    {analysisResult.scoreBreakdown.overallScore}
                    <span className="text-sm font-normal text-indigo-300">/100</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-400/30">
                  {analysisResult.scoreBreakdown.overallScore >= 75
                    ? 'A'
                    : analysisResult.scoreBreakdown.overallScore >= 60
                    ? 'B'
                    : 'C'}
                </div>
              </div>
            </div>

            {/* Score Dimensions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 text-xs">
              {[
                { label: 'Skills Relevance', val: analysisResult.scoreBreakdown.skillsRelevance },
                { label: 'Projects Quality', val: analysisResult.scoreBreakdown.projectsQuality },
                { label: 'Technical Depth', val: analysisResult.scoreBreakdown.technicalDepth },
                { label: 'Career Alignment', val: analysisResult.scoreBreakdown.careerAlignment },
                { label: 'Education Details', val: analysisResult.scoreBreakdown.educationCompleteness },
                { label: 'ATS Readability', val: analysisResult.scoreBreakdown.atsReadability },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-[11px] text-indigo-200 font-medium truncate">
                    {item.label}
                  </div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
                    {item.val}%
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        item.val >= 70 ? 'bg-emerald-400' : item.val >= 45 ? 'bg-indigo-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Extracted Resume Profile (Identity & Education) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Extracted Candidate Identity & Education</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs">
              {/* Contact Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-indigo-900">
                  Contact Information
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-900">{analysisResult.personalInfo.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-900">{analysisResult.personalInfo.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-900">{analysisResult.personalInfo.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">GitHub:</span>
                  <span className="font-semibold text-slate-900">{analysisResult.personalInfo.github}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">LinkedIn:</span>
                  <span className="font-semibold text-slate-900">{analysisResult.personalInfo.linkedIn}</span>
                </div>
              </div>

              {/* Education Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-indigo-900">
                  Education Background
                </div>
                {analysisResult.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">College / Institute:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[200px] text-right">{edu.college}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Degree & Branch:</span>
                      <span className="font-semibold text-slate-900">{edu.degree} · {edu.branch}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Graduation Year:</span>
                      <span className="font-semibold text-slate-900">{edu.graduationYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">CGPA / Percentage:</span>
                      <span className="font-semibold text-indigo-700">{edu.cgpaOrPercentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Technical Skills Classification */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" />
                  <span>Technical Skills Ontology & Evidence</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Differentiates skills proven via code implementations vs keywords merely listed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200">
                  {analysisResult.demonstratedSkills.length} Demonstrated
                </span>
                <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold rounded-lg border border-amber-200">
                  {analysisResult.mentionedSkills.length} Mentioned
                </span>
              </div>
            </div>

            {/* Categorized Skills Pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2 text-indigo-900">
                  Programming Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.skills.programmingLanguages.length > 0 ? (
                    analysisResult.skills.programmingLanguages.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium text-slate-800">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None detected</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2 text-indigo-900">
                  Frameworks & Libraries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...analysisResult.skills.frameworks, ...analysisResult.skills.libraries].length > 0 ? (
                    [...analysisResult.skills.frameworks, ...analysisResult.skills.libraries].map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium text-slate-800">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None detected</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-2 text-indigo-900">
                  Databases, Tools & Cloud
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...analysisResult.skills.databases, ...analysisResult.skills.toolsAndPlatforms].length > 0 ? (
                    [...analysisResult.skills.databases, ...analysisResult.skills.toolsAndPlatforms].map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium text-slate-800">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Project In-Depth Analysis */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <span>Project Deliverables & Technical Quality Audit</span>
            </h2>

            <div className="space-y-4 mt-6">
              {analysisResult.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <h3 className="font-bold text-sm text-slate-900">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                          proj.careerRelevance === 'High'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proj.careerRelevance === 'Medium'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Relevance: {proj.careerRelevance}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {proj.problemSolved}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1">
                      Tech Stack:
                    </span>
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-indigo-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.missingDetails.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Suggested Improvements: </span>
                        <span>{proj.missingDetails.join(' ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Career Direction Matching & Skill Gap Analysis */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>Career Direction Matching: {profile.goal}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct benchmark against product engineering requirements.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToGaps}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Open Interactive Gap Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Path flow: Current -> Required -> Missing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="font-bold text-emerald-900 text-xs block mb-2">
                  ✓ Current Skills Found ({analysisResult.careerMatch.currentSkillsFound.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.careerMatch.currentSkillsFound.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 text-xs block mb-2">
                  ★ Required Track Benchmark ({analysisResult.careerMatch.requiredSkillsForTrack.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.careerMatch.requiredSkillsForTrack.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="font-bold text-rose-900 text-xs block mb-2">
                  • Missing Placement Skills ({analysisResult.careerMatch.missingSkillsForTrack.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.careerMatch.missingSkillsForTrack.length > 0 ? (
                    analysisResult.careerMatch.missingSkillsForTrack.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white text-rose-800 border border-rose-300 rounded font-medium text-[11px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-700 font-medium">All track baseline skills found!</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: ATS Analysis & Personalized Action Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ATS Analysis Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                  <span>ATS Keyword & Readability Audit</span>
                </h3>

                <div className="flex items-center justify-between mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Formatting Rating:</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                    {analysisResult.atsAnalysis.formattingRating} ({analysisResult.atsAnalysis.atsFriendlinessScore}/100)
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    ATS Scanner Observations:
                  </span>
                  {analysisResult.atsAnalysis.atsObservations.map((obs, idx) => (
                    <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Personalized Recommendations Card */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Tailored Recommendations for You</span>
                </h3>

                <div className="mt-4 space-y-3">
                  {analysisResult.personalizedRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed"
                    >
                      <strong className="text-indigo-900 font-bold block mb-1">
                        Action Item {idx + 1}:
                      </strong>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        /* Fallback Prompt when resume has not been analyzed yet */
        <section className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <FileSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No Resume Analysis on Record
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Upload your PDF or DOCX resume using the uploader above or test with one of the sample engineering resumes to generate your comprehensive audit.
          </p>
        </section>
      )}

      {/* 3. Modal: Edit Skills Dialog */}
      {showEditSkillsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Detected Skills
                </h3>
                <p className="text-xs text-slate-500">
                  Correct detection mistakes or manually add missing engineering skills.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditSkillsModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* Add New Skill Input */}
            <form onSubmit={handleAddSkill} className="py-4 border-b border-slate-100 flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add skill (e.g. Docker, TypeScript)"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <select
                value={newSkillStatus}
                onChange={(e) => setNewSkillStatus(e.target.value as SkillStatus)}
                className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white"
              >
                <option value="demonstrated">Demonstrated</option>
                <option value="mentioned">Mentioned</option>
                <option value="not_detected">Not Detected</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </form>

            {/* Current Skills List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {skills.map((sk) => (
                <div
                  key={sk.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                >
                  <span className="font-semibold text-slate-800">{sk.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSkillStatus(sk.id, sk.status)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        sk.status === 'demonstrated'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : sk.status === 'mentioned'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {sk.status === 'demonstrated'
                        ? '✅ Demonstrated'
                        : sk.status === 'mentioned'
                        ? '⚠️ Mentioned'
                        : '❌ Not Detected'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowEditSkillsModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Real Extracted Document Text Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Extracted Text: {profile.resumeFileName || 'Resume Document'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
              {rawExtractedText || 'No text extracted yet.'}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
