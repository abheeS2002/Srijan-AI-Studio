import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Heart,
  Scale,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
} from 'lucide-react';
import {
  PostLessonReflection,
  EducationalDesignOutput,
  TeacherPhilosophyProfile,
  MemoryItem,
} from '../types';

interface ReflectionStudioProps {
  reflections: PostLessonReflection[];
  savedDesigns: EducationalDesignOutput[];
  philosophy: TeacherPhilosophyProfile;
  memoryItems: MemoryItem[];
  onAddReflection: (ref: PostLessonReflection) => void;
  onAddMemoryItem: (item: Omit<MemoryItem, 'id' | 'dateAdded'>) => void;
}

export const ReflectionStudio: React.FC<ReflectionStudioProps> = ({
  reflections,
  savedDesigns,
  philosophy,
  memoryItems,
  onAddReflection,
  onAddMemoryItem,
}) => {
  const [selectedDesignId, setSelectedDesignId] = useState<string>(
    savedDesigns.length > 0 ? savedDesigns[0].id : ''
  );
  const [lessonTitle, setLessonTitle] = useState(
    savedDesigns.length > 0 ? savedDesigns[0].title : 'Today’s Science Lesson'
  );
  const [whatActuallyHappened, setWhatActuallyHappened] = useState('');
  const [engagementScore, setEngagementScore] = useState<number>(4);
  const [pacingOutcome, setPacingOutcome] = useState<
    'too_fast' | 'on_track' | 'ran_out_of_time' | 'dragged'
  >('ran_out_of_time');
  const [unforeseenFrictions, setUnforeseenFrictions] = useState('');
  const [celebrations, setCelebrations] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<PostLessonReflection | null>(
    reflections.length > 0 ? reflections[0] : null
  );
  const [memoryAppliedToast, setMemoryAppliedToast] = useState(false);

  const handleSelectDesignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDesignId(id);
    const found = savedDesigns.find((d) => d.id === id);
    if (found) {
      setLessonTitle(found.title);
    }
  };

  const handleRunReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatActuallyHappened.trim()) return;

    setIsAnalyzing(true);
    const chosenDesign = savedDesigns.find((d) => d.id === selectedDesignId);

    try {
      const res = await fetch('/api/reflect-dissonance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonOrPlanTitle: lessonTitle,
          intendedDesign: chosenDesign || { title: lessonTitle },
          intendedPhilosophy: philosophy,
          actualDebrief: {
            whatActuallyHappened,
            engagementScore,
            pacingOutcome,
            unforeseenFrictions,
            celebrations,
          },
          memory: memoryItems,
        }),
      });

      const data = await res.json();
      const newReflection: PostLessonReflection = {
        id: `ref-${Date.now()}`,
        designId: selectedDesignId || undefined,
        lessonTitle,
        date: new Date().toISOString().split('T')[0],
        whatActuallyHappened,
        studentEngagementScore: engagementScore,
        timePacingOutcome: pacingOutcome,
        unforeseenFrictions,
        celebrations,
        intentionVsPracticeDissonance: data.reflectionAnalysis,
      };

      onAddReflection(newReflection);
      setActiveAnalysis(newReflection);
      // Reset input form
      setWhatActuallyHappened('');
      setUnforeseenFrictions('');
      setCelebrations('');
    } catch (err) {
      console.error('Failed to run reflection analysis', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyMemoryRefinement = () => {
    if (!activeAnalysis?.intentionVsPracticeDissonance?.suggestedMemoryRefinement) return;
    const ref = activeAnalysis.intentionVsPracticeDissonance.suggestedMemoryRefinement;

    onAddMemoryItem({
      tier: ref.tier || 'approved_inference',
      text: ref.proposedText,
      category: 'pedagogy',
      source: 'reflection_insight',
      status: 'active',
      notes: `Emerged from Intention vs Practice Reflection on "${activeAnalysis.lessonTitle}"`,
    });

    setMemoryAppliedToast(true);
    setTimeout(() => setMemoryAppliedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reflective Inquiry Studio
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono font-semibold">
              Intention vs. Practice
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Examine the fertile gap between what you intended and what transpired in the live classroom, updating Srijan's contextual understanding.
          </p>
        </div>
      </div>

      {memoryAppliedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Reflective insight integrated into Tier 2 Contextual Memory! Future co-designs will honor this lesson learned.</span>
        </div>
      )}

      {/* Two Column Layout: Debrief Form & Live Dissonance Analysis - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Post-Lesson Debrief Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-indigo-600 rounded-full"></span>
            <h2 className="text-base font-bold text-slate-900">
              3-Minute Lesson Debrief
            </h2>
          </div>

          <form
            onSubmit={handleRunReflection}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Link to Co-Designed Lesson (Optional)
              </label>
              <select
                value={selectedDesignId}
                onChange={handleSelectDesignChange}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              >
                <option value="">-- Freeform Lesson Title --</option>
                {savedDesigns.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.designType})
                  </option>
                ))}
              </select>
            </div>

            {!selectedDesignId && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Student Engagement
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEngagementScore(star)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        engagementScore >= star
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Time Pacing Outcome
                </label>
                <select
                  value={pacingOutcome}
                  onChange={(e: any) => setPacingOutcome(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                >
                  <option value="ran_out_of_time">Ran out of time</option>
                  <option value="on_track">On track & finished</option>
                  <option value="too_fast">Finished too fast</option>
                  <option value="dragged">Dragged / slow pace</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                What actually happened in the room?
              </label>
              <textarea
                required
                rows={3}
                value={whatActuallyHappened}
                onChange={(e) => setWhatActuallyHappened(e.target.value)}
                placeholder="Describe the real flow: student reactions, unexpected tangents, noise level, or where you had to deviate..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Unforeseen Frictions or Sticking Points
              </label>
              <textarea
                rows={2}
                value={unforeseenFrictions}
                onChange={(e) => setUnforeseenFrictions(e.target.value)}
                placeholder="e.g. 4 students argued about air conduction; missed the exit slip..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Student Celebration or Bright Spot
              </label>
              <textarea
                rows={2}
                value={celebrations}
                onChange={(e) => setCelebrations(e.target.value)}
                placeholder="e.g. Rohan explained particle vibration in Hindi; class cheered..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{isAnalyzing ? 'Analyzing Dissonance...' : 'Analyze Intention vs. Practice'}</span>
            </button>
          </form>

          {/* Past Reflection History Drawer */}
          {reflections.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Recent Reflection Logs
              </h3>
              <div className="space-y-1.5">
                {reflections.map((ref) => (
                  <button
                    key={ref.id}
                    onClick={() => setActiveAnalysis(ref)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      activeAnalysis?.id === ref.id
                        ? 'bg-indigo-50/70 border-indigo-600 font-semibold text-indigo-950 ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{ref.lessonTitle}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ref.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Intention vs Practice Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-amber-500 rounded-full"></span>
            <h2 className="text-base font-bold text-slate-900">
              Intention vs. Practice Dissonance Analysis
            </h2>
          </div>

          {activeAnalysis ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              {/* Header Info */}
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{activeAnalysis.date}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500">Pacing:</span>
                    <span className="font-mono font-semibold text-slate-800 capitalize">
                      {activeAnalysis.timePacingOutcome.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeAnalysis.lessonTitle}
                </h3>
              </div>

              {/* What actually happened snapshot */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 font-mono text-[11px] uppercase">
                  Classroom Reality Observed:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">
                  {activeAnalysis.whatActuallyHappened}
                </p>
                {activeAnalysis.celebrations && (
                  <div className="mt-2 text-emerald-800 flex items-start gap-1.5 pt-1.5 border-t border-slate-200">
                    <Heart className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span>
                      <strong className="font-bold">Celebration: </strong>
                      {activeAnalysis.celebrations}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Alignments */}
              {activeAnalysis.intentionVsPracticeDissonance?.alignments && (
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-emerald-800 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pedagogical Alignments (Honoring Stated Values)</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 pl-1">
                    {activeAnalysis.intentionVsPracticeDissonance.alignments.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dissonances & Root Drivers */}
              {activeAnalysis.intentionVsPracticeDissonance?.dissonances && (
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase text-amber-900 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Identified Pedagogical Dissonances</span>
                  </div>

                  <div className="space-y-3">
                    {activeAnalysis.intentionVsPracticeDissonance.dissonances.map((d, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="font-bold text-slate-900 block mb-0.5">
                              Intended Principle:
                            </span>
                            <p className="text-slate-700">{d.intendedPrinciple}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block mb-0.5">
                              Live Practice Reality:
                            </span>
                            <p className="text-slate-700">{d.actualClassroomReality}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 text-slate-800">
                          <span className="font-bold text-amber-950">Underlying Driver: </span>
                          <span>{d.underlyingDriver}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-amber-200 text-slate-800">
                          <span className="font-bold text-emerald-800 font-mono text-[11px] uppercase block mb-0.5">
                            Actionable Remedy Strategy:
                          </span>
                          <span>{d.remedyStrategy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Systemic Insights */}
              {activeAnalysis.intentionVsPracticeDissonance?.systemicInsights && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 font-mono text-[11px] uppercase block mb-1">
                    Systemic Structural Insight:
                  </span>
                  <p>{activeAnalysis.intentionVsPracticeDissonance.systemicInsights}</p>
                </div>
              )}

              {/* Suggested Memory Refinement with Quick Save */}
              {activeAnalysis.intentionVsPracticeDissonance?.suggestedMemoryRefinement && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                      Suggested Contextual Memory Update (Tier 2)
                    </span>
                    <p className="text-xs text-emerald-950 font-medium">
                      "{activeAnalysis.intentionVsPracticeDissonance.suggestedMemoryRefinement.proposedText}"
                    </p>
                  </div>
                  <button
                    onClick={handleApplyMemoryRefinement}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 self-start sm:self-auto transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save to Memory</span>
                  </button>
                </div>
              )}

              {/* Empowering Closing Note */}
              {activeAnalysis.intentionVsPracticeDissonance?.empoweringClosingNote && (
                <div className="text-xs italic text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  "{activeAnalysis.intentionVsPracticeDissonance.empoweringClosingNote}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
              <RotateCcw className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No active reflection selected.</p>
              <p className="text-slate-400 max-w-sm mx-auto">
                Fill out the 3-minute lesson debrief form on the left to analyze how today’s practice compared to your intended philosophy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
