/**
 * Navbar Component (Bootstrap Icons & Clean Engineering Aesthetic)
 * 
 * Props:
 * - activeTab: string representing current tab ('dashboard' | 'create' | 'items')
 * - setActiveTab: function to change the active tab in the parent (App)
 */
function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { id: 'create', label: 'New Meeting', icon: 'bi-plus-circle' },
    { id: 'items', label: 'Action Items', icon: 'bi-check2-square' },
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xs backdrop-blur-sm mb-8">
      {/* Brand: Clean Bootstrap Icon + Crisp Typography */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-100 shrink-0">
          <i className="bi bi-journal-check text-sm text-zinc-200"></i>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
              Meeting Notes Tracker
            </h1>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              v0.1
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-normal">
            Commitments & Action Items Engine
          </p>
        </div>
      </div>

      {/* Navigation: Segmented Control with Bootstrap Icons */}
      <nav className="flex items-center gap-1 p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-lg">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`bi ${item.icon} text-xs`}></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
