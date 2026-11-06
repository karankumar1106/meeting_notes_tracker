/**
 * Navbar Component (Human-Crafted Engineering Aesthetic)
 * 
 * Styled following modern productivity tools (Linear, Raycast, GitHub):
 * - Neutral zinc palette (no neon purple glows or generic AI gradients)
 * - Sharp geometric vector icon instead of cartoon emojis
 * - Clean segmented tab control with micro-borders and subtle contrast
 * - High-density, professional typography
 */
function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: 'New Meeting' },
    { id: 'items', label: 'Action Items' },
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl shadow-xs backdrop-blur-sm mb-8">
      {/* Brand: Clean Vector Mark + Crisp Typography */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-100 shrink-0">
          <svg
            className="w-4 h-4 text-zinc-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
            <path d="m9 14 2 2 4-4" />
          </svg>
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

      {/* Navigation: Segmented Control (Linear-Style Neutral Surface) */}
      <nav className="flex items-center gap-1 p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-lg">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
