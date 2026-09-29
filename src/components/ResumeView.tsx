import React, { useState } from 'react';
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
} from 'lucide-react';
import { DetectedSkill, SkillStatus, StudentProfile } from '../types';

interface ResumeViewProps {
  profile: StudentProfile;
  skills: DetectedSkill[];
  onUpdateSkills: (skills: DetectedSkill[]) => void;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onNavigateToGaps: () => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  profile,
  skills,
  onUpdateSkills,
  onUpdateProfile,
  onNavigateToGaps,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillStatus, setNewSkillStatus] = useState<SkillStatus>('demonstrated');
  const [analysisTimestamp, setAnalysisTimestamp] = useState('Analyzed today at 18:42');

  const runAnalysisAnimation = (fileName: string, size: string = '1.4 MB') => {
    setIsAnalyzing(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 400);

    setTimeout(() => {
      setScanStep(3);
    }, 800);

    setTimeout(() => {
      onUpdateProfile({
        resumeUploaded: true,
        resumeFileName: fileName,
        resumeFileSize: size,
        resumeUploadDate: 'Just now',
      });
      setIsAnalyzing(false);
      setScanStep(0);
      setAnalysisTimestamp('Analyzed just now');
    }, 1200);
  };

  const handleFileUpload = (fileName: string, size: string = '1.4 MB') => {
    runAnalysisAnimation(fileName, size);
  };

  const handleRemoveResume = () => {
    onUpdateProfile({
      resumeUploaded: false,
      resumeFileName: undefined,
      resumeFileSize: undefined,
      resumeUploadDate: undefined,
    });
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
      proficiencyScore: newSkillStatus === 'demonstrated' ? 70 : newSkillStatus === 'mentioned' ? 40 : 15,
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

  const demonstratedSkills = skills.filter((s) => s.status === 'demonstrated');
  const mentionedSkills = skills.filter((s) => s.status === 'mentioned');
  const notDetectedSkills = skills.filter((s) => s.status === 'not_detected');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Skill Analyzer
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Upload your engineering resume to discover demonstrated skills, detect missing competencies, and guide your roadmap.
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

      {/* 1. Upload Area */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Resume Document
          </h2>
          <span className="text-xs text-slate-500">
            Supported formats: PDF • DOC • DOCX
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
              handleFileUpload(files[0].name, `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`);
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
            Drop your resume here
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            PDF • DOC • DOCX (Maximum file size: 5 MB)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0].name);
                  }
                }}
              />
            </label>

            {/* Quick Sample Resume Loaders */}
            <button
              type="button"
              onClick={() => handleFileUpload('Aarav_Sharma_CSE_Resume.pdf', '1.4 MB')}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              Load Sample CSE Resume
            </button>
            <button
              type="button"
              onClick={() => handleFileUpload('Priya_Patel_AIML_Resume.pdf', '1.8 MB')}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              Load Sample AI/ML Resume
            </button>
          </div>
        </div>

        {/* Uploaded File Bar */}
        {profile.resumeUploaded && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {profile.resumeFileName || 'Resume.pdf'}
                </span>
                <span className="text-xs text-slate-500">
                  {profile.resumeFileSize || '1.4 MB'} · Uploaded {profile.resumeUploadDate}
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
                <span>View</span>
              </button>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0].name);
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
              <button
                type="button"
                onClick={() =>
                  runAnalysisAnimation(
                    profile.resumeFileName || 'Resume.pdf',
                    profile.resumeFileSize || '1.4 MB'
                  )
                }
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Analyze Resume</span>
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
                    ? 'Extracting text and tokenizing coursework headers...'
                    : scanStep === 2
                    ? 'Cross-referencing demonstrated project repositories with target skills...'
                    : 'Classifying demonstrated vs unverified keywords...'}
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

      {/* Role Match Readiness Summary Widget */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              Role Match Diagnostic
            </span>
            <h3 className="text-lg font-bold tracking-tight mt-0.5">
              Resume Alignment with {profile.goal}
            </h3>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
              Based on {demonstratedSkills.length} demonstrated skills and {mentionedSkills.length} keywords detected in your file. 
              {notDetectedSkills.length} foundational skills are recommended to be added to your current roadmap.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-indigo-300 font-mono uppercase">
                Profile Match
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {Math.round((demonstratedSkills.length / Math.max(skills.length, 1)) * 100)}%
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
        </div>
      </section>

      {/* 2. Resume Analysis Results */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                Diagnostic Scanner
              </span>
              <span className="text-xs text-slate-400">· {analysisTimestamp}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Detected Skills & Evidence
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowEditSkillsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Skills</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToGaps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <span>View Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mandatory Honest Disclaimer Callout */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Analysis Transparency & Limitations</span>
          </div>
          <p>
            «Resume analysis provides recommendations based on information detected in your resume. You can review and correct the results.»
          </p>
          <p className="mt-1 text-slate-500">
            <strong>Important:</strong> Do not treat "not detected" as proof that you do not know the skill. It simply indicates that strong project or coursework evidence was not found in your uploaded file. You can manually adjust any skill anytime.
          </p>
        </div>

        {/* Skill Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Demonstrated */}
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/80 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Demonstrated
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 tabular-nums">
                  {demonstratedSkills.length}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mb-4">
                Verified through coursework grades, completed GitHub projects, or code implementations.
              </p>

              <div className="space-y-2">
                {demonstratedSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>✅ {sk.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSkillStatus(sk.id, sk.status)}
                        className="text-[11px] text-slate-400 hover:text-indigo-600"
                        title="Click to toggle status"
                      >
                        change
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {sk.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mentioned / Needs Evidence */}
          <div className="bg-amber-50/50 rounded-xl border border-amber-200/80 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Mentioned / Needs Evidence
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 tabular-nums">
                  {mentionedSkills.length}
                </span>
              </div>
              <p className="text-[11px] text-amber-700 mb-4">
                Found as a keyword or listed tool, but lacking project context or quantifiable evidence.
              </p>

              <div className="space-y-2">
                {mentionedSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>⚠️ {sk.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSkillStatus(sk.id, sk.status)}
                        className="text-[11px] text-slate-400 hover:text-indigo-600"
                        title="Click to toggle status"
                      >
                        change
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {sk.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Not Detected */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-slate-400" />
                  Not Detected
                </span>
                <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">
                  {notDetectedSkills.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Not identified in the current resume. Recommended for your target career role.
              </p>

              <div className="space-y-2">
                {notDetectedSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>❌ {sk.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSkillStatus(sk.id, sk.status)}
                        className="text-[11px] text-slate-400 hover:text-indigo-600"
                        title="Click to toggle status"
                      >
                        change
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {sk.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  Correct detection mistakes or add missing engineering skills.
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

      {/* 4. Modal: Resume Document Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {profile.resumeFileName || 'Resume Document Preview'}
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

            <div className="flex-1 overflow-y-auto py-4 font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{profile.name}</h4>
                <p className="text-slate-600">{profile.email} · GitHub: github.com/{profile.name.toLowerCase().replace(/\s+/g, '')}</p>
                <p className="text-slate-600">B.Tech {profile.branch} ({profile.year})</p>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <h5 className="font-bold text-slate-900 uppercase">Education</h5>
                <p>• Bachelor of Technology in {profile.branch} (CGPA: 8.4/10.0)</p>
                <p>• Relevant Coursework: Data Structures, Object-Oriented Java, Database Systems, Computer Networks</p>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <h5 className="font-bold text-slate-900 uppercase">Technical Skills</h5>
                <p>• Languages: Java, C, Python, JavaScript</p>
                <p>• Web Technologies: HTML5, CSS3, Basic React</p>
                <p>• Databases & Tools: SQL, Git, GitHub, VS Code</p>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <h5 className="font-bold text-slate-900 uppercase">Academic Projects</h5>
                <p className="font-semibold">• Departmental Event Billing System (Java, File I/O)</p>
                <p className="text-slate-600 pl-3">- Implemented OOP principles to track departmental transactions and generate automated PDF invoices.</p>
                <p className="font-semibold mt-1">• Student Coding Club Portal (HTML, CSS, JavaScript)</p>
                <p className="text-slate-600 pl-3">- Built responsive registration interface with client-side form validation for 300+ club participants.</p>
              </div>
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
