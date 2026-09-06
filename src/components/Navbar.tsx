import React from 'react';
import {
  Compass,
  BookOpen,
  Users,
  BrainCircuit,
  Sparkles,
  RotateCcw,
  Bookmark,
  ShieldCheck,
  HelpCircle,
  School,
  BookMarked,
  ChevronDown,
} from 'lucide-react';
import { ActiveTab, MemoryItem, ClassroomSection } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  teacherName?: string;
  memoryItems?: MemoryItem[];
  pendingApprovalsCount?: number;
  onOpenOnboarding: () => void;
  activeClassroom?: ClassroomSection;
  onOpenClassroomSwitcher?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  teacherName = 'Teacher',
  memoryItems = [],
  pendingApprovalsCount,
  onOpenOnboarding,
  activeClassroom,
  onOpenClassroomSwitcher,
}) => {
  const finalPendingCount =
    typeof pendingApprovalsCount === 'number'
      ? pendingApprovalsCount
      : (memoryItems || []).filter(
          (m) => m.tier === 'srijan_inference' && m.status === 'pending_approval'
        ).length;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'syllabus', label: 'Curriculum & Textbooks', icon: BookMarked },
    { id: 'design', label: 'Co-Design Studio', icon: Sparkles },
    { id: 'classroom', label: 'Classroom & Learners', icon: Users },
    { id: 'philosophy', label: 'Philosophy', icon: BookOpen },
    { id: 'memory', label: 'Contextual Memory', icon: BrainCircuit },
    { id: 'reflection', label: 'Reflective Inquiry', icon: RotateCcw },
    { id: 'library', label: 'Saved Library', icon: Bookmark },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Logo & Manifesto Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Srijan</span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                  Teacher-First AI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Contextual Educational Design Companion for Individual Teachers
              </p>
            </div>
          </div>

          {/* Active Classroom Switcher & Teacher Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeClassroom && onOpenClassroomSwitcher && (
              <button
                type="button"
                onClick={onOpenClassroomSwitcher}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
                title="Switch classroom or subject section"
              >
                <School className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-[200px]">
                  {activeClassroom.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">Teacher Agency:</span>
              <span className="text-emerald-700 font-semibold">Non-Negotiable</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
                {teacherName.charAt(0) || 'T'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-none">{teacherName}</div>
                <div className="text-[10px] text-slate-500 leading-tight">Classroom Teacher</div>
              </div>
            </div>

            <button
              onClick={onOpenOnboarding}
              title="About Srijan & Philosophy"
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'memory' && finalPendingCount > 0 && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {finalPendingCount} review
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

