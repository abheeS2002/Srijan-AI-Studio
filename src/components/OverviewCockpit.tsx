import React from 'react';
import {
  Compass,
  BookOpen,
  Users,
  BrainCircuit,
  Sparkles,
  RotateCcw,
  ArrowRight,
  School,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import {
  TeacherPhilosophyProfile,
  ClassroomProfile,
  LearnerProfile,
  MemoryItem,
  ActiveTab,
  EducationalDesignOutput,
  PostLessonReflection,
  ClassroomSection,
  SyllabusChapter,
  SyllabusUnit,
} from '../types';

interface OverviewCockpitProps {
  philosophy: TeacherPhilosophyProfile;
  classroom: ClassroomProfile;
  learners: LearnerProfile;
  memoryItems: MemoryItem[];
  savedDesigns: EducationalDesignOutput[];
  reflections: PostLessonReflection[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenOnboarding: () => void;
  activeClassroom?: ClassroomSection;
  onOpenClassroomSwitcher?: () => void;
  onLaunchCoDesignWithChapter?: (chapter: SyllabusChapter, unit: SyllabusUnit) => void;
}

export const OverviewCockpit: React.FC<OverviewCockpitProps> = ({
  philosophy,
  classroom,
  learners,
  memoryItems,
  savedDesigns,
  reflections,
  setActiveTab,
  onOpenOnboarding,
  activeClassroom,
  onOpenClassroomSwitcher,
  onLaunchCoDesignWithChapter,
}) => {
  const pendingInferences = (memoryItems || []).filter(
    (m) => m.tier === 'srijan_inference' && m.status === 'pending_approval'
  );

  const activeDesign = (savedDesigns && savedDesigns[0]) || null;
  const latestReflection = (reflections && reflections[0]) || null;

  // Find next unstarted or planning chapter in syllabus
  let nextChapterToPlan: { chapter: SyllabusChapter; unit: SyllabusUnit } | null = null;
  if (activeClassroom?.syllabus?.units) {
    for (const unit of (activeClassroom.syllabus.units || [])) {
      const found = (unit.chapters || []).find((c) => c.status === 'not_started' || c.status === 'planning');
      if (found) {
        nextChapterToPlan = { chapter: found, unit };
        break;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Bento Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Srijan Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, {philosophy.teacherName}. Srijan is calibrated to your Grade {classroom.gradeLevel} {classroom.subject} context.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('memory')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span>View Memory</span>
            {pendingInferences.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>New Design</span>
          </button>
        </div>
      </header>

      {/* Pending Inference Review Alert if exists */}
      {pendingInferences.length > 0 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                <span>{pendingInferences.length} Pedagogical Hypothesis Awaiting Teacher Validation</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded-full bg-indigo-200/70 text-indigo-900">
                  Review
                </span>
              </div>
              <p className="text-xs text-indigo-900 mt-1 italic">
                "{pendingInferences[0].text}"
              </p>
              <span className="text-[11px] text-indigo-700">
                Srijan never turns an inference into permanent knowledge without your explicit approval.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('memory')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 transition-colors"
          >
            <span>Review Hypothesis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bento 1 (8 cols): Active Design Intent */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Active Design Intent
            </h2>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase rounded-full tracking-wider">
              {activeDesign ? activeDesign.designType.replace(/_/g, ' ') : 'In Progress'}
            </span>
          </div>

          <div className="flex-1 border-2 border-dashed border-slate-200/80 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/50">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 shadow-2xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {activeDesign ? activeDesign.title : (activeClassroom ? `${activeClassroom.name} Curriculum` : `Grade ${classroom.gradeLevel} ${classroom.subject} Unit`)}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mb-4 leading-relaxed">
              {activeDesign
                ? activeDesign.summary
                : (activeClassroom?.syllabus.textbookTitle
                    ? `Prescribed textbook: "${activeClassroom.syllabus.textbookTitle}". Calibrated to ${classroom.classSize} students in narrow rows.`
                    : 'Co-design lesson arcs that respect your pedagogical stance, classroom seating geometry, and diagnostic pacing.')}
            </p>

            {nextChapterToPlan && (
              <div className="mb-5 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-left max-w-md w-full">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                  Next Prescribed Chapter in Syllabus:
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  Chapter {nextChapterToPlan.chapter.chapterNumber}: {nextChapterToPlan.chapter.title}
                </div>
                {nextChapterToPlan.chapter.textbookPages && (
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Textbook: {nextChapterToPlan.chapter.textbookPages}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {activeClassroom ? activeClassroom.name : `Grade ${classroom.gradeLevel} ${classroom.subject}`}
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {classroom.classSize} Learners
              </span>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                {activeClassroom ? `${activeClassroom.syllabus.units.length} Units In Syllabus` : 'Contextual Reasoning On'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {nextChapterToPlan && onLaunchCoDesignWithChapter ? (
                <button
                  onClick={() => onLaunchCoDesignWithChapter(nextChapterToPlan!.chapter, nextChapterToPlan!.unit)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Co-Design Chapter {nextChapterToPlan.chapter.chapterNumber}</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('design')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>{activeDesign ? 'Continue Co-Designing' : 'Start Co-Design'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setActiveTab('syllabus')}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Textbooks & Syllabus</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bento 2 (4 cols): Teacher Philosophy */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Teacher Philosophy
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs sm:text-sm text-emerald-950 font-medium italic leading-relaxed">
                  "{philosophy.roleOfTeacher}"
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Core Principles
                </h4>
                <ul className="text-xs text-slate-600 space-y-2">
                  {philosophy.coreValues.slice(0, 3).map((val, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">Calibrated to your voice</span>
            <button
              onClick={() => setActiveTab('philosophy')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bento 3 (4 cols): Classroom Context */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-500 rounded-full"></span>
              Classroom Context
            </h2>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Grade {classroom.gradeLevel} • Room {classroom.subject}
                </h3>
                <p className="text-xs text-slate-500">
                  {classroom.classSize} Learners | {classroom.periodLengthMinutes} Min Period
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  Layout & Tech
                </div>
                <div className="text-xs font-medium text-slate-800 line-clamp-1 mt-0.5">
                  {classroom.roomLayout.split(',')[0]}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  Language Reality
                </div>
                <div className="text-xs font-medium text-slate-800 line-clamp-1 mt-0.5">
                  {classroom.languageContext.split(';')[0]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">Physical realities verified</span>
            <button
              onClick={() => setActiveTab('classroom')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Update Constraints
            </button>
          </div>
        </div>

        {/* Bento 4 (4 cols): Reasoning Snapshot (Deep Indigo Card) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-4 bg-indigo-400 rounded-full"></span>
              Reasoning Snapshot
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90 mb-4">
              {activeDesign?.reasoningMatrix
                ? `"${activeDesign.reasoningMatrix.pedagogicalRationale}"`
                : '"I recommend low-movement partner investigations because narrow bench rows restrict circulation. This aligns with your belief that student inquiry drives understanding without room chaos."'}
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => setActiveTab('design')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-white"
            >
              <span>Examine Reasoning Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glow backdrop */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Bento 5 (4 cols): Latest Reflection */}
        <div className="col-span-12 md:col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-4 bg-purple-500 rounded-full"></span>
                Latest Reflection
              </h2>
              {latestReflection && (
                <span className="text-[10px] font-mono text-slate-400">
                  {latestReflection.date}
                </span>
              )}
            </div>

            {latestReflection ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-900">Observed:</strong> {latestReflection.whatActuallyHappened.slice(0, 110)}...
                </p>
                <div className="text-xs text-slate-700 italic border-l-2 border-amber-400 pl-3 py-1 bg-amber-50/40 rounded-r-lg">
                  <strong>Reality:</strong> {latestReflection.unforeseenFrictions || 'Pacing required adaptation in final phase.'}
                </div>
                {latestReflection.celebrations && (
                  <p className="text-emerald-700 text-xs font-medium line-clamp-1">
                    🎉 {latestReflection.celebrations}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 italic">
                No classroom reflections recorded yet. Complete a lesson to analyze intention vs. reality.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {latestReflection ? 'Insight: Balance discussion pacing' : 'Ready for debrief'}
            </span>
            <button
              onClick={() => setActiveTab('reflection')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Debrief
            </button>
          </div>
        </div>

        {/* Bento 6 (12 cols): The Srijan Core Loop */}
        <div className="col-span-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-slate-400 rounded-full"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                The Srijan Core Loop
              </span>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>How Srijan works</span>
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { stage: '1. Understand Teacher', tab: 'philosophy', desc: 'Pedagogical axioms' },
              { stage: '2. Understand Room', tab: 'classroom', desc: 'Space & language' },
              { stage: '3. Clarify Intent', tab: 'design', desc: 'Target objectives' },
              { stage: '4. Reason Together', tab: 'design', desc: 'Trade-off matrix' },
              { stage: '5. Design & Adapt', tab: 'design', desc: 'Phased artifacts' },
              { stage: '6. Implement', tab: 'reflection', desc: 'Live teaching' },
              { stage: '7. Reflect', tab: 'reflection', desc: 'Dissonance study' },
              { stage: '8. Update Memory', tab: 'memory', desc: 'Compound context' },
            ].map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(step.tab as ActiveTab)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 text-left transition-all group"
              >
                <div className="text-[10px] font-mono font-bold text-indigo-600 mb-1 group-hover:text-indigo-700">
                  Step {i + 1}
                </div>
                <div className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-indigo-950">
                  {step.stage.split('. ')[1]}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {step.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
