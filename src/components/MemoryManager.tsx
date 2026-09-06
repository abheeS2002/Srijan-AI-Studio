import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { MemoryItem, MemoryTier } from '../types';

interface MemoryManagerProps {
  memoryItems: MemoryItem[];
  onAddMemoryItem: (item: Omit<MemoryItem, 'id' | 'dateAdded'>) => void;
  onUpdateMemoryItem: (id: string, updates: Partial<MemoryItem>) => void;
  onDeleteMemoryItem: (id: string) => void;
  onApproveInference: (id: string) => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  memoryItems,
  onAddMemoryItem,
  onUpdateMemoryItem,
  onDeleteMemoryItem,
  onApproveInference,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<MemoryTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Add Item State
  const [newTier, setNewTier] = useState<MemoryTier>('stated_belief');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('philosophy');
  const [newNotes, setNewNotes] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const safeMemoryItems = memoryItems || [];

  const filteredItems = safeMemoryItems.filter((item) => {
    if (selectedTierFilter !== 'all' && item.tier !== selectedTierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.text.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingSrijanCount = safeMemoryItems.filter(
    (m) => m.tier === 'srijan_inference' && m.status === 'pending_approval'
  ).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddMemoryItem({
      tier: newTier,
      text: newText.trim(),
      category: newCategory,
      source: newTier === 'srijan_inference' ? 'ai_inferred' : 'teacher_stated',
      status: newTier === 'srijan_inference' ? 'pending_approval' : 'active',
      notes: newNotes.trim() || undefined,
      expiresAt: newTier === 'temporary_context' && newExpiry ? newExpiry : undefined,
    });

    setNewText('');
    setNewNotes('');
    setNewExpiry('');
    setShowAddModal(false);
  };

  const startEdit = (item: MemoryItem) => {
    setEditingItemId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = (id: string) => {
    if (!editingText.trim()) return;
    onUpdateMemoryItem(id, { text: editingText.trim() });
    setEditingItemId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Contextual Memory Engine
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold">
              Teacher Governed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Srijan distinguishes between what you explicitly state, what you approve, active AI hypotheses, and temporary situations. You have total authority over persistent memory.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Memory Item</span>
        </button>
      </div>

      {/* 4-Tier Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1 */}
        <div
          onClick={() => setSelectedTierFilter('stated_belief')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTierFilter === 'stated_belief'
              ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded-md">
              Tier 1
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {safeMemoryItems.filter((m) => m.tier === 'stated_belief').length} rules
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Teacher-Stated Beliefs</div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Explicit principles & quotes you articulated. Immutable by AI.
          </p>
        </div>

        {/* Tier 2 */}
        <div
          onClick={() => setSelectedTierFilter('approved_inference')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTierFilter === 'approved_inference'
              ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Tier 2
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {safeMemoryItems.filter((m) => m.tier === 'approved_inference').length} rules
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Approved Inferences</div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Patterns Srijan observed that you evaluated and verified.
          </p>
        </div>

        {/* Tier 3 */}
        <div
          onClick={() => setSelectedTierFilter('srijan_inference')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTierFilter === 'srijan_inference'
              ? 'bg-purple-50/70 border-purple-600 ring-1 ring-purple-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-purple-800 font-bold bg-purple-100/70 px-2 py-0.5 rounded-md">
              Tier 3
            </span>
            {pendingSrijanCount > 0 ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                {pendingSrijanCount} pending
              </span>
            ) : (
              <span className="text-xs font-mono font-bold text-slate-700">
                {safeMemoryItems.filter((m) => m.tier === 'srijan_inference').length} rules
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-slate-900">Srijan Inferences</div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Tentative hypotheses awaiting your approval or rejection.
          </p>
        </div>

        {/* Tier 4 */}
        <div
          onClick={() => setSelectedTierFilter('temporary_context')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedTierFilter === 'temporary_context'
              ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-blue-800 font-bold bg-blue-100/70 px-2 py-0.5 rounded-md">
              Tier 4
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {safeMemoryItems.filter((m) => m.tier === 'temporary_context').length} rules
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900">Temporary Context</div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            Situational constraints (monsoon week, shortened period, exam prep).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Bento Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedTierFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTierFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Memory ({memoryItems.length})
          </button>
          <button
            onClick={() => setSelectedTierFilter('stated_belief')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTierFilter === 'stated_belief'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Stated Beliefs
          </button>
          <button
            onClick={() => setSelectedTierFilter('approved_inference')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTierFilter === 'approved_inference'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Approved Inferences
          </button>
          <button
            onClick={() => setSelectedTierFilter('srijan_inference')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTierFilter === 'srijan_inference'
                ? 'bg-purple-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Srijan Inferences
          </button>
          <button
            onClick={() => setSelectedTierFilter('temporary_context')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-colors ${
              selectedTierFilter === 'temporary_context'
                ? 'bg-blue-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Temporary Context
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search memory items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 text-slate-900"
          />
        </div>
      </div>

      {/* Memory Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No memory items found matching the selected filter or search query.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditing = editingItemId === item.id;
            const isPendingSrijan =
              item.tier === 'srijan_inference' && item.status === 'pending_approval';

            const tierBadge = {
              stated_belief: {
                label: 'Tier 1: Stated Belief',
                bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
              },
              approved_inference: {
                label: 'Tier 2: Approved Inference',
                bg: 'bg-emerald-50 text-emerald-900 border-emerald-200/70',
              },
              srijan_inference: {
                label: 'Tier 3: Srijan Hypothesis',
                bg: 'bg-purple-50 text-purple-900 border-purple-200/70',
              },
              temporary_context: {
                label: 'Tier 4: Temporary Context',
                bg: 'bg-blue-50 text-blue-900 border-blue-200/70',
              },
            }[item.tier];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border bg-white shadow-xs transition-all ${
                  isPendingSrijan ? 'border-purple-300 ring-1 ring-purple-300/60' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${tierBadge.bg}`}
                    >
                      {tierBadge.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                    {item.expiresAt && (
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                        <Clock className="w-3 h-3" />
                        <span>Expires {item.expiresAt}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {isPendingSrijan && (
                      <button
                        onClick={() => onApproveInference(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
                        title="Approve this inference into Tier 2 Persistent Memory"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Edit text"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMemoryItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Discard / Delete from memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-50"
                          title="Save edit"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {item.text}
                  </p>
                )}

                {item.notes && !isEditing && (
                  <div className="mt-2.5 text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    Source context: {item.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Memory Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Add Contextual Memory Item
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Memory Tier
                </label>
                <select
                  value={newTier}
                  onChange={(e: any) => setNewTier(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                >
                  <option value="stated_belief">Tier 1: Teacher-Stated Belief (Immutable)</option>
                  <option value="approved_inference">Tier 2: Teacher-Approved Inference</option>
                  <option value="srijan_inference">Tier 3: Srijan Hypothesis (Pending Approval)</option>
                  <option value="temporary_context">Tier 4: Temporary Situational Context</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                >
                  <option value="philosophy">Philosophy & Values</option>
                  <option value="pedagogy">Pedagogical Practice & Routines</option>
                  <option value="classroom_reality">Physical & Classroom Reality</option>
                  <option value="learner_dynamic">Learner Profile Dynamics</option>
                  <option value="situational">Situational / Ephemeral Constraint</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Memory Content / Rule
                </label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Always pair students in adjacent benches to prevent noisy furniture shifts..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>

              {newTier === 'temporary_context' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teacher Notes / Origin Context (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Learned from the loud fraction lesson last Friday..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Save to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
