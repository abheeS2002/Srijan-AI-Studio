import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Printer,
  Copy,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Scale,
} from 'lucide-react';
import { EducationalDesignOutput, DesignType } from '../types';

interface LibraryStudioProps {
  savedDesigns: EducationalDesignOutput[];
  onDeleteDesign: (id: string) => void;
  onSelectDesignForWorkspace: (design: EducationalDesignOutput) => void;
}

export const LibraryStudio: React.FC<LibraryStudioProps> = ({
  savedDesigns,
  onDeleteDesign,
  onSelectDesignForWorkspace,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<DesignType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const safeSavedDesigns = savedDesigns || [];
  const [activePreviewDesign, setActivePreviewDesign] = useState<EducationalDesignOutput | null>(
    safeSavedDesigns.length > 0 ? safeSavedDesigns[0] : null
  );
  const [copiedToast, setCopiedToast] = useState(false);

  const filteredDesigns = safeSavedDesigns.filter((d) => {
    if (selectedTypeFilter !== 'all' && d.designType !== selectedTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.topicPrompt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyMarkdown = (design: EducationalDesignOutput) => {
    let md = `# ${design.title}\n\n`;
    md += `**Design Type:** ${design.designType.toUpperCase()}\n`;
    md += `**Date:** ${design.createdAt}\n\n`;
    md += `### Summary\n${design.summary}\n\n`;

    if (design.content.essentialQuestion) {
      md += `**Essential Question:** ${design.content.essentialQuestion}\n\n`;
    }

    if (design.content.phases) {
      md += `### Phases & Pedagogical Rationale\n`;
      design.content.phases.forEach((p) => {
        md += `#### ${p.phaseName} (${p.timeAllocationMinutes} mins)\n`;
        md += `- **Teacher:** ${p.teacherAction}\n`;
        md += `- **Student:** ${p.studentAction}\n`;
        md += `- **Rationale:** ${p.pedagogicalRationale}\n\n`;
      });
    }

    md += `### Reasoning Matrix\n`;
    md += `**Recommended Approach:** ${design.reasoningMatrix.recommendedApproach}\n`;
    md += `**Rationale:** ${design.reasoningMatrix.pedagogicalRationale}\n`;

    navigator.clipboard.writeText(md);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Personal Educational Library
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              {savedDesigns.length} Artifacts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All your contextual co-designs, unit plans, lesson flows, and assessments with embedded pedagogical rationale.
          </p>
        </div>
      </div>

      {copiedToast && (
        <div className="p-3 bg-slate-900 text-white text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Plan and reasoning matrix copied as clean Markdown!</span>
        </div>
      )}

      {/* Filter and Search Bento Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTypeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Types ({savedDesigns.length})
          </button>
          <button
            onClick={() => setSelectedTypeFilter('lesson')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTypeFilter === 'lesson'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lesson Plans
          </button>
          <button
            onClick={() => setSelectedTypeFilter('unit')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTypeFilter === 'unit'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unit Sequences
          </button>
          <button
            onClick={() => setSelectedTypeFilter('activity')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTypeFilter === 'activity'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tiered Activities
          </button>
          <button
            onClick={() => setSelectedTypeFilter('assessment')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTypeFilter === 'assessment'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assessments
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search saved designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 text-slate-900"
          />
        </div>
      </div>

      {/* Grid: Artifacts List & Active Artifact Preview - Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List of Designs (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDesigns.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No saved designs found.
            </div>
          ) : (
            filteredDesigns.map((d) => (
              <div
                key={d.id}
                onClick={() => setActivePreviewDesign(d)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activePreviewDesign?.id === d.id
                    ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                    {d.designType}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{d.createdAt}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{d.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-normal">{d.summary}</p>
              </div>
            ))
          )}
        </div>

        {/* Active Design Full Preview (7 cols) */}
        <div className="lg:col-span-7">
          {activePreviewDesign ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {activePreviewDesign.designType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Saved {activePreviewDesign.createdAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {activePreviewDesign.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(activePreviewDesign)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Copy Markdown"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDesign(activePreviewDesign.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Delete from library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activePreviewDesign.content.essentialQuestion && (
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 uppercase block mb-1">
                    Essential Question:
                  </span>
                  <span className="text-sm font-semibold text-indigo-950">
                    "{activePreviewDesign.content.essentialQuestion}"
                  </span>
                </div>
              )}

              {/* Phases */}
              {activePreviewDesign.content.phases && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Instructional Flow & Rationale
                  </h3>
                  <div className="space-y-2.5">
                    {activePreviewDesign.content.phases.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{p.phaseName}</span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {p.timeAllocationMinutes}m
                          </span>
                        </div>
                        <p className="text-slate-700">
                          <strong className="text-slate-900">Teacher: </strong>
                          {p.teacherAction}
                        </p>
                        <p className="text-slate-700">
                          <strong className="text-slate-900">Student: </strong>
                          {p.studentAction}
                        </p>
                        <div className="text-[11px] text-indigo-900 italic pt-1.5 border-t border-slate-200/70 font-medium">
                          Why: {p.pedagogicalRationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Educational Reasoning Summary</span>
                </div>
                <div className="text-xs font-bold text-white">
                  {activePreviewDesign.reasoningMatrix.recommendedApproach}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activePreviewDesign.reasoningMatrix.pedagogicalRationale}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectDesignForWorkspace(activePreviewDesign)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Open in Co-Design Studio to Iterate or Override</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Select a design from the list to preview details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
