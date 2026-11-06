import { useState } from 'react';

/**
 * ActionItems Component (Human-Crafted Engineering Aesthetic)
 * 
 * Styled following modern productivity tools (Linear, Raycast, GitHub):
 * - Clean SVG vector icons for search, edit, and deletion (zero emojis)
 * - Restrained status badges with high legibility
 * - Crisp filter tabs matching the segmented control design
 * - Polished edit modal with neutral zinc surfaces
 */
function ActionItems({ items, onToggleStatus, onUpdateItem, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);

  // Filter items based on search term and active status tab
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.meetingTitle && item.meetingTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handler: Save modal edits back to parent state
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.text.trim()) return;

    onUpdateItem(editingItem);
    setEditingItem(null);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 tracking-tight mb-0.5">
            Action Items & Commitments
          </h2>
          <p className="text-xs text-zinc-400">
            Filter, track, and update action items extracted from meetings.
          </p>
        </div>
        <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900/40 border border-zinc-800 px-3 py-1 rounded-lg self-start sm:self-auto">
          Showing <span className="text-zinc-100 font-semibold">{filteredItems.length}</span> of {items.length} items
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-zinc-900/40 border border-zinc-800 rounded-xl">
        {/* Search Input with Vector Icon */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by action, owner, or meeting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800/80 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-sans"
          />
          <svg
            className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-1 border border-zinc-800/80 rounded-lg overflow-x-auto">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-6">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="text-zinc-200 font-medium text-xs">No action items found</p>
          <p className="text-zinc-500 text-[11px] mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'Paste your first meeting notes to extract action items.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700/70 rounded-xl shadow-xs transition-colors space-y-3"
            >
              {/* Row 1: Item text, Status cycle button, Edit and Delete */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  {item.meetingTitle && (
                    <span className="text-[10px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
                      {item.meetingTitle}
                    </span>
                  )}
                  <h3 className={`text-xs font-medium leading-relaxed ${
                    item.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'
                  }`}>
                    {item.text}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  {/* Status Toggle Button */}
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    title="Click to cycle status"
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-all ${getStatusBadgeStyle(
                      item.status
                    )}`}
                  >
                    <span>{item.status}</span>
                    <span className="text-zinc-500 text-[11px]">↻</span>
                  </button>

                  {/* Edit Button with Vector SVG */}
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...item })}
                    title="Edit item"
                    className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>

                  {/* Delete Button with Vector SVG */}
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    title="Delete item"
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Row 2: Metadata (Owner & Due Date) */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Owner:</span>
                  <span className="text-zinc-300 font-medium">{item.owner}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-zinc-500">Due:</span>
                  <span className="text-zinc-300 font-medium">{item.dueDate}</span>
                </div>
              </div>

              {/* Row 3: Source Sentence Attribution */}
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2">
                <span className="text-zinc-500 font-bold leading-none mt-0.5">“</span>
                <span className="italic leading-relaxed text-zinc-400">
                  Source: {item.sourceSentence}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Modal (Clean Neutral Zinc Dialog) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                <span>Edit Action Item</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-500 hover:text-zinc-200 text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Action Item Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.text}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, text: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Owner
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.owner}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, owner: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingItem.dueDate}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, status: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionItems;
