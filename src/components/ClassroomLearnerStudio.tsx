import React, { useState } from 'react';
import {
  Users,
  Building,
  Clock,
  Layout,
  Laptop,
  Languages,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  School,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import { ClassroomProfile, LearnerProfile, ClassroomSection } from '../types';

interface ClassroomLearnerStudioProps {
  classroom: ClassroomProfile;
  learners: LearnerProfile;
  onUpdateClassroom: (updated: ClassroomProfile) => void;
  onUpdateLearners: (updated: LearnerProfile) => void;
  activeClassroom?: ClassroomSection;
  onOpenClassroomSwitcher?: () => void;
  onEditClassroomSection?: (classroomId: string) => void;
  onDeleteClassroomSection?: (classroomId: string) => void;
  canDeleteClassroom?: boolean;
}

export const ClassroomLearnerStudio: React.FC<ClassroomLearnerStudioProps> = ({
  classroom,
  learners,
  onUpdateClassroom,
  onUpdateLearners,
  activeClassroom,
  onOpenClassroomSwitcher,
  onEditClassroomSection,
  onDeleteClassroomSection,
  canDeleteClassroom,
}) => {
  const [classState, setClassState] = useState<ClassroomProfile>(classroom);
  const [learnerState, setLearnerState] = useState<LearnerProfile>(learners);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state if active classroom changes
  React.useEffect(() => {
    setClassState(classroom);
    setLearnerState(learners);
  }, [activeClassroom?.id]);

  const [newGapInput, setNewGapInput] = useState('');
  const [newHookInput, setNewHookInput] = useState('');
  const [newAccommInput, setNewAccommInput] = useState('');

  const handleSave = () => {
    onUpdateClassroom(classState);
    onUpdateLearners(learnerState);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleAddGap = () => {
    if (!newGapInput.trim()) return;
    setLearnerState({
      ...learnerState,
      priorKnowledgeGaps: [...learnerState.priorKnowledgeGaps, newGapInput.trim()],
    });
    setNewGapInput('');
  };

  const handleRemoveGap = (index: number) => {
    setLearnerState({
      ...learnerState,
      priorKnowledgeGaps: learnerState.priorKnowledgeGaps.filter((_, i) => i !== index),
    });
  };

  const handleAddHook = () => {
    if (!newHookInput.trim()) return;
    setLearnerState({
      ...learnerState,
      highInterestHooks: [...learnerState.highInterestHooks, newHookInput.trim()],
    });
    setNewHookInput('');
  };

  const handleRemoveHook = (index: number) => {
    setLearnerState({
      ...learnerState,
      highInterestHooks: learnerState.highInterestHooks.filter((_, i) => i !== index),
    });
  };

  const handleAddAccommodation = () => {
    if (!newAccommInput.trim()) return;
    setLearnerState({
      ...learnerState,
      specificAccommodations: [...learnerState.specificAccommodations, newAccommInput.trim()],
    });
    setNewAccommInput('');
  };

  const handleRemoveAccommodation = (index: number) => {
    setLearnerState({
      ...learnerState,
      specificAccommodations: learnerState.specificAccommodations.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Classroom Context & Learner Profiles
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              Ground-Truth Realities
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Physical room boundaries, language distributions, and cognitive profiles that anchor Srijan's educational recommendations in real classrooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeClassroom && (
            <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-xl p-0.5">
              {onOpenClassroomSwitcher && (
                <button
                  type="button"
                  onClick={onOpenClassroomSwitcher}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-semibold transition-colors"
                  title="Switch classroom section"
                >
                  <School className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="max-w-[180px] sm:max-w-[240px] truncate">{activeClassroom.name}</span>
                  <ChevronDown className="w-3 h-3 text-indigo-500" />
                </button>
              )}

              {onEditClassroomSection && (
                <button
                  type="button"
                  onClick={() => onEditClassroomSection(activeClassroom.id)}
                  className="p-1.5 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Edit section metadata (Grade, Subject, Textbook, Period Length)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              {onDeleteClassroomSection && canDeleteClassroom && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete this classroom section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Edit Context</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setClassState(classroom);
                  setLearnerState(learners);
                  setIsEditing(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Context</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal for active classroom */}
      {showDeleteConfirm && activeClassroom && onDeleteClassroomSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete "{activeClassroom.name}"?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this section? All linked syllabi, textbook configurations, and learner constraints will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteClassroomSection(activeClassroom.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSavedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Classroom and learner profiles updated. Educational reasoning will adapt to these constraints.</span>
        </div>
      )}

      {/* Grid: Classroom Realities & Learner Realities - Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Physical & Environmental Classroom Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-amber-500 rounded-full"></span>
            <h2 className="text-base font-bold text-slate-900">
              Classroom & Structural Profile
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Grade Level
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={classState.gradeLevel}
                    onChange={(e) => setClassState({ ...classState, gradeLevel: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900">{classState.gradeLevel}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Class Size
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={classState.classSize}
                    onChange={(e) =>
                      setClassState({ ...classState, classSize: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900">{classState.classSize} students</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Period Length
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={classState.periodLengthMinutes}
                    onChange={(e) =>
                      setClassState({
                        ...classState,
                        periodLengthMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900">
                    {classState.periodLengthMinutes} minutes
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Subject Focus
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={classState.subject}
                  onChange={(e) => setClassState({ ...classState, subject: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-800">{classState.subject}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Physical Room Layout & Constraints
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={classState.roomLayout}
                  onChange={(e) => setClassState({ ...classState, roomLayout: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">{classState.roomLayout}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Digital & Tech Access in Room
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={classState.techAccess}
                    onChange={(e: any) =>
                      setClassState({ ...classState, techAccess: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  >
                    <option value="none">No digital technology in room</option>
                    <option value="projector_only">Teacher Projector Only</option>
                    <option value="shared_tablets">Shared Tablets (1 per bench/group)</option>
                    <option value="one_to_one">1:1 Student Devices</option>
                  </select>
                  <input
                    type="text"
                    value={classState.techAccessDescription}
                    onChange={(e) =>
                      setClassState({ ...classState, techAccessDescription: e.target.value })
                    }
                    placeholder="Brief description of tech reality..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>
              ) : (
                <div className="text-xs text-slate-700">
                  <span className="font-semibold capitalize text-slate-900">
                    {classState.techAccess.replace(/_/g, ' ')}:
                  </span>{' '}
                  {classState.techAccessDescription}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Linguistic Medium & Home Language
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={classState.languageContext}
                  onChange={(e) => setClassState({ ...classState, languageContext: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">{classState.languageContext}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Daily Schedule & Timing Dynamics
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={classState.dailyScheduleContext}
                  onChange={(e) =>
                    setClassState({ ...classState, dailyScheduleContext: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <p className="text-xs text-slate-600">{classState.dailyScheduleContext}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Class-Level Learner Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-indigo-500 rounded-full"></span>
            <h2 className="text-base font-bold text-slate-900">
              Class-Level Learner Profile
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            {/* Prior Knowledge Gaps */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Common Prior Knowledge Gaps
                </label>
                <span className="text-[10px] font-mono text-slate-400">Diagnostic signals</span>
              </div>
              <div className="space-y-1.5">
                {learnerState.priorKnowledgeGaps.map((gap, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <span>{gap}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveGap(i)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newGapInput}
                    onChange={(e) => setNewGapInput(e.target.value)}
                    placeholder="Add conceptual gap..."
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                  <button
                    onClick={handleAddGap}
                    className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reading & Language Diversity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Reading & Language Spectrum
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={learnerState.readingAndLanguageDiversity}
                  onChange={(e) =>
                    setLearnerState({
                      ...learnerState,
                      readingAndLanguageDiversity: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {learnerState.readingAndLanguageDiversity}
                </p>
              )}
            </div>

            {/* Energy and Focus Dynamics */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Energy & Attention Dynamics
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={learnerState.energyAndFocusDynamics}
                  onChange={(e) =>
                    setLearnerState({
                      ...learnerState,
                      energyAndFocusDynamics: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {learnerState.energyAndFocusDynamics}
                </p>
              )}
            </div>

            {/* High-Interest Engagement Hooks */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  High-Interest Engagement Hooks
                </label>
                <span className="text-[10px] font-mono text-slate-400">Authentic anchors</span>
              </div>
              <div className="space-y-1.5">
                {learnerState.highInterestHooks.map((hook, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 font-medium"
                  >
                    <span>{hook}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveHook(i)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newHookInput}
                    onChange={(e) => setNewHookInput(e.target.value)}
                    placeholder="Add engagement hook (e.g. cricket, street cooking)..."
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                  <button
                    onClick={handleAddHook}
                    className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Specific Accommodations & Neurodivergent Supports */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Accommodations & Seating Needs
                </label>
                <span className="text-[10px] font-mono text-slate-400">Targeted care</span>
              </div>
              <div className="space-y-1.5">
                {learnerState.specificAccommodations.map((acc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <span>{acc}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveAccommodation(i)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newAccommInput}
                    onChange={(e) => setNewAccommInput(e.target.value)}
                    placeholder="Add accommodation (e.g. front row for low vision)..."
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                  <button
                    onClick={handleAddAccommodation}
                    className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
