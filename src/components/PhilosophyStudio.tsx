import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Quote,
  Plus,
  Trash2,
  HelpCircle,
  Save,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  TeacherPhilosophyProfile,
  PhilosophyDiscoveryQuestion,
  MemoryItem,
} from '../types';

interface PhilosophyStudioProps {
  philosophy: TeacherPhilosophyProfile;
  onUpdatePhilosophy: (updated: TeacherPhilosophyProfile) => void;
  discoveryQuestions: PhilosophyDiscoveryQuestion[];
  onAddMemoryItem: (item: Omit<MemoryItem, 'id' | 'dateAdded'>) => void;
}

export const PhilosophyStudio: React.FC<PhilosophyStudioProps> = ({
  philosophy,
  onUpdatePhilosophy,
  discoveryQuestions,
  onAddMemoryItem,
}) => {
  const [profile, setProfile] = useState<TeacherPhilosophyProfile>(philosophy);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscoveryWizard, setShowDiscoveryWizard] = useState(false);
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [wizardResponses, setWizardResponses] = useState<Record<string, { choice: string; reflection: string }>>({});
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedResult, setSynthesizedResult] = useState<any | null>(null);
  const [newValueInput, setNewValueInput] = useState('');
  const [newQuoteInput, setNewQuoteInput] = useState('');
  const [saveBanner, setSaveBanner] = useState(false);

  const handleSaveProfile = () => {
    const updated = { ...profile, lastUpdated: new Date().toISOString().split('T')[0] };
    onUpdatePhilosophy(updated);
    setIsEditing(false);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  const handleAddValue = () => {
    if (!newValueInput.trim()) return;
    setProfile({
      ...profile,
      coreValues: [...profile.coreValues, newValueInput.trim()],
    });
    setNewValueInput('');
  };

  const handleRemoveValue = (index: number) => {
    setProfile({
      ...profile,
      coreValues: profile.coreValues.filter((_, i) => i !== index),
    });
  };

  const handleAddQuote = () => {
    if (!newQuoteInput.trim()) return;
    setProfile({
      ...profile,
      statedQuotes: [...profile.statedQuotes, newQuoteInput.trim()],
    });
    setNewQuoteInput('');
  };

  const handleRemoveQuote = (index: number) => {
    setProfile({
      ...profile,
      statedQuotes: profile.statedQuotes.filter((_, i) => i !== index),
    });
  };

  const handleSelectDilemmaOption = (questionId: string, choice: string) => {
    setWizardResponses((prev) => ({
      ...prev,
      [questionId]: {
        choice,
        reflection: prev[questionId]?.reflection || '',
      },
    }));
  };

  const handleReflectionTextChange = (questionId: string, text: string) => {
    setWizardResponses((prev) => ({
      ...prev,
      [questionId]: {
        choice: prev[questionId]?.choice || '',
        reflection: text,
      },
    }));
  };

  const handleRunSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const answersArray = discoveryQuestions.map((q) => {
        const resp = wizardResponses[q.id];
        return {
          questionId: q.id,
          dilemma: q.dilemmaTitle,
          chosenOption: resp?.choice || 'Skipped',
          teacherReflection: resp?.reflection || '',
        };
      });

      const res = await fetch('/api/discover-philosophy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: profile.teacherName,
          dilemmaResponses: answersArray,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSynthesizedResult(data);
      }
    } catch (err) {
      console.error('Failed to discover philosophy via API', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleAcceptSynthesizedProfile = () => {
    if (!synthesizedResult) return;

    const updated: TeacherPhilosophyProfile = {
      ...profile,
      roleOfTeacher: synthesizedResult.synthesizedProfile?.roleOfTeacher || profile.roleOfTeacher,
      viewOfMistakes: synthesizedResult.synthesizedProfile?.viewOfMistakes || profile.viewOfMistakes,
      learnerAutonomy: synthesizedResult.synthesizedProfile?.learnerAutonomy || profile.learnerAutonomy,
      knowledgeConstruction: synthesizedResult.synthesizedProfile?.knowledgeConstruction || profile.knowledgeConstruction,
      assessmentStance: synthesizedResult.synthesizedProfile?.assessmentStance || profile.assessmentStance,
      coreValues: [
        ...new Set([...profile.coreValues, ...(synthesizedResult.synthesizedProfile?.coreValues || [])]),
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setProfile(updated);
    onUpdatePhilosophy(updated);

    // Add extracted stated beliefs to memory Tier 1
    if (synthesizedResult.extractedStatedBeliefs) {
      synthesizedResult.extractedStatedBeliefs.forEach((belief: string) => {
        onAddMemoryItem({
          tier: 'stated_belief',
          text: belief,
          category: 'philosophy',
          source: 'teacher_stated',
          status: 'active',
          notes: 'Extracted from Philosophy Discovery reflection',
        });
      });
    }

    // Add proposed Srijan inferences to memory Tier 3 (pending approval)
    if (synthesizedResult.proposedSrijanInferences) {
      synthesizedResult.proposedSrijanInferences.forEach((inf: string) => {
        onAddMemoryItem({
          tier: 'srijan_inference',
          text: inf,
          category: 'pedagogy',
          source: 'ai_inferred',
          status: 'pending_approval',
          notes: 'Hypothesis inferred from your dilemma answers. Review in Memory Manager.',
        });
      });
    }

    setShowDiscoveryWizard(false);
    setSynthesizedResult(null);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Teacher Educational Philosophy
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              Individual Profile
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Srijan discovers and anchors itself to your unique pedagogical beliefs rather than imposing a standardized blueprint.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setShowDiscoveryWizard(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Discovery Inquiry Wizard</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Edit Profile</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setProfile(philosophy);
                  setIsEditing(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {saveBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Philosophy Profile updated successfully. Contextual reasoning now incorporates these parameters.</span>
        </div>
      )}

      {/* Discovery Wizard Modal / View */}
      {showDiscoveryWizard && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 relative shadow-md">
          <button
            onClick={() => setShowDiscoveryWizard(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            Exit Wizard
          </button>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 font-bold">
                Pedagogical Dilemma Inquiry
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {discoveryQuestions[currentDilemmaIndex].dilemmaTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Dilemma {currentDilemmaIndex + 1} of {discoveryQuestions.length}
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <p className="text-sm font-medium text-slate-800 leading-relaxed mb-4">
                {discoveryQuestions[currentDilemmaIndex].prompt}
              </p>

              <div className="space-y-2.5 mb-5">
                {discoveryQuestions[currentDilemmaIndex].options.map((opt, idx) => {
                  const isSelected =
                    wizardResponses[discoveryQuestions[currentDilemmaIndex].id]?.choice === opt.label;
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        handleSelectDilemmaOption(
                          discoveryQuestions[currentDilemmaIndex].id,
                          opt.label
                        )
                      }
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          {opt.underlyingPhilosophy}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">{opt.stance}</p>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {discoveryQuestions[currentDilemmaIndex].openReflectionPrompt}
                </label>
                <textarea
                  rows={2}
                  value={
                    wizardResponses[discoveryQuestions[currentDilemmaIndex].id]?.reflection || ''
                  }
                  onChange={(e) =>
                    handleReflectionTextChange(
                      discoveryQuestions[currentDilemmaIndex].id,
                      e.target.value
                    )
                  }
                  placeholder="Share the real reasons behind your pedagogical intuition..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentDilemmaIndex === 0}
                onClick={() => setCurrentDilemmaIndex((prev) => prev - 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Previous Dilemma
              </button>

              <div className="flex items-center gap-2">
                {currentDilemmaIndex < discoveryQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentDilemmaIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <span>Next Dilemma</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={isSynthesizing}
                    onClick={handleRunSynthesis}
                    className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{isSynthesizing ? 'Synthesizing Philosophy...' : 'Synthesize My Philosophy'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Synthesized Output Preview */}
            {synthesizedResult && (
              <div className="bg-white rounded-2xl border border-indigo-200 p-5 mt-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Synthesized Pedagogical Stance</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">Role of Teacher: </span>
                    {synthesizedResult.synthesizedProfile?.roleOfTeacher}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">View of Mistakes: </span>
                    {synthesizedResult.synthesizedProfile?.viewOfMistakes}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Knowledge Construction: </span>
                    {synthesizedResult.synthesizedProfile?.knowledgeConstruction}
                  </div>
                </div>

                {synthesizedResult.extractedStatedBeliefs?.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-mono text-slate-700 font-semibold mb-1">
                      Extracted Stated Beliefs (Tier 1 Memory):
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                      {synthesizedResult.extractedStatedBeliefs.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSynthesizedResult(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleAcceptSynthesizedProfile}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply to My Philosophy Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Structured Philosophy Dimensions Grid - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dimension 1: Role of Teacher */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Dimension 1
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Epistemic Stance</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Role of the Teacher</h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={profile.roleOfTeacher}
              onChange={(e) => setProfile({ ...profile, roleOfTeacher: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">{profile.roleOfTeacher}</p>
          )}
        </div>

        {/* Dimension 2: View of Mistakes */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Dimension 2
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Error Culture</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">View of Mistakes & Struggle</h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={profile.viewOfMistakes}
              onChange={(e) => setProfile({ ...profile, viewOfMistakes: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">{profile.viewOfMistakes}</p>
          )}
        </div>

        {/* Dimension 3: Learner Autonomy */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Dimension 3
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Agency & Choice</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Learner Autonomy</h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={profile.learnerAutonomy}
              onChange={(e) => setProfile({ ...profile, learnerAutonomy: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">{profile.learnerAutonomy}</p>
          )}
        </div>

        {/* Dimension 4: Knowledge Construction */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Dimension 4
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Cognitive Modality</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Knowledge Construction</h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={profile.knowledgeConstruction}
              onChange={(e) => setProfile({ ...profile, knowledgeConstruction: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">{profile.knowledgeConstruction}</p>
          )}
        </div>

        {/* Dimension 5: Assessment Stance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Dimension 5
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Feedback & Growth</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Assessment & Diagnostic Stance</h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={profile.assessmentStance}
              onChange={(e) => setProfile({ ...profile, assessmentStance: e.target.value })}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">{profile.assessmentStance}</p>
          )}
        </div>
      </div>

      {/* Core Values & Stated Quotes - Bento Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Non-Negotiable Core Values */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Non-Negotiable Core Values
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">Pillars of Intent</span>
          </div>
          <p className="text-xs text-slate-500">
            Principles that cannot be compromised even during tight exam prep or scheduling crunches.
          </p>

          <div className="space-y-2">
            {profile.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              >
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{val}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveValue(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                    title="Remove value"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newValueInput}
                onChange={(e) => setNewValueInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
                placeholder="Add another core value..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
              <button
                onClick={handleAddValue}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Teacher-Stated Quotes & Axioms */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Stated Axioms & Teacher Quotes
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">Direct Voice</span>
          </div>
          <p className="text-xs text-slate-500">
            Exact phrases you use to express how you think about learning. These are anchored directly in Tier 1 Memory.
          </p>

          <div className="space-y-2.5">
            {profile.statedQuotes.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 italic"
              >
                <div className="flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveQuote(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                    title="Remove quote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newQuoteInput}
                onChange={(e) => setNewQuoteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuote()}
                placeholder="Add direct quote (e.g. 'Never grade a child on their first attempt')..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
              <button
                onClick={handleAddQuote}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
