import { useState } from 'react';

/**
 * ActionItems Component
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
    const [editingItem, setEditingItem] = useState(null); // Holds the item currently being edited in modal

    // Handler: Save modal edits back to parent state
    const handleSaveEdit = (e) => {
      e.preventDefault();
      if (!editingItem || !editingItem.text.trim()) return;

      onUpdateItem(editingItem); // Call App.jsx's handleUpdateItem
      setEditingItem(null);      // Close modal
    };

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

    const getStatusBadgeStyle = (status) => {
      switch (status) {
        case 'completed':
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
        case 'in-progress':
          return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
        default:
          return 'bg-slate-800 text-slate-300 border-slate-700';
      }
    };

    return (
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Action Items & Commitments
            </h2>
            <p className="text-sm text-slate-400">
              Filter, track, and update action items extracted from meetings.
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
            Showing <span className="text-white font-semibold">{filteredItems.length}</span> of {items.length} items
          </div>
        </div>

        {/* Search Bar & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by action, owner, or meeting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 border border-slate-800 rounded-xl overflow-x-auto">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap ${statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-slate-300 font-semibold text-sm">No action items found</p>
            <p className="text-slate-500 text-xs mt-1">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Paste your first meeting notes to extract action items!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-md transition-all space-y-3"
              >
                {/* Row 1: Item text, Status changer, Delete button */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    {item.meetingTitle && (
                      <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
                        📂 {item.meetingTitle}
                      </span>
                    )}
                    <h3 className={`text-sm font-semibold leading-snug ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                      }`}>
                      {item.text}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {/* Status Toggle Button */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item.id)}
                      title="Click to change status"
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-all ${getStatusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {item.status} ↻
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...item })}
                      title="Edit item"
                      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all cursor-pointer text-xs"
                    >
                      ✏️
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      title="Delete item"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Row 2: Owner & Due Date metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Owner:</span>
                    <span className="text-slate-200 font-medium">{item.owner}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Due Date:</span>
                    <span className="text-slate-200 font-medium">{item.dueDate}</span>
                  </div>
                </div>

                {/* Row 3: Source Sentence Attribution */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-indigo-400 font-bold leading-none mt-0.5">“</span>
                  <span className="italic leading-relaxed">
                    Source: {item.sourceSentence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>✏️</span> Edit Action Item
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="text-slate-500 hover:text-white text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Task Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Action Item Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.text}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, text: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                </div>

                {/* Owner and Due Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Owner
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.owner}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, owner: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Due Date
                    </label>
                    <input
                      type="date"
                      required
                      value={editingItem.dueDate}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, dueDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all cursor-pointer"
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
