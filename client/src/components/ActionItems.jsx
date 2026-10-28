/**
 * ActionItems Component
 * 
 * Demonstrates:
 * 1. Rendering lists of data using JavaScript .map()
 * 2. The importance of the unique `key` prop in React lists
 * 3. Structured display of item owner, due date, status, and source sentence
 */
function ActionItems() {
  // Sample extracted items (mock data for Phase 1)
  const sampleItems = [
    {
      id: 'item-1',
      text: 'Refactor authentication routes to use HTTP-only cookies',
      owner: 'Alice Johnson',
      dueDate: '2026-11-05',
      status: 'in-progress',
      sourceSentence: 'Alice agreed to refactor auth endpoints by next Friday.',
    },
    {
      id: 'item-2',
      text: 'Provision Redis instance on Upstash or Render',
      owner: 'Bob Smith',
      dueDate: '2026-11-02',
      status: 'pending',
      sourceSentence: 'Bob will take care of creating the Redis cluster for queue testing.',
    },
    {
      id: 'item-3',
      text: 'Finalize database schema for Jobs collection',
      owner: 'Karan Kumar',
      dueDate: '2026-10-30',
      status: 'completed',
      sourceSentence: 'Karan confirmed the Mongoose Job model fields match the spec.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Action Items & Commitments
          </h2>
          <p className="text-sm text-slate-400">
            Every commitment extracted directly from meeting discussions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span>Total: {sampleItems.length} items</span>
        </div>
      </div>

      {/* List of Action Items */}
      <div className="space-y-3">
        {sampleItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-md transition-all space-y-3"
          >
            {/* Top row: Item Text & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white leading-snug">
                {item.text}
              </h3>
              <span
                className={`self-start sm:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  item.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                    : item.status === 'in-progress'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Middle row: Owner & Due Date metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Owner:</span>
                <span className="text-slate-200 font-medium">{item.owner}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Due:</span>
                <span className="text-slate-200 font-medium">{item.dueDate}</span>
              </div>
            </div>

            {/* Bottom row: Source Sentence Attribution */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
              <span className="text-indigo-400 font-bold">“</span>
              <span className="italic">{item.sourceSentence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionItems;
