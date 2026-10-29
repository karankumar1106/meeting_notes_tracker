/**
 * Dashboard Component
 * 
 * Props:
 * - meetings: array of all meetings
 * - items: array of all action items
 * - onNavigate: tab switching callback (e.g. onNavigate('create') or onNavigate('items'))
 */
function Dashboard({ meetings, items, onNavigate }) {
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const inProgressCount = items.filter((i) => i.status === 'in-progress').length;
  const completedCount = items.filter((i) => i.status === 'completed').length;

  const stats = [
    {
      label: 'Total Meetings',
      value: meetings.length,
      color: 'text-indigo-400',
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/10'
    },
    {
      label: 'Pending Tasks',
      value: pendingCount,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      color: 'text-sky-400',
      border: 'border-sky-500/20',
      bg: 'bg-sky-500/10'
    },
    {
      label: 'Completed Tasks',
      value: completedCount,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Workspace Overview
            </h2>
            <p className="text-sm text-slate-400">
              Track commitments, action owners, and unresolved questions across all team meetings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="self-start md:self-auto px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            + Process New Notes
          </button>
        </div>
      </div>

      {/* Dynamic Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm`}
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-extrabold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Meetings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Recent Meetings ({meetings.length})
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('items')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            View all action items →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-white">
                  {meeting.title}
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {meeting.date}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {meeting.notes}
              </p>

              {/* Decisions Preview */}
              {meeting.decisions && meeting.decisions.length > 0 && (
                <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-sky-300 flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>{meeting.decisions[0]}</span>
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
