/**
 * Dashboard Component
 * 
 * Props:
 * - onNavigate: function passed from App to switch screens (e.g. onNavigate('create'))
 */
function Dashboard({ onNavigate }) {
  // Sample summary statistics (mock data for Phase 1)
  const stats = [
    { label: 'Total Meetings', value: '3', color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/10' },
    { label: 'Pending Tasks', value: '4', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
    { label: 'Completed', value: '8', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
    { label: 'Open Questions', value: '2', color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-6">
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

      {/* Metric Cards Grid */}
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
    </div>
  );
}

export default Dashboard;
