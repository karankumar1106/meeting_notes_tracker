import { useState } from 'react';
import StatusBadge from './StatusBadge';

/**
 * ActionItems Component (Clean Bootstrap Icons & Engineering Aesthetic)
 * 
 * Props:
 * - items: list of all action items from App state
 * - onToggleStatus: callback to cycle status
 * - onUpdateItem: callback to update an item's fields (text, owner, dueDate, status)
 * - onDelete: callback to remove an item
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
        {/* Search Input with Bootstrap Icon */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by action, owner, or meeting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800/80 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-sans"
          />
          <i className="bi bi-search absolute left-2.5 top-1.5 text-zinc-500 text-xs"></i>
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
            <i className="bi bi-file-earmark-text text-base"></i>
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
                  <StatusBadge
                    status={item.status}
                    onClick={() => onToggleStatus(item.id)}
                  />

                  {/* Edit Button with Bootstrap Icon */}
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...item })}
                    title="Edit item"
                    className="p-1 px-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
                  >
                    <i className="bi bi-pencil text-xs"></i>
                  </button>

                  {/* Delete Button with Bootstrap Icon */}
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    title="Delete item"
                    className="p-1 px-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all cursor-pointer"
                  >
                    <i className="bi bi-trash3 text-xs"></i>
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
                <i className="bi bi-quote text-zinc-500 text-sm leading-none mt-0.5"></i>
                <span className="italic leading-relaxed text-zinc-400">
                  Source: {item.sourceSentence}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Modal (Clean Bootstrap Icons) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                <i className="bi bi-pencil-square text-zinc-400"></i>
                <span>Edit Action Item</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-500 hover:text-zinc-200 text-xs cursor-pointer p-1"
              >
                <i className="bi bi-x-lg"></i>
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
