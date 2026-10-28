/**
 * Navbar Component
 * 
 * Props:
 * - activeTab: string representing current tab ('dashboard' | 'create' | 'items')
 * - setActiveTab: function to change the active tab in the parent (App)
 */
function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: '+ New Meeting' },
    { id: 'items', label: 'Action Items' },
  ];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md mb-8">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-2xl shadow-inner">
          📝
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Meeting Notes Tracker
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            AI-Powered Action Items & Decisions
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1.5 p-1.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
