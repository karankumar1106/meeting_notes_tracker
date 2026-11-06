/**
 * Dashboard Component (Human-Crafted Engineering Aesthetic)
 * 
 * Styled following modern productivity tools (Linear, Raycast, GitHub):
 * - Neutral zinc metric cards with monospace figures
 * - High-contrast, clean action buttons (light-on-dark)
 * - Refined recent meetings cards with clean typography and subtle borders
 */
function Dashboard({ meetings, items, onNavigate }) {
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const inProgressCount = items.filter((i) => i.status === 'in-progress').length;
  const completedCount = items.filter((i) => i.status === 'completed').length;

  const stats = [
    {
      label: 'Total Meetings',
      value: meetings.length,
      subtext: 'Documented sessions'
    },
    {
      label: 'Pending Tasks',
      value: pendingCount,
      subtext: 'Awaiting action'
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      subtext: 'Active commitments'
    },
    {
      label: 'Completed Tasks',
      value: completedCount,
      subtext: 'Resolved items'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl backdrop-blur-sm">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
            Workspace Overview
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track commitments, task owners, and unresolved questions across team meetings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('create')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Process New Notes
        </button>
      </div>

      {/* Structured Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700/60 transition-colors"
          >
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
                {stat.value}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Meetings Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Recent Meetings
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {meetings.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('items')}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>View all action items</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-4 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700/70 rounded-xl space-y-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-zinc-200 leading-snug">
                  {meeting.title}
                </h4>
                <span className="text-[11px] text-zinc-500 font-mono shrink-0">
                  {meeting.date}
                </span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {meeting.notes}
              </p>

              {/* Clean Decision Pill */}
              {meeting.decisions && meeting.decisions.length > 0 && (
                <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-zinc-300 text-xs leading-relaxed">
                    {meeting.decisions[0]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
