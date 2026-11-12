/**
 * Navbar Component (Bootstrap Icons & Clean Engineering Aesthetic)
 * 
 * Props:
 * - activeTab: string representing current tab ('dashboard' | 'create' | 'items')
 * - setActiveTab: function to change the active tab in the parent (App)
 * - currentUser: authenticated user object or null
 * - onLogout: callback to sign out
 * - onOpenAuth: callback to open auth modal
 */
function Navbar({ activeTab, setActiveTab, currentUser, onLogout, onOpenAuth }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid' },
    { id: 'create', label: 'New Meeting', icon: 'bi-plus-circle' },
    { id: 'items', label: 'Action Items', icon: 'bi-check2-square' },
  ];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xs backdrop-blur-sm mb-8">
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

      {/* Navigation Controls & User Profile */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Navigation: Segmented Control */}
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

        {/* User Auth Section */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800/80 px-2.5 py-1 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-semibold uppercase">
                {currentUser.name ? currentUser.name[0] : 'U'}
              </div>
              <span className="text-xs text-zinc-300 font-medium max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <i className="bi bi-box-arrow-right text-xs"></i>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <i className="bi bi-person text-xs"></i>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
