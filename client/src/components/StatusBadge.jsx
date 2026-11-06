/**
 * StatusBadge — Reusable status indicator
 *
 * Extracts the repeated status→color mapping so every component
 * that displays a status uses the exact same styling.
 *
 * Props:
 * - status: 'pending' | 'in-progress' | 'completed'
 * - onClick: optional click handler (makes the badge interactive)
 */
function StatusBadge({ status, onClick }) {
  const styleMap = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'in-progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pending: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
  };

  const baseStyle = styleMap[status] || styleMap.pending;

  // If onClick is provided, render as a clickable button; otherwise a static span
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Click to cycle status"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-all ${baseStyle}`}
      >
        <span>{status}</span>
        <i className="bi bi-arrow-repeat text-[11px] text-zinc-400"></i>
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border ${baseStyle}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;

