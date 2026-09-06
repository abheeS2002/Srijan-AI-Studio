import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Compass,
  Save,
  Copy,
  Printer,
  Edit3,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Plus,
  Trash2,
  Check,
  BookMarked,
  School,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  DesignType,
  TeacherPhilosophyProfile,
  ClassroomProfile,
  LearnerProfile,
  MemoryItem,
  EducationalDesignOutput,
  LessonPhase,
  ClassroomSection,
  SyllabusChapter,
  SyllabusUnit,
} from '../types';

interface CoDesignWorkspaceProps {
  philosophy: TeacherPhilosophyProfile;
  classroom: ClassroomProfile;
  learners: LearnerProfile;
  memoryItems: MemoryItem[];
  savedDesigns: EducationalDesignOutput[];
  onSaveDesign: (design: EducationalDesignOutput) => void;
  onAddMemoryItem: (item: Omit<MemoryItem, 'id' | 'dateAdded'>) => void;
  activeClassroom?: ClassroomSection;
  selectedSyllabusChapterId?: string | null;
  onSelectSyllabusChapter?: (chapterId: string | null) => void;
  onSwitchToSyllabus?: () => void;
}

export const CoDesignWorkspace: React.FC<CoDesignWorkspaceProps> = ({
  philosophy,
  classroom,
  learners,
  memoryItems,
  savedDesigns,
  onSaveDesign,
  onAddMemoryItem,
  activeClassroom,
  selectedSyllabusChapterId,
  onSelectSyllabusChapter,
  onSwitchToSyllabus,
}) => {
  const [designType, setDesignType] = useState<DesignType>('lesson');
  const [topicPrompt, setTopicPrompt] = useState('Thermal Energy & Conduction: Indian Cooking Utensils');
  const [additionalConstraints, setAdditionalConstraints] = useState(
    'Keep group movement low due to narrow aisles; students need sentence starters.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<EducationalDesignOutput | null>(
    savedDesigns.length > 0 ? savedDesigns[0] : null
  );

  // Active View Tab for current design
  const [viewMode, setViewMode] = useState<'plan' | 'reasoning'>('plan');

  // Teacher Override / Critique state
  const [showCritiqueModal, setShowCritiqueModal] = useState(false);
  const [teacherCritiqueText, setTeacherCritiqueText] = useState('');
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [proposedMemoryItem, setProposedMemoryItem] = useState<any | null>(null);

  // Quick feedback banner
  const [copyToast, setCopyToast] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Find currently linked chapter from active classroom syllabus
  let selectedChapter: SyllabusChapter | null = null;
  let selectedUnit: SyllabusUnit | null = null;

  if (activeClassroom?.syllabus?.units && selectedSyllabusChapterId) {
    for (const unit of (activeClassroom.syllabus.units || [])) {
      const found = (unit.chapters || []).find((c) => c.id === selectedSyllabusChapterId);
      if (found) {
        selectedChapter = found;
        selectedUnit = unit;
        break;
      }
    }
  }

  // Update prompt when selected chapter changes
  useEffect(() => {
    if (selectedChapter) {
      setTopicPrompt(`Chapter ${selectedChapter.chapterNumber}: ${selectedChapter.title}`);
      if (selectedChapter.suggestedInquiryHook) {
        setAdditionalConstraints((prev) =>
          prev.includes(selectedChapter!.suggestedInquiryHook)
            ? prev
            : `${selectedChapter!.suggestedInquiryHook} ${prev}`.trim()
        );
      }
    }
  }, [selectedChapter?.id]);

  const safeMemoryItems = memoryItems || [];
  const activeMemoryRules = safeMemoryItems.filter(
    (m) => m.status === 'active' || (m.tier === 'stated_belief')
  );

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/reason-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designType,
          topicPrompt,
          philosophy,
          classroom,
          learners,
          memory: {
            statedBeliefs: safeMemoryItems.filter((m) => m.tier === 'stated_belief').map((m) => m.text),
            approvedInferences: safeMemoryItems
              .filter((m) => m.tier === 'approved_inference')
              .map((m) => m.text),
            srijanInferences: safeMemoryItems
              .filter((m) => m.tier === 'srijan_inference')
              .map((m) => m.text),
            temporaryContext: safeMemoryItems
              .filter((m) => m.tier === 'temporary_context')
              .map((m) => m.text),
          },
          additionalConstraints,
          syllabusContext: selectedChapter
            ? {
                chapterNumber: selectedChapter.chapterNumber,
                chapterTitle: selectedChapter.title,
                unitTitle: selectedUnit?.title,
                textbookPages: selectedChapter.textbookPages,
                learningOutcomes: selectedChapter.learningOutcomes,
                keyConcepts: selectedChapter.keyConcepts,
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.success || data.title) {
        const newDesign: EducationalDesignOutput = {
          id: `design-${Date.now()}`,
          title: data.title || `${topicPrompt} - Contextual ${designType.toUpperCase()}`,
          designType,
          topicPrompt,
          summary:
            data.summary ||
            `Co-designed with Srijan for Grade ${classroom.gradeLevel} (${classroom.classSize} students).`,
          createdAt: new Date().toISOString().split('T')[0],
          content: data.content || {},
          reasoningMatrix: data.reasoningMatrix || {
            recommendedApproach: 'Context-Aligned Instructional Flow',
            pedagogicalRationale: 'Calibrated to teacher philosophy and physical room geometry.',
            philosophyAlignment: ['Honors inquiry before terminology', 'Protects psychological safety'],
            classroomContextFit: [`Adapted for ${classroom.classSize} students in narrow aisles`],
            alternativesConsidered: [],
            educationalTradeoffs: [],
          },
          isSavedToLibrary: false,
        };

        setCurrentDesign(newDesign);
      }
    } catch (err) {
      console.error('Failed to generate design', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTeacherOverride = async () => {
    if (!teacherCritiqueText.trim() || !currentDesign) return;

    setIsCritiquing(true);
    try {
      const res = await fetch('/api/override-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDesign,
          teacherCritique: teacherCritiqueText,
          philosophy,
          classroom,
          learners,
          memory: memoryItems,
        }),
      });

      const data = await res.json();
      if (data.success && data.revisedDesign) {
        const updatedDesign: EducationalDesignOutput = {
          ...currentDesign,
          ...data.revisedDesign,
          teacherCritiquesAndOverrides: [
            ...(currentDesign.teacherCritiquesAndOverrides || []),
            {
              date: new Date().toISOString().split('T')[0],
              critique: teacherCritiqueText,
              resultSummary: data.reasoningUpdate?.adaptationSummary || 'Teacher override applied.',
            },
          ],
        };
        setCurrentDesign(updatedDesign);

        if (data.candidateMemoryUpdate) {
          setProposedMemoryItem(data.candidateMemoryUpdate);
        }
      }
    } catch (err) {
      console.error('Failed to apply override', err);
    } finally {
      setIsCritiquing(false);
      setShowCritiqueModal(false);
      setTeacherCritiqueText('');
    }
  };

  const handleAcceptMemoryCandidate = () => {
    if (!proposedMemoryItem) return;
    onAddMemoryItem({
      tier: proposedMemoryItem.type || 'approved_inference',
      text: proposedMemoryItem.text,
      category: 'pedagogy',
      source: 'teacher_stated',
      status: 'active',
      notes: `Saved from Teacher Override: ${proposedMemoryItem.rationale || ''}`,
    });
    setProposedMemoryItem(null);
  };

  const handleCopyMarkdown = () => {
    if (!currentDesign) return;
    let md = `# ${currentDesign.title}\n\n`;
    md += `**Design Type:** ${currentDesign.designType.toUpperCase()}\n`;
    md += `**Target Class:** Grade ${classroom.gradeLevel} (${classroom.classSize} students, ${classroom.periodLengthMinutes} min period)\n\n`;
    md += `### Summary\n${currentDesign.summary}\n\n`;

    if (currentDesign.content.essentialQuestion) {
      md += `**Essential Question:** ${currentDesign.content.essentialQuestion}\n\n`;
    }

    if (currentDesign.content.phases && currentDesign.content.phases.length > 0) {
      md += `### Lesson Flow & Pedagogical Rationale\n`;
      currentDesign.content.phases.forEach((p) => {
        md += `#### ${p.phaseName} (${p.timeAllocationMinutes} mins)\n`;
        md += `- **Teacher Action:** ${p.teacherAction}\n`;
        md += `- **Student Action:** ${p.studentAction}\n`;
        md += `- **Scaffolding & Materials:** ${p.scaffoldingAndMaterials}\n`;
        md += `- **Pedagogical Rationale:** ${p.pedagogicalRationale}\n\n`;
      });
    }

    md += `### Educational Reasoning & Trade-off Matrix\n`;
    md += `**Recommended Approach:** ${currentDesign.reasoningMatrix.recommendedApproach}\n\n`;
    md += `**Rationale:** ${currentDesign.reasoningMatrix.pedagogicalRationale}\n\n`;

    navigator.clipboard.writeText(md);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  const handleSaveToLibrary = () => {
    if (!currentDesign) return;
    onSaveDesign({ ...currentDesign, isSavedToLibrary: true });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Bento Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Educational Co-Design Studio
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-semibold">
              Contextual Reasoning First
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Srijan deliberates on your philosophy, room layout, and learner profile before generating. You maintain complete agency to override any recommendation.
          </p>
        </div>

        {currentDesign && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              title="Copy as clean Markdown"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              title="Print clean plan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print View</span>
            </button>
            <button
              onClick={handleSaveToLibrary}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Library</span>
            </button>
          </div>
        )}
      </div>

      {copyToast && (
        <div className="p-3 bg-slate-900 text-white text-xs rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Complete educational plan and reasoning matrix copied to clipboard!</span>
        </div>
      )}

      {saveToast && (
        <div className="p-3 bg-emerald-700 text-white text-xs rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Saved to your personal Teacher Library!</span>
        </div>
      )}

      {/* Candidate Memory Update Prompt from Override */}
      {proposedMemoryItem && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Teacher-Agency Memory Update Proposed
              </div>
              <p className="text-xs text-emerald-900 mt-0.5">
                "{proposedMemoryItem.text}"
              </p>
              <span className="text-[10px] text-emerald-700">
                Would you like Srijan to remember this preference in Tier 2 (Approved Inferences)?
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setProposedMemoryItem(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-emerald-100 rounded-lg"
            >
              No, Keep Temporary
            </button>
            <button
              onClick={handleAcceptMemoryCandidate}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Yes, Save to Memory</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Co-Design Input Form - Bento Card */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
      >
        {/* Design Type Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            1. Select Educational Output Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'lesson', label: 'Lesson Plan', desc: 'Single 45-min period flow' },
              { id: 'unit', label: 'Unit Sequence', desc: 'Thematic 2-week learning arc' },
              { id: 'activity', label: 'Tiered Activity', desc: 'Scaffolded task & prompts' },
              { id: 'assessment', label: 'Diagnostic Check', desc: 'Formative probes & rubric' },
            ].map((t) => {
              const isSelected = designType === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setDesignType(t.id as DesignType)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{t.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Syllabus & Textbook Grounding Card */}
        {activeClassroom?.syllabus && (
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Textbook & Syllabus Grounding ({activeClassroom.name})
                </span>
              </div>
              {onSwitchToSyllabus && (
                <button
                  type="button"
                  onClick={onSwitchToSyllabus}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1"
                >
                  <span>Upload Textbooks & Edit Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {selectedChapter ? (
              <div className="bg-white p-3 rounded-xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Chapter {selectedChapter.chapterNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedChapter.title}
                    </span>
                    {selectedChapter.textbookPages && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({selectedChapter.textbookPages})
                      </span>
                    )}
                  </div>
                  {selectedChapter.learningOutcomes && (
                    <div className="text-[11px] text-slate-600">
                      <strong>Outcomes: </strong>
                      {selectedChapter.learningOutcomes.join(' • ')}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectSyllabusChapter && onSelectSyllabusChapter(null)}
                  className="self-start sm:self-center flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Unlink Chapter</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value=""
                  onChange={(e) => onSelectSyllabusChapter && onSelectSyllabusChapter(e.target.value)}
                  className="text-xs p-2.5 rounded-xl border border-indigo-200 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-600/30 font-medium"
                >
                  <option value="">-- Select a chapter from {activeClassroom.name} syllabus to anchor this design --</option>
                  {activeClassroom.syllabus.units.map((u) => (
                    <optgroup key={u.id} label={`${u.title} (Unit ${u.unitNumber})`}>
                      {u.chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          Ch. {ch.chapterNumber}: {ch.title} {ch.textbookPages ? `(${ch.textbookPages})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Topic Prompt & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              2. Topic / Core Learning Goal
            </label>
            <input
              type="text"
              required
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Electric circuits using lemon battery, or Fractions as parts of a roti..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              3. Today's Specific Intent / Situational Notes
            </label>
            <input
              type="text"
              value={additionalConstraints}
              onChange={(e) => setAdditionalConstraints(e.target.value)}
              placeholder="e.g. Focus on peer error-correction; students are sluggish after lunch..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 text-slate-900"
            />
          </div>
        </div>

        {/* Active Context Anchors Bar */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="font-semibold text-slate-700">Contextual Anchors Considered by Srijan:</span>
            <span>{activeMemoryRules.length} active memory rules loaded</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-2xs">
              Grade {classroom.gradeLevel} ({classroom.classSize} students, {classroom.periodLengthMinutes} min)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-2xs">
              Layout: {classroom.roomLayout.slice(0, 30)}...
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-2xs">
              Language: {classroom.languageContext.slice(0, 35)}...
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10px] font-semibold">
              Philosophy: Dialogic Constructivism & Safe Error Culture
            </span>
          </div>
        </div>

        {/* Submit Co-Reasoning Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isGenerating ? 'Deliberating & Co-Reasoning...' : 'Deliberate & Co-Design'}</span>
          </button>
        </div>
      </form>

      {/* Generated Output Display */}
      {currentDesign && (
        <div className="space-y-4">
          {/* View Mode Switcher + Teacher Override Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('plan')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  viewMode === 'plan'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Instructional Plan & Phases</span>
              </button>

              <button
                onClick={() => setViewMode('reasoning')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  viewMode === 'reasoning'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-indigo-200" />
                <span>Educational Reasoning & Trade-offs Matrix</span>
              </button>
            </div>

            {/* Teacher Override / Challenge Button */}
            <button
              onClick={() => setShowCritiqueModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
              <span>Challenge / Modify Recommendation</span>
            </button>
          </div>

          {/* Overrides History if present */}
          {currentDesign.teacherCritiquesAndOverrides &&
            currentDesign.teacherCritiquesAndOverrides.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                <span className="font-semibold text-slate-800">Teacher Revisions Applied:</span>
                {currentDesign.teacherCritiquesAndOverrides.map((t, idx) => (
                  <div key={idx} className="text-slate-600 pl-2.5 border-l-2 border-indigo-600">
                    <span className="italic">"{t.critique}"</span> —{' '}
                    <span className="text-slate-500 font-mono text-[11px]">{t.resultSummary}</span>
                  </div>
                ))}
              </div>
            )}

          {/* VIEW TAB 1: INSTRUCTIONAL PLAN */}
          {viewMode === 'plan' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header Title & Summary */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                    {currentDesign.designType.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    Created {currentDesign.createdAt}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentDesign.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {currentDesign.summary}
                </p>
              </div>

              {/* Essential Question */}
              {currentDesign.content.essentialQuestion && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl">
                  <div className="text-[11px] font-mono text-indigo-900 font-bold uppercase tracking-wider mb-1">
                    Essential Inquiry Question
                  </div>
                  <div className="text-base font-semibold text-indigo-950">
                    "{currentDesign.content.essentialQuestion}"
                  </div>
                </div>
              )}

              {/* Objectives */}
              {currentDesign.content.objectives && currentDesign.content.objectives.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Targeted Conceptual Understandings
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {currentDesign.content.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lesson Phases with Embedded Pedagogical Rationale */}
              {currentDesign.content.phases && currentDesign.content.phases.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Instructional Phases & Embedded Pedagogical Rationale
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Total: {classroom.periodLengthMinutes} minutes
                    </span>
                  </div>

                  <div className="space-y-3">
                    {currentDesign.content.phases.map((phase, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/70 pb-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {phase.phaseName}
                          </h4>
                          <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {phase.timeAllocationMinutes} mins
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">Teacher Role: </span>
                            <span className="text-slate-700">{phase.teacherAction}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800">Learner Activity: </span>
                            <span className="text-slate-700">{phase.studentAction}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 text-xs">
                          <span className="font-semibold text-indigo-700">Pedagogical Rationale: </span>
                          <span className="italic text-slate-700">{phase.pedagogicalRationale}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations & Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {currentDesign.content.accommodations && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Classroom Accommodations
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      {currentDesign.content.accommodations.map((acc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentDesign.content.materialsNeeded && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Materials & Physical Prep
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      {currentDesign.content.materialsNeeded.map((mat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW TAB 2: EDUCATIONAL REASONING & TRADE-OFF MATRIX */}
          {viewMode === 'reasoning' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Contextual Educational Reasoning Matrix
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  This transparent deliberation shows why this specific approach was recommended over others, how it aligns with your philosophy, and what trade-offs were evaluated.
                </p>
              </div>

              {/* Recommended Approach Bento Hero */}
              <div className="p-5 rounded-2xl bg-indigo-900 text-white shadow-md relative overflow-hidden space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                  Recommended Approach
                </span>
                <h3 className="text-lg font-bold text-white">
                  {currentDesign.reasoningMatrix.recommendedApproach}
                </h3>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  {currentDesign.reasoningMatrix.pedagogicalRationale}
                </p>
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>
              </div>

              {/* Two columns: Philosophy Alignment vs Classroom Reality Fit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Philosophy Alignment</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {currentDesign.reasoningMatrix.philosophyAlignment?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Classroom Reality Fit</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {currentDesign.reasoningMatrix.classroomContextFit?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alternatives Considered Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Alternative Pedagogical Approaches Considered & Deprioritized
                </h4>

                <div className="space-y-2.5">
                  {currentDesign.reasoningMatrix.alternativesConsidered?.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{alt.approach}</span>
                        <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-semibold">
                          Deprioritized
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <div>
                          <span className="font-semibold text-emerald-800">Pros: </span>
                          {alt.pros}
                        </div>
                        <div>
                          <span className="font-semibold text-rose-800">Cons: </span>
                          {alt.cons}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-900">Why Srijan Deprioritized It: </span>
                        {alt.whyDeprioritized}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational Trade-offs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Educational Trade-offs Explicitly Evaluated
                </h4>

                <div className="space-y-2.5">
                  {currentDesign.reasoningMatrix.educationalTradeoffs?.map((trade, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                          <span className="font-bold block text-[10px] uppercase font-mono text-emerald-800">
                            Pedagogical Gain
                          </span>
                          {trade.gain}
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-950">
                          <span className="font-bold block text-[10px] uppercase font-mono text-rose-800">
                            Sacrifice or Cost
                          </span>
                          {trade.costOrSacrifice}
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 pl-1">
                        <span className="font-semibold text-indigo-700">Mitigation Strategy: </span>
                        {trade.mitigationStrategy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teacher Override & Critique Modal */}
      {showCritiqueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Teacher Override & Correction
                </h3>
              </div>
              <button
                onClick={() => setShowCritiqueModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Your pedagogical judgment supersedes the AI. Tell Srijan what needs to change, why the current plan doesn't fit your students, or what constraints to enforce.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Critique / Direction
              </label>
              <textarea
                rows={4}
                value={teacherCritiqueText}
                onChange={(e) => setTeacherCritiqueText(e.target.value)}
                placeholder="e.g., 'My students are too shy today to debate in pairs; replace Phase 2 with a silent chalk-talk puzzle where they annotate sentence stems on the board...'"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCritiqueModal(false)}
                className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isCritiquing || !teacherCritiqueText.trim()}
                onClick={handleTeacherOverride}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
              >
                {isCritiquing ? 'Re-Reasoning & Updating...' : 'Apply My Correction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
