import StatusBadge from './StatusBadge';

/**
 * MeetingDetails Component (Bootstrap Icons & Clean Engineering Aesthetic)
 * 
 * Props:
 * - meeting: the active meeting object being viewed
 * - items: full list of action items (filtered to find linked ones)
 * - onBack: callback to return to the dashboard overview
 * - onToggleStatus: callback to cycle status on any linked action item
 */
function MeetingDetails({ meeting, items, onBack, onToggleStatus }) {
  // Guard clause: If no meeting is selected, render a clean fallback
  if (!meeting) {
    return (
      <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
        <p className="text-xs text-zinc-400">No meeting selected.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-3 px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-all cursor-pointer"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  // Relational Filtering: Extract only items belonging to this specific meeting
  const linkedItems = items.filter((item) => item.meetingId === meeting.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar: Back Button & Metadata */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer group"
        >
          <i className="bi bi-arrow-left text-xs transition-transform group-hover:-translate-x-0.5"></i>
          <span>Back to Overview</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded-md border border-zinc-800">
          ID: {meeting.id}
        </span>
      </div>

      {/* Meeting Header Card */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
            {meeting.title}
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {meeting.date}
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Raw Transcript & Structured Extracted Commitments
        </p>
      </div>

      {/* Decisions & Unresolved Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decisions Section */}
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="bi bi-check2 text-xs"></i>
            </div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Decisions Logged ({meeting.decisions?.length || 0})
            </h3>
          </div>

          {meeting.decisions && meeting.decisions.length > 0 ? (
            <ul className="space-y-2">
              {meeting.decisions.map((decision, index) => (
                <li
                  key={index}
                  className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed flex items-start gap-2"
                >
                  <i className="bi bi-check2 text-emerald-400 text-xs mt-0.5 shrink-0"></i>
                  <span>{decision}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500 italic">No explicit decisions recorded.</p>
          )}
        </div>

        {/* Unresolved Questions Section */}
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <i className="bi bi-question-circle text-xs"></i>
            </div>
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Unanswered Questions ({meeting.unansweredQuestions?.length || 0})
            </h3>
          </div>

          {meeting.unansweredQuestions && meeting.unansweredQuestions.length > 0 ? (
            <ul className="space-y-2">
              {meeting.unansweredQuestions.map((question, index) => (
                <li
                  key={index}
                  className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed flex items-start gap-2"
                >
                  <i className="bi bi-question-lg text-amber-400 text-xs mt-0.5 shrink-0"></i>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500 italic">All questions were resolved in discussion.</p>
          )}
        </div>
      </div>

      {/* Linked Action Items for this Meeting */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
        <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <i className="bi bi-check2-square text-zinc-400"></i>
          <span>Linked Action Items</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            {linkedItems.length}
          </span>
        </h3>

        {linkedItems.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-2">
            No action items attached to this meeting.
          </p>
        ) : (
          <div className="space-y-2.5">
            {linkedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-200">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>Owner: <strong className="text-zinc-300">{item.owner}</strong></span>
                    <span className="font-mono">Due: {item.dueDate}</span>
                  </div>
                </div>

                <StatusBadge
                  status={item.status}
                  onClick={() => onToggleStatus && onToggleStatus(item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Transcript Block */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <i className="bi bi-file-text"></i>
          <span>Raw Discussion Transcript</span>
        </h3>
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {meeting.notes}
        </div>
      </div>
    </div>
  );
}

export default MeetingDetails;

