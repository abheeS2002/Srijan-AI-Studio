import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Compass,
  Heart,
  Target,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Award,
  RefreshCw,
} from 'lucide-react';
import {
  ClassroomSection,
  ClassroomSyllabus,
  SyllabusUnit,
  SyllabusChapter,
  TeacherPhilosophyProfile,
  ClassroomProfile,
  LearnerProfile,
} from '../types';

interface UnitStudioProps {
  activeClassroom: ClassroomSection;
  philosophy: TeacherPhilosophyProfile;
  classroom: ClassroomProfile;
  learners: LearnerProfile;
  onUpdateSyllabus: (updatedSyllabus: ClassroomSyllabus) => void;
  onLaunchCoDesignWithUnit: (unit: SyllabusUnit, chapter?: SyllabusChapter) => void;
  onSwitchToSyllabusOverview: () => void;
}

export const UnitStudio: React.FC<UnitStudioProps> = ({
  activeClassroom,
  philosophy,
  classroom,
  learners,
  onUpdateSyllabus,
  onLaunchCoDesignWithUnit,
  onSwitchToSyllabusOverview,
}) => {
  const syllabus = activeClassroom.syllabus;
  const units = syllabus.units || [];

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    units[0]?.id || ''
  );

  // Edit Unit Modal / Inline State
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);

  // Form State for editing or creating a unit
  const [editUnitNumber, setEditUnitNumber] = useState<number>(1);
  const [editUnitTitle, setEditUnitTitle] = useState('');
  const [editBigIdea, setEditBigIdea] = useState('');
  const [editEssentialQuestion, setEditEssentialQuestion] = useState('');
  const [editPriorityFocus, setEditPriorityFocus] = useState('');
  const [editEstimatedPeriods, setEditEstimatedPeriods] = useState<number>(18);
  const [editCompetencies, setEditCompetencies] = useState<string[]>([]);
  const [newCompetencyInput, setNewCompetencyInput] = useState('');
  const [editValues, setEditValues] = useState<string[]>([]);
  const [newValueInput, setNewValueInput] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // AI Suggestion State
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    source?: string;
    suggestedBigIdea?: string;
    suggestedEssentialQuestion?: string;
    suggestedPriorityFocus?: string;
    suggestedCompetencies?: string[];
    suggestedValues?: Array<{ value: string; dispositionRationale: string }>;
    suggestedChapterProgressions?: Array<{
      title: string;
      suggestedHook: string;
      keyConcepts: string[];
    }>;
  } | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Chapter Creation / Editing inside selected unit
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterConcepts, setNewChapterConcepts] = useState('');
  const [newChapterOutcomes, setNewChapterOutcomes] = useState('');
  const [newChapterPages, setNewChapterPages] = useState('');
  const [newChapterHook, setNewChapterHook] = useState('');

  // Find active unit
  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0] || null;

  // Populate edit fields when editing starts
  const startEditingCurrentUnit = () => {
    if (!activeUnit) return;
    setEditUnitNumber(activeUnit.unitNumber);
    setEditUnitTitle(activeUnit.title);
    setEditBigIdea(activeUnit.bigIdea || '');
    setEditEssentialQuestion(activeUnit.essentialQuestion || '');
    setEditPriorityFocus(activeUnit.priorityFocus || '');
    setEditEstimatedPeriods(activeUnit.estimatedPeriods || 18);
    setEditCompetencies([...(activeUnit.keyCompetencies || [])]);
    setEditValues([...(activeUnit.unitValues || [])]);
    setEditNotes(activeUnit.notes || '');
    setIsEditingUnit(true);
  };

  const startCreatingNewUnit = () => {
    const nextNum = units.length > 0 ? Math.max(...units.map((u) => u.unitNumber)) + 1 : 1;
    setEditUnitNumber(nextNum);
    setEditUnitTitle('');
    setEditBigIdea('');
    setEditEssentialQuestion('');
    setEditPriorityFocus('');
    setEditEstimatedPeriods(20);
    setEditCompetencies([]);
    setEditValues([]);
    setEditNotes('');
    setIsCreatingUnit(true);
  };

  const handleSaveUnit = () => {
    if (!editUnitTitle.trim()) return;

    if (isCreatingUnit) {
      const newUnit: SyllabusUnit = {
        id: `unit-${Date.now()}`,
        unitNumber: editUnitNumber,
        title: editUnitTitle.trim(),
        bigIdea: editBigIdea.trim(),
        essentialQuestion: editEssentialQuestion.trim(),
        priorityFocus: editPriorityFocus.trim(),
        estimatedPeriods: editEstimatedPeriods,
        keyCompetencies: editCompetencies.filter((c) => c.trim().length > 0),
        unitValues: editValues.filter((v) => v.trim().length > 0),
        notes: editNotes.trim(),
        chapters: [],
      };

      const updatedUnits = [...units, newUnit].sort((a, b) => a.unitNumber - b.unitNumber);
      const updatedSyllabus: ClassroomSyllabus = {
        ...syllabus,
        units: updatedUnits,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      onUpdateSyllabus(updatedSyllabus);
      setSelectedUnitId(newUnit.id);
      setIsCreatingUnit(false);
    } else if (isEditingUnit && activeUnit) {
      const updatedUnit: SyllabusUnit = {
        ...activeUnit,
        unitNumber: editUnitNumber,
        title: editUnitTitle.trim(),
        bigIdea: editBigIdea.trim(),
        essentialQuestion: editEssentialQuestion.trim(),
        priorityFocus: editPriorityFocus.trim(),
        estimatedPeriods: editEstimatedPeriods,
        keyCompetencies: editCompetencies.filter((c) => c.trim().length > 0),
        unitValues: editValues.filter((v) => v.trim().length > 0),
        notes: editNotes.trim(),
      };

      const updatedUnits = units.map((u) => (u.id === activeUnit.id ? updatedUnit : u));
      const updatedSyllabus: ClassroomSyllabus = {
        ...syllabus,
        units: updatedUnits,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      onUpdateSyllabus(updatedSyllabus);
      setIsEditingUnit(false);
    }
  };

  const handleDeleteUnit = (unitIdToDelete: string) => {
    if (units.length <= 1) {
      alert('A syllabus must contain at least one unit.');
      return;
    }
    const unitToDelete = units.find((u) => u.id === unitIdToDelete);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${unitToDelete?.title || 'this unit'}"? Any chapters inside it will be moved or archived.`
    );
    if (!confirmDelete) return;

    const remaining = units.filter((u) => u.id !== unitIdToDelete);
    const updatedSyllabus: ClassroomSyllabus = {
      ...syllabus,
      units: remaining,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    onUpdateSyllabus(updatedSyllabus);
    if (selectedUnitId === unitIdToDelete) {
      setSelectedUnitId(remaining[0]?.id || '');
    }
  };

  // AI Suggestion Handler
  const handleFetchAiSuggestions = async (targetUnit: SyllabusUnit) => {
    setIsSuggesting(true);
    setShowAiModal(true);
    setAiSuggestions(null);

    try {
      const res = await fetch('/api/suggest-unit-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitTitle: targetUnit.title,
          unitNumber: targetUnit.unitNumber,
          subject: syllabus.subject,
          gradeLevel: syllabus.gradeLevel,
          existingChapters: targetUnit.chapters || [],
          classroom,
          philosophy,
          learners,
        }),
      });

      const data = await res.json();
      setAiSuggestions(data);
    } catch (err) {
      console.error('Failed to get AI suggestions:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Chapter Handlers
  const handleAddChapter = () => {
    if (!activeUnit || !newChapterTitle.trim()) return;

    const newChapter: SyllabusChapter = {
      id: `ch-${Date.now()}`,
      chapterNumber: (activeUnit.chapters?.length || 0) + 1,
      title: newChapterTitle.trim(),
      keyConcepts: newChapterConcepts
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
      learningOutcomes: newChapterOutcomes
        .split('\n')
        .map((o) => o.trim())
        .filter((o) => o.length > 0),
      textbookPages: newChapterPages.trim() || undefined,
      suggestedInquiryHook: newChapterHook.trim() || undefined,
      status: 'planning',
      linkedDesignCount: 0,
    };

    const updatedUnit: SyllabusUnit = {
      ...activeUnit,
      chapters: [...(activeUnit.chapters || []), newChapter],
    };

    const updatedUnits = units.map((u) => (u.id === activeUnit.id ? updatedUnit : u));
    onUpdateSyllabus({
      ...syllabus,
      units: updatedUnits,
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setNewChapterTitle('');
    setNewChapterConcepts('');
    setNewChapterOutcomes('');
    setNewChapterPages('');
    setNewChapterHook('');
    setShowAddChapterModal(false);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!activeUnit) return;
    const confirmDelete = window.confirm('Are you sure you want to remove this chapter from the unit?');
    if (!confirmDelete) return;

    const updatedChapters = (activeUnit.chapters || []).filter((c) => c.id !== chapterId);
    const updatedUnit: SyllabusUnit = {
      ...activeUnit,
      chapters: updatedChapters,
    };
    const updatedUnits = units.map((u) => (u.id === activeUnit.id ? updatedUnit : u));
    onUpdateSyllabus({
      ...syllabus,
      units: updatedUnits,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  // Helper to add competency to edit state
  const handleAddCompetency = () => {
    if (!newCompetencyInput.trim()) return;
    setEditCompetencies((prev) => [...prev, newCompetencyInput.trim()]);
    setNewCompetencyInput('');
  };

  const handleRemoveCompetency = (index: number) => {
    setEditCompetencies((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to add value to edit state
  const handleAddValue = () => {
    if (!newValueInput.trim()) return;
    setEditValues((prev) => [...prev, newValueInput.trim()]);
    setNewValueInput('');
  };

  const handleRemoveValue = (index: number) => {
    setEditValues((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6" id="unit-studio-workspace">
      {/* Top Banner: Unit-Oriented Planning & Teacher Agency Principle */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-200/50 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Unit Architecture & Micro-Level Planning
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Teacher Agency First
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Define your unit priorities, competencies, and values. Srijan suggests pedagogical anchors, but every final decision is yours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            id="unit-studio-create-btn"
            onClick={startCreatingNewUnit}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Define New Unit
          </button>
          <button
            id="unit-studio-syllabus-link-btn"
            onClick={onSwitchToSyllabusOverview}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Curriculum Matrix
          </button>
        </div>
      </div>

      {/* Main Grid: Left Unit Navigation Cards, Right Deep Unit Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Unit Selector Strip (4 columns on lg) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Units ({units.length})
            </span>
            <span className="text-xs text-slate-500">
              {activeClassroom.name}
            </span>
          </div>

          <div className="space-y-2.5">
            {units.map((unit) => {
              const isSelected = unit.id === selectedUnitId;
              const chapterCount = unit.chapters?.length || 0;
              const valuesCount = unit.unitValues?.length || 0;
              const competenciesCount = unit.keyCompetencies?.length || 0;

              return (
                <div
                  key={unit.id}
                  id={`unit-card-${unit.id}`}
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setIsEditingUnit(false);
                    setIsCreatingUnit(false);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-400/50'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                        Unit {unit.unitNumber}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {unit.estimatedPeriods || 18} periods
                      </span>
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Focused
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm mt-2 leading-snug line-clamp-2">
                    {unit.title}
                  </h3>

                  {unit.priorityFocus && (
                    <p className="text-xs text-amber-800/90 mt-1.5 line-clamp-2 font-medium bg-amber-100/50 px-2 py-1 rounded-md">
                      🎯 {unit.priorityFocus}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-emerald-500" />
                      {competenciesCount} comp.
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      {valuesCount} values
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            id="unit-studio-add-quick-btn"
            onClick={startCreatingNewUnit}
            className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Another Unit
          </button>
        </div>

        {/* Deep Unit Editor / Workspace (8 columns on lg) */}
        <div className="lg:col-span-8">
          {activeUnit ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden" id="unit-detail-workspace">
              {/* Unit Workspace Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                      Unit {activeUnit.unitNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Estimated: {activeUnit.estimatedPeriods || 18} class periods
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="unit-ai-suggest-trigger-btn"
                      onClick={() => handleFetchAiSuggestions(activeUnit)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200/60"
                      title="Request AI suggestions for big idea, competencies, and values"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Suggestions
                    </button>

                    {!isEditingUnit && (
                      <button
                        id="unit-edit-btn"
                        onClick={startEditingCurrentUnit}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Unit
                      </button>
                    )}

                    <button
                      id="unit-delete-btn"
                      onClick={() => handleDeleteUnit(activeUnit.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                      title="Delete Unit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {!isEditingUnit ? (
                  <div className="mt-3">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {activeUnit.title}
                    </h1>
                    {activeUnit.bigIdea && (
                      <p className="text-sm text-slate-600 mt-1 italic">
                        &ldquo;{activeUnit.bigIdea}&rdquo;
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Unit Title
                      </label>
                      <input
                        type="text"
                        value={editUnitTitle}
                        onChange={(e) => setEditUnitTitle(e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-base font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Unit Number
                        </label>
                        <input
                          type="number"
                          value={editUnitNumber}
                          onChange={(e) => setEditUnitNumber(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Estimated Class Periods
                        </label>
                        <input
                          type="number"
                          value={editEstimatedPeriods}
                          onChange={(e) => setEditEstimatedPeriods(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Area: Priority Focus, Competencies, Values & Chapters */}
              <div className="p-6 space-y-6">
                {/* 1. Priority Focus & Essential Question */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority Focus */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-600" />
                        Unit Overarching Priority Focus
                      </span>
                    </div>

                    {!isEditingUnit ? (
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {activeUnit.priorityFocus || (
                          <span className="text-slate-400 italic">
                            No priority focus defined yet. Click &quot;Edit Unit&quot; or &quot;AI Suggestions&quot; to establish the overarching pedagogical focus.
                          </span>
                        )}
                      </p>
                    ) : (
                      <textarea
                        value={editPriorityFocus}
                        onChange={(e) => setEditPriorityFocus(e.target.value)}
                        placeholder="e.g. Hands-on low-movement tactile demonstrations first; explicit bilingual vocabulary bridging."
                        rows={3}
                        className="w-full text-xs p-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                    )}
                  </div>

                  {/* Essential Question */}
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        Essential Driving Question
                      </span>
                    </div>

                    {!isEditingUnit ? (
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {activeUnit.essentialQuestion || (
                          <span className="text-slate-400 italic">
                            No essential question defined yet. A provocative question helps students connect daily lessons to enduring mysteries.
                          </span>
                        )}
                      </p>
                    ) : (
                      <textarea
                        value={editEssentialQuestion}
                        onChange={(e) => setEditEssentialQuestion(e.target.value)}
                        placeholder="e.g. How can microscopic interactions cause colossal transformations in our everyday world?"
                        rows={3}
                        className="w-full text-xs p-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Big Idea if editing */}
                {isEditingUnit && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Unit Big Idea (Enduring Understanding)
                    </label>
                    <textarea
                      value={editBigIdea}
                      onChange={(e) => setEditBigIdea(e.target.value)}
                      placeholder="e.g. Matter transforms across phases through invisible molecular rearrangements and energy transfers."
                      rows={2}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                )}

                {/* 2. Unit Key Competencies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Unit Target Competencies ({isEditingUnit ? editCompetencies.length : activeUnit.keyCompetencies?.length || 0})
                    </h3>
                  </div>

                  {!isEditingUnit ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(activeUnit.keyCompetencies || []).map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-emerald-200/80 bg-emerald-50/40 text-xs text-emerald-950 flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{comp}</span>
                        </div>
                      ))}
                      {(activeUnit.keyCompetencies || []).length === 0 && (
                        <p className="text-xs text-slate-400 italic col-span-2">
                          No competencies defined for this unit. Click &quot;Edit Unit&quot; or &quot;AI Suggestions&quot; to establish what students will achieve.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        {editCompetencies.map((comp, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs"
                          >
                            <span className="text-slate-800">{comp}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCompetency(idx)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCompetencyInput}
                          onChange={(e) => setNewCompetencyInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetency())}
                          placeholder="Type a new competency (e.g. Model atomic rearrangements in combustion) and press Add..."
                          className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCompetency}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Unit Values & Habits of Mind */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Cultivated Unit Values & Dispositions ({isEditingUnit ? editValues.length : activeUnit.unitValues?.length || 0})
                    </h3>
                  </div>

                  {!isEditingUnit ? (
                    <div className="flex flex-wrap gap-2">
                      {(activeUnit.unitValues || []).map((val, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-lg border border-rose-200/90 bg-rose-50/50 text-xs font-semibold text-rose-900 flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-rose-500" />
                          <span>{val}</span>
                        </div>
                      ))}
                      {(activeUnit.unitValues || []).length === 0 && (
                        <p className="text-xs text-slate-400 italic">
                          No values defined yet. Adding values ensures lesson planning explicitly cultivates social-emotional and intellectual habits.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {editValues.map((val, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
                          >
                            <span>{val}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveValue(idx)}
                              className="text-rose-400 hover:text-rose-700 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newValueInput}
                          onChange={(e) => setNewValueInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
                          placeholder="Type a value (e.g. Scientific Humility, Collaborative Care, Evidentiary Skepticism)..."
                          className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddValue}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                        >
                          Add Value
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save or Cancel Bar for Editing */}
                {isEditingUnit && (
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingUnit(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveUnit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Unit Changes
                    </button>
                  </div>
                )}

                {/* 4. Chapters Included in this Unit */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-slate-600" />
                        Chapters in this Unit ({activeUnit.chapters?.length || 0})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Lessons co-designed for these chapters will inherit and respect this unit&apos;s priorities.
                      </p>
                    </div>

                    <button
                      id="unit-add-chapter-btn"
                      onClick={() => setShowAddChapterModal(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Chapter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(activeUnit.chapters || []).map((ch) => (
                      <div
                        key={ch.id}
                        id={`unit-chapter-row-${ch.id}`}
                        className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                              Chapter {ch.chapterNumber}
                            </span>
                            <h4 className="text-sm font-semibold text-slate-900">
                              {ch.title}
                            </h4>
                            {ch.textbookPages && (
                              <span className="text-[11px] text-slate-500">
                                ({ch.textbookPages})
                              </span>
                            )}
                          </div>

                          {ch.suggestedInquiryHook && (
                            <p className="text-xs text-indigo-900/90 bg-indigo-50/60 px-2 py-1 rounded inline-block">
                              💡 <span className="font-medium">Hook:</span> {ch.suggestedInquiryHook}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1 mt-1">
                            {(ch.keyConcepts || []).map((kc, kIdx) => (
                              <span
                                key={kIdx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                              >
                                {kc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            id={`unit-chapter-codesign-btn-${ch.id}`}
                            onClick={() => onLaunchCoDesignWithUnit(activeUnit, ch)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 shadow-xs transition-colors"
                          >
                            <span>Co-Design Lesson</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(ch.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Remove Chapter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(activeUnit.chapters || []).length === 0 && (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-600 font-medium">
                          No chapters mapped to this unit yet.
                        </p>
                        <button
                          onClick={() => setShowAddChapterModal(true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add First Chapter
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Primary Unit Action: Co-Design Direct Lesson from Unit */}
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Ready for Micro-Level Lesson Planning?
                    </h4>
                    <p className="text-xs text-amber-800/80">
                      Co-design a custom lesson anchored strictly in Unit {activeUnit.unitNumber}&apos;s priorities, competencies, and values.
                    </p>
                  </div>

                  <button
                    id="unit-primary-codesign-action-btn"
                    onClick={() => onLaunchCoDesignWithUnit(activeUnit)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all"
                  >
                    <span>Co-Design Unit Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No unit selected</p>
              <p className="text-xs text-slate-500 mt-1">Select a unit from the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: AI Architecture Suggestions (Teacher Decides) */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-amber-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Unit Architecture Suggestions
                  </h3>
                  <p className="text-xs text-slate-600">
                    Srijan recommends pedagogical anchors; your final choice prevails.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {isSuggesting && (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    Synthesizing unit architecture...
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Calibrating big ideas, driving questions, competencies, and values to Grade {classroom.gradeLevel} with {classroom.classSize} students.
                  </p>
                </div>
              )}

              {!isSuggesting && aiSuggestions && (
                <div className="space-y-5">
                  {/* Big Idea Suggestion */}
                  {aiSuggestions.suggestedBigIdea && (
                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 uppercase tracking-wide">
                          Suggested Big Idea
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeUnit) {
                              const updated: SyllabusUnit = {
                                ...activeUnit,
                                bigIdea: aiSuggestions.suggestedBigIdea,
                              };
                              onUpdateSyllabus({
                                ...syllabus,
                                units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                              });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                          Adopt Big Idea
                        </button>
                      </div>
                      <p className="text-slate-800 italic">
                        &ldquo;{aiSuggestions.suggestedBigIdea}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Essential Question */}
                  {aiSuggestions.suggestedEssentialQuestion && (
                    <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900 uppercase tracking-wide">
                          Suggested Essential Question
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeUnit) {
                              const updated: SyllabusUnit = {
                                ...activeUnit,
                                essentialQuestion: aiSuggestions.suggestedEssentialQuestion,
                              };
                              onUpdateSyllabus({
                                ...syllabus,
                                units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                              });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Adopt Essential Question
                        </button>
                      </div>
                      <p className="text-slate-800 font-medium">
                        {aiSuggestions.suggestedEssentialQuestion}
                      </p>
                    </div>
                  )}

                  {/* Priority Focus */}
                  {aiSuggestions.suggestedPriorityFocus && (
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 uppercase tracking-wide">
                          Suggested Priority Focus
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeUnit) {
                              const updated: SyllabusUnit = {
                                ...activeUnit,
                                priorityFocus: aiSuggestions.suggestedPriorityFocus,
                              };
                              onUpdateSyllabus({
                                ...syllabus,
                                units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                              });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                        >
                          Adopt Priority Focus
                        </button>
                      </div>
                      <p className="text-slate-800">
                        {aiSuggestions.suggestedPriorityFocus}
                      </p>
                    </div>
                  )}

                  {/* Competencies */}
                  {aiSuggestions.suggestedCompetencies && aiSuggestions.suggestedCompetencies.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase tracking-wide">
                          Suggested Competencies
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeUnit && aiSuggestions.suggestedCompetencies) {
                              const existing = activeUnit.keyCompetencies || [];
                              const combined = Array.from(new Set([...existing, ...aiSuggestions.suggestedCompetencies]));
                              const updated: SyllabusUnit = {
                                ...activeUnit,
                                keyCompetencies: combined,
                              };
                              onUpdateSyllabus({
                                ...syllabus,
                                units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                              });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900"
                        >
                          Adopt All Competencies
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiSuggestions.suggestedCompetencies.map((comp, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <span className="text-slate-700">{comp}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (activeUnit) {
                                  const existing = activeUnit.keyCompetencies || [];
                                  if (!existing.includes(comp)) {
                                    const updated: SyllabusUnit = {
                                      ...activeUnit,
                                      keyCompetencies: [...existing, comp],
                                    };
                                    onUpdateSyllabus({
                                      ...syllabus,
                                      units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                                    });
                                  }
                                }
                              }}
                              className="text-[11px] text-emerald-700 font-semibold hover:underline shrink-0"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Values & Dispositions */}
                  {aiSuggestions.suggestedValues && aiSuggestions.suggestedValues.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase tracking-wide">
                          Suggested Values & Dispositions
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeUnit && aiSuggestions.suggestedValues) {
                              const existing = activeUnit.unitValues || [];
                              const newVals = aiSuggestions.suggestedValues.map((v) => v.value);
                              const combined = Array.from(new Set([...existing, ...newVals]));
                              const updated: SyllabusUnit = {
                                ...activeUnit,
                                unitValues: combined,
                              };
                              onUpdateSyllabus({
                                ...syllabus,
                                units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                              });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700"
                        >
                          Adopt All Values
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiSuggestions.suggestedValues.map((vItem, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-200/70 flex items-start justify-between gap-2"
                          >
                            <div>
                              <span className="font-bold text-rose-900 block">{vItem.value}</span>
                              <span className="text-[11px] text-slate-600">{vItem.dispositionRationale}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (activeUnit) {
                                  const existing = activeUnit.unitValues || [];
                                  if (!existing.includes(vItem.value)) {
                                    const updated: SyllabusUnit = {
                                      ...activeUnit,
                                      unitValues: [...existing, vItem.value],
                                    };
                                    onUpdateSyllabus({
                                      ...syllabus,
                                      units: units.map((u) => (u.id === activeUnit.id ? updated : u)),
                                    });
                                  }
                                }
                              }}
                              className="text-[11px] text-rose-700 font-semibold hover:underline shrink-0"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/60">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900"
              >
                Close Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Chapter to Unit */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Chapter to Unit {activeUnit?.unitNumber}
              </h3>
              <button
                onClick={() => setShowAddChapterModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Friction: Resisting Motion & Dissipating Heat"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-600 block mb-1">
                  Key Concepts (comma-separated)
                </label>
                <input
                  type="text"
                  value={newChapterConcepts}
                  onChange={(e) => setNewChapterConcepts(e.target.value)}
                  placeholder="e.g. Static Friction, Sliding Friction, Lubricants"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-600 block mb-1">
                  Learning Outcomes (one per line)
                </label>
                <textarea
                  value={newChapterOutcomes}
                  onChange={(e) => setNewChapterOutcomes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Differentiate static vs rolling friction experimentally"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-600 block mb-1">
                    Textbook Pages
                  </label>
                  <input
                    type="text"
                    value={newChapterPages}
                    onChange={(e) => setNewChapterPages(e.target.value)}
                    placeholder="Pages 146–158"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">
                    Inquiry Hook
                  </label>
                  <input
                    type="text"
                    value={newChapterHook}
                    onChange={(e) => setNewChapterHook(e.target.value)}
                    placeholder="If friction disappeared for 10s..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddChapter}
                disabled={!newChapterTitle.trim()}
                className="px-4 py-2 font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg disabled:opacity-50"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Define New Unit */}
      {isCreatingUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Define New Unit
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingUnit(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Unit Number *
                  </label>
                  <input
                    type="number"
                    value={editUnitNumber}
                    onChange={(e) => setEditUnitNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Unit Title *
                  </label>
                  <input
                    type="text"
                    value={editUnitTitle}
                    onChange={(e) => setEditUnitTitle(e.target.value)}
                    placeholder="e.g. Ecology & Biological Interactions"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Overarching Priority Focus
                </label>
                <textarea
                  value={editPriorityFocus}
                  onChange={(e) => setEditPriorityFocus(e.target.value)}
                  rows={2}
                  placeholder="e.g. Field observations in schoolyard before textbook definitions; low-stakes bilingual dialogue."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Essential Question
                  </label>
                  <input
                    type="text"
                    value={editEssentialQuestion}
                    onChange={(e) => setEditEssentialQuestion(e.target.value)}
                    placeholder="e.g. How does biodiversity protect community survival?"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Estimated Class Periods
                  </label>
                  <input
                    type="number"
                    value={editEstimatedPeriods}
                    onChange={(e) => setEditEstimatedPeriods(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Initial Competencies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Map food webs, Quantify trophic energy loss"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setEditCompetencies(e.target.value.split(',').map((c) => c.trim()).filter(Boolean));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Initial Unit Values (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Environmental Stewardship, Scientific Humility"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setEditValues(e.target.value.split(',').map((v) => v.trim()).filter(Boolean));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingUnit(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUnit}
                disabled={!editUnitTitle.trim()}
                className="px-4 py-2 font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg disabled:opacity-50"
              >
                Create Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
