import React, { useState } from 'react';
import {
  X,
  Plus,
  School,
  BookOpen,
  Users,
  Check,
  Clock,
  Edit3,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
  Laptop,
} from 'lucide-react';
import { ClassroomSection, ClassroomSyllabus } from '../types';

interface ClassroomSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  classrooms: ClassroomSection[];
  activeClassroomId: string;
  onSelectClassroom: (id: string) => void;
  onCreateClassroom: (newClassroom: ClassroomSection) => void;
  onUpdateClassroom: (updatedClassroom: ClassroomSection) => void;
  onDeleteClassroom: (id: string) => void;
  initialEditingClassroomId?: string | null;
}

export const ClassroomSwitcherModal: React.FC<ClassroomSwitcherModalProps> = ({
  isOpen,
  onClose,
  classrooms,
  activeClassroomId,
  onSelectClassroom,
  onCreateClassroom,
  onUpdateClassroom,
  onDeleteClassroom,
  initialEditingClassroomId,
}) => {
  type ModalMode = 'list' | 'create' | 'edit';
  const [mode, setMode] = useState<ModalMode>(initialEditingClassroomId ? 'edit' : 'list');
  const [editingClassroomId, setEditingClassroomId] = useState<string | null>(initialEditingClassroomId || null);
  const [confirmDeleteClassroom, setConfirmDeleteClassroom] = useState<ClassroomSection | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // New classroom form state
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 8');
  const [sectionName, setSectionName] = useState('Section A');
  const [subject, setSubject] = useState('Science');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [classSize, setClassSize] = useState<number>(35);
  const [periodLengthMinutes, setPeriodLengthMinutes] = useState<number>(45);
  const [techAccess, setTechAccess] = useState<'none' | 'projector_only' | 'shared_tablets' | 'one_to_one'>('projector_only');
  const [languageContext, setLanguageContext] = useState('Bilingual instruction; English textbook with regional language scaffolding');
  const [textbookTitle, setTextbookTitle] = useState('');
  const [curriculumBoard, setCurriculumBoard] = useState('NCERT / State Composite');

  // Edit classroom form state
  const [editName, setEditName] = useState('');
  const [editGradeLevel, setEditGradeLevel] = useState('Grade 8');
  const [editSectionName, setEditSectionName] = useState('Section A');
  const [editSubject, setEditSubject] = useState('Science');
  const [editAcademicYear, setEditAcademicYear] = useState('2025-2026');
  const [editClassSize, setEditClassSize] = useState<number>(35);
  const [editPeriodLengthMinutes, setEditPeriodLengthMinutes] = useState<number>(45);
  const [editTechAccess, setEditTechAccess] = useState<'none' | 'projector_only' | 'shared_tablets' | 'one_to_one'>('projector_only');
  const [editLanguageContext, setEditLanguageContext] = useState('');
  const [editTextbookTitle, setEditTextbookTitle] = useState('');
  const [editCurriculumBoard, setEditCurriculumBoard] = useState('NCERT / State Composite');
  const [editRoomLayout, setEditRoomLayout] = useState('Traditional bench rows facing chalkboard');

  if (!isOpen) return null;

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleStartCreate = () => {
    setName('');
    setGradeLevel('Grade 8');
    setSectionName('Section A');
    setSubject('Science');
    setAcademicYear('2025-2026');
    setClassSize(35);
    setPeriodLengthMinutes(45);
    setTechAccess('projector_only');
    setLanguageContext('Bilingual instruction; English textbook with regional language scaffolding');
    setTextbookTitle('');
    setCurriculumBoard('NCERT / State Composite');
    setMode('create');
  };

  const handleStartEdit = (cls: ClassroomSection) => {
    setEditingClassroomId(cls.id);
    setEditName(cls.name);
    setEditGradeLevel(cls.gradeLevel);
    setEditSectionName(cls.sectionName);
    setEditSubject(cls.subject);
    setEditAcademicYear(cls.academicYear || '2025-2026');
    setEditClassSize(cls.classroom.classSize);
    setEditPeriodLengthMinutes(cls.classroom.periodLengthMinutes);
    setEditTechAccess(cls.classroom.techAccess);
    setEditLanguageContext(cls.classroom.languageContext);
    setEditTextbookTitle(cls.syllabus?.textbookTitle || '');
    setEditCurriculumBoard(cls.syllabus?.curriculumBoard || 'NCERT / State Composite');
    setEditRoomLayout(cls.classroom.roomLayout || 'Traditional bench rows facing chalkboard');
    setMode('edit');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || `${gradeLevel} ${subject} - ${sectionName}`;

    const newSyllabus: ClassroomSyllabus = {
      id: `syl-${Date.now()}`,
      classroomId: `class-${Date.now()}`,
      title: `${cleanName} Curriculum`,
      subject,
      gradeLevel,
      curriculumBoard,
      textbookTitle: textbookTitle.trim() || `${gradeLevel} ${subject} Standard Coursebook`,
      academicYear,
      uploadedFiles: [],
      units: [
        {
          id: `unit-${Date.now()}-1`,
          unitNumber: 1,
          title: `Unit 1: Core Principles of ${subject}`,
          estimatedPeriods: 18,
          keyCompetencies: [`Foundational conceptual understanding in ${subject}`, 'Inquiry and problem-solving'],
          chapters: [
            {
              id: `ch-${Date.now()}-1`,
              chapterNumber: 1,
              title: `Introduction to ${subject} Concepts`,
              keyConcepts: ['Key definitions', 'Observational inquiry', 'Everyday phenomena'],
              learningOutcomes: [
                `Students will explore foundational themes of ${subject}.`,
                'Students will connect classroom concepts to real-life applications.',
              ],
              textbookPages: 'Pages 1–15',
              suggestedInquiryHook: `Why does this ${subject.toLowerCase()} phenomenon matter in our community?`,
              status: 'not_started',
              linkedDesignCount: 0,
            },
          ],
        },
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    const newClassroom: ClassroomSection = {
      id: `class-${Date.now()}`,
      name: cleanName,
      gradeLevel,
      sectionName,
      subject,
      academicYear,
      colorTheme: 'indigo',
      classroom: {
        schoolName: 'Govt. Model Senior Secondary School',
        gradeLevel,
        subject,
        classSize,
        periodLengthMinutes,
        roomLayout: 'Traditional bench rows facing chalkboard',
        techAccess,
        techAccessDescription:
          techAccess === 'none'
            ? 'Chalkboard only'
            : techAccess === 'projector_only'
            ? 'Single teacher projector'
            : techAccess === 'shared_tablets'
            ? 'Shared tablets in pairs'
            : '1:1 Student digital devices',
        languageContext,
        dailyScheduleContext: 'Standard morning academic block',
      },
      learners: {
        priorKnowledgeGaps: ['Foundational prerequisite terminology', 'Visual diagram interpretation'],
        readingAndLanguageDiversity: 'Mixed reading levels; visual aids and bilingual scaffolding recommended',
        energyAndFocusDynamics: 'Energetic, eager to participate in small-group discussions and interactive challenges',
        highInterestHooks: ['Real-world community scenarios, tactile puzzles, sports analogies'],
        specificAccommodations: ['Front-row seating for students with visual needs'],
        socioEmotionalClimate: 'Warm and supportive learning atmosphere',
      },
      syllabus: newSyllabus,
    };

    onCreateClassroom(newClassroom);
    setMode('list');
    showToast(`Created new classroom section "${cleanName}"`);
    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClassroom = classrooms.find((c) => c.id === editingClassroomId);
    if (!targetClassroom) return;

    const cleanName = editName.trim() || `${editGradeLevel} ${editSubject} - ${editSectionName}`;

    const updatedSection: ClassroomSection = {
      ...targetClassroom,
      name: cleanName,
      gradeLevel: editGradeLevel,
      sectionName: editSectionName,
      subject: editSubject,
      academicYear: editAcademicYear,
      classroom: {
        ...targetClassroom.classroom,
        gradeLevel: editGradeLevel,
        subject: editSubject,
        classSize: editClassSize,
        periodLengthMinutes: editPeriodLengthMinutes,
        techAccess: editTechAccess,
        techAccessDescription:
          editTechAccess === 'none'
            ? 'Chalkboard only'
            : editTechAccess === 'projector_only'
            ? 'Single teacher projector'
            : editTechAccess === 'shared_tablets'
            ? 'Shared tablets in pairs'
            : '1:1 Student digital devices',
        languageContext: editLanguageContext,
        roomLayout: editRoomLayout,
      },
      syllabus: {
        ...targetClassroom.syllabus,
        title: `${cleanName} Curriculum`,
        subject: editSubject,
        gradeLevel: editGradeLevel,
        curriculumBoard: editCurriculumBoard,
        textbookTitle: editTextbookTitle.trim() || targetClassroom.syllabus?.textbookTitle || `${editGradeLevel} ${editSubject} Coursebook`,
        academicYear: editAcademicYear,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };

    onUpdateClassroom(updatedSection);
    setMode('list');
    setEditingClassroomId(null);
    showToast(`Updated classroom "${cleanName}" successfully.`);
  };

  const handleDeleteRequest = (e: React.MouseEvent, cls: ClassroomSection) => {
    e.stopPropagation();
    if (classrooms.length <= 1) {
      showToast('Cannot delete the only classroom section. Create another section before deleting this one.', 'warning');
      return;
    }
    setConfirmDeleteClassroom(cls);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteClassroom) return;
    const deletedName = confirmDeleteClassroom.name;
    onDeleteClassroom(confirmDeleteClassroom.id);
    setConfirmDeleteClassroom(null);
    showToast(`Classroom "${deletedName}" was deleted.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {mode === 'create'
                  ? 'Add New Classroom / Subject'
                  : mode === 'edit'
                  ? 'Edit Classroom Section'
                  : 'Classroom & Subject Sections'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'create'
                  ? 'Configure a dedicated space with its own syllabus, textbook, and learner realities.'
                  : mode === 'edit'
                  ? 'Update classroom details, class size, timetable limits, and prescribed textbook info.'
                  : 'Switch between your teaching classes, edit details, or remove inactive sections.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode !== 'list' && (
              <button
                type="button"
                onClick={() => {
                  setMode('list');
                  setEditingClassroomId(null);
                }}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to List</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackToast && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center gap-2 font-medium border-b ${
              feedbackToast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            {feedbackToast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {mode === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Enrolled Classroom Sections ({classrooms.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class or Subject</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classrooms.map((cls) => {
                  const isActive = cls.id === activeClassroomId;
                  const units = cls.syllabus?.units || [];
                  const totalUnits = units.length;
                  const totalChapters = units.reduce(
                    (acc, u) => acc + (u.chapters?.length || 0),
                    0
                  );
                  const completedChapters = units.reduce(
                    (acc, u) =>
                      acc + (u.chapters ? u.chapters.filter((c) => c.status === 'completed').length : 0),
                    0
                  );

                  return (
                    <div
                      key={cls.id}
                      onClick={() => {
                        onSelectClassroom(cls.id);
                        onClose();
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer text-left space-y-3 relative group ${
                        isActive
                          ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-600/30 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top status & Action buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
                            {cls.gradeLevel}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{cls.sectionName}</span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>

                        {/* Edit & Delete Actions */}
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cls)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                            title={`Edit ${cls.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteRequest(e, cls)}
                            disabled={classrooms.length <= 1}
                            className={`p-1.5 rounded-lg transition-colors ${
                              classrooms.length <= 1
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={
                              classrooms.length <= 1
                                ? 'At least one classroom is required'
                                : `Delete ${cls.name}`
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-slate-900 leading-tight">
                          {cls.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-indigo-700 font-semibold">{cls.subject}</p>
                          {cls.syllabus?.curriculumBoard && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {cls.syllabus.curriculumBoard}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.classroom.classSize} Students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.classroom.periodLengthMinutes} mins</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 truncate text-[11px] text-slate-500">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {cls.syllabus?.textbookTitle || 'Custom Coursebook'}
                          </span>
                        </div>
                      </div>

                      {/* Syllabus Progress */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>Syllabus Progress</span>
                          <span className="font-semibold text-slate-700">
                            {completedChapters}/{totalChapters} Chapters ({totalUnits} Units)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{
                              width: totalChapters > 0 ? `${(completedChapters / totalChapters) * 100}%` : '0%',
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span className="hover:underline text-indigo-600 font-semibold">
                          {isActive ? 'Currently Active' : 'Click card to switch'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cls.academicYear}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create Form */}
          {mode === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Classroom Section Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 9 Physics - Morning Section"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  >
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Section Name / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section B, Room 204"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science, Mathematics, Physics, English"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Curriculum Board / Framework
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT, CBSE, State Board, Cambridge"
                    value={curriculumBoard}
                    onChange={(e) => setCurriculumBoard(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Primary Prescribed Textbook Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT Science Class 9 or Oxford Math"
                    value={textbookTitle}
                    onChange={(e) => setTextbookTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Class Size & Period (Minutes)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={classSize}
                      onChange={(e) => setClassSize(Number(e.target.value))}
                      placeholder="Students"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                    />
                    <input
                      type="number"
                      min={20}
                      max={120}
                      value={periodLengthMinutes}
                      onChange={(e) => setPeriodLengthMinutes(Number(e.target.value))}
                      placeholder="Minutes"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Classroom Technology
                  </label>
                  <select
                    value={techAccess}
                    onChange={(e: any) => setTechAccess(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="none">No screens (Chalkboard only)</option>
                    <option value="projector_only">Single Teacher Projector</option>
                    <option value="shared_tablets">Shared Student Tablets</option>
                    <option value="one_to_one">1:1 Student Devices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Language Instruction Context
                  </label>
                  <input
                    type="text"
                    value={languageContext}
                    onChange={(e) => setLanguageContext(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Classroom Section</span>
                </button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {mode === 'edit' && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Classroom Section Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 8 Science - Section A"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={editGradeLevel}
                    onChange={(e) => setEditGradeLevel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  >
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Section Name / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section A, Room 101"
                    value={editSectionName}
                    onChange={(e) => setEditSectionName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science, Mathematics, English"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2025-2026"
                    value={editAcademicYear}
                    onChange={(e) => setEditAcademicYear(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Curriculum Board / Framework
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT, CBSE, State Board"
                    value={editCurriculumBoard}
                    onChange={(e) => setEditCurriculumBoard(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Prescribed Textbook Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NCERT Science Class 8 Coursebook"
                    value={editTextbookTitle}
                    onChange={(e) => setEditTextbookTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Class Size & Period (Minutes)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={editClassSize}
                      onChange={(e) => setEditClassSize(Number(e.target.value))}
                      placeholder="Students"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                    />
                    <input
                      type="number"
                      min={20}
                      max={120}
                      value={editPeriodLengthMinutes}
                      onChange={(e) => setEditPeriodLengthMinutes(Number(e.target.value))}
                      placeholder="Minutes"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Classroom Technology
                  </label>
                  <select
                    value={editTechAccess}
                    onChange={(e: any) => setEditTechAccess(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="none">No screens (Chalkboard only)</option>
                    <option value="projector_only">Single Teacher Projector</option>
                    <option value="shared_tablets">Shared Student Tablets</option>
                    <option value="one_to_one">1:1 Student Devices</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Language Instruction Context
                  </label>
                  <input
                    type="text"
                    value={editLanguageContext}
                    onChange={(e) => setEditLanguageContext(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Room Seating Layout
                  </label>
                  <input
                    type="text"
                    value={editRoomLayout}
                    onChange={(e) => setEditRoomLayout(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('list');
                    setEditingClassroomId(null);
                  }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Classroom Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {confirmDeleteClassroom && (
          <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Delete Classroom Section?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900">{confirmDeleteClassroom.name}</strong>?
                  This will permanently remove its syllabus tracking, physical room boundaries, and learner profiles.
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div><strong>Grade & Subject:</strong> {confirmDeleteClassroom.gradeLevel} {confirmDeleteClassroom.subject}</div>
                <div><strong>Textbook:</strong> {confirmDeleteClassroom.syllabus?.textbookTitle || 'Coursebook'}</div>
                <div><strong>Curriculum:</strong> {confirmDeleteClassroom.syllabus?.units?.length || 0} Units</div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteClassroom(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Keep Section
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Section</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
