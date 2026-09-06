import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  BrainCircuit,
  RotateCcw,
  X,
} from 'lucide-react';

interface TeacherOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiscovery: () => void;
}

export const TeacherOnboardingModal: React.FC<TeacherOnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartDiscovery,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            सृ
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome to Srijan
            </h2>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              An Educational Design Companion for One Teacher
            </p>
          </div>
        </div>

        {/* Central Manifesto */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 sm:p-5 mb-6">
          <p className="text-sm sm:text-base italic text-indigo-950 leading-relaxed font-medium">
            "If an AI understands a teacher's educational philosophy, classroom context and learner needs, can it help that teacher make more relevant, coherent and intentional educational decisions than generic AI?"
          </p>
          <div className="mt-2 text-xs text-indigo-700 font-semibold">
            — The Fundamental Srijan Hypothesis
          </div>
        </div>

        {/* Core Differentiation Pillars */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            What Makes Srijan Different from Generic AI
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-900">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Discovers, Doesn't Impose</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                There is no single "correct" pedagogy. Srijan begins by discovering your stance on authority, errors, inquiry, and agency.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-900">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Contextual Educational Reasoning</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Generation is not the differentiator. Before recommending a plan, Srijan weighs educational trade-offs and alternatives.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Teacher Agency Non-Negotiable</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                You control persistent memory. You can accept, modify, reject, or override any recommendation at any moment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-900">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Intention vs. Practice Reflection</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Compare what you intended with what actually happened in the classroom to uncover systemic frictions and deepen your craft.
              </p>
            </div>
          </div>
        </div>

        {/* The 8-Stage Loop Bento Strip */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 mb-6 shadow-xs">
          <div className="text-[11px] font-mono text-indigo-300 font-bold mb-2 uppercase tracking-wide">
            The Srijan Core Loop
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold text-white">UNDERSTAND TEACHER</span>
            <span className="text-slate-500">→</span>
            <span className="font-semibold text-white">UNDERSTAND CLASSROOM</span>
            <span className="text-slate-500">→</span>
            <span>CLARIFY INTENT</span>
            <span className="text-slate-500">→</span>
            <span>REASON TOGETHER</span>
            <span className="text-slate-500">→</span>
            <span className="font-semibold text-indigo-400">DESIGN</span>
            <span className="text-slate-500">→</span>
            <span>IMPLEMENT</span>
            <span className="text-slate-500">→</span>
            <span className="font-semibold text-amber-400">REFLECT</span>
            <span className="text-slate-500">→</span>
            <span className="font-semibold text-emerald-400">UPDATE MEMORY</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Explore Dashboard
          </button>
          <button
            onClick={() => {
              onClose();
              onStartDiscovery();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <span>Start Philosophy Discovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
