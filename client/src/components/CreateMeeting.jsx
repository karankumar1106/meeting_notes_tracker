import { useState } from 'react';

/**
 * CreateMeeting Component (Human-Crafted Engineering Aesthetic)
 * 
 * Styled following modern developer tools:
 * - Neutral zinc inputs with high-contrast text and subtle focus rings
 * - Monospace character count and notes area
 * - High-contrast, clean action buttons (no neon purple sparkles)
 */
function CreateMeeting({ onCreateMeeting }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) return;

    setIsProcessing(true);

    // Simulate extraction processing delay (600ms)
    setTimeout(() => {
      onCreateMeeting(title, notes);
      setIsProcessing(false);
      setTitle('');
      setNotes('');
    }, 600);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 md:p-7 shadow-xs backdrop-blur-sm max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-zinc-100 tracking-tight mb-1">
          New Meeting Record
        </h2>
        <p className="text-xs text-zinc-400">
          Paste meeting transcripts, bullet points, or discussion summaries to generate structured commitments.
        </p>
      </div>

      {/* Subtle Information Notice */}
      <div className="p-3 mb-6 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
        <svg
          className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <div className="leading-relaxed">
          <span className="font-medium text-zinc-300">Phase 1 Architecture:</span> Submitting simulates the extraction pipeline and structures action items linked to source sentences. Real LLM extraction will be integrated in Phase 5.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meeting Title Input */}
        <div>
          <label
            htmlFor="meeting-title"
            className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            Meeting Title
          </label>
          <input
            id="meeting-title"
            type="text"
            required
            disabled={isProcessing}
            placeholder="e.g., Sprint 14 Planning & Architecture Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-xs disabled:opacity-50"
          />
        </div>

        {/* Meeting Notes Textarea */}
        <div>
          <label
            htmlFor="meeting-notes"
            className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            Raw Discussion Notes
          </label>
          <textarea
            id="meeting-notes"
            rows={8}
            required
            disabled={isProcessing}
            placeholder="Paste raw notes here... e.g.&#10;Alice agreed to refactor auth endpoints by next Friday. Bob will take care of creating the Redis cluster for queue testing. Karan confirmed the Mongoose Job model fields match the spec."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-xs font-mono leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
          <p className="text-[11px] text-zinc-500 font-mono">
            {notes.length} characters
          </p>
          <button
            type="submit"
            disabled={isProcessing || !notes.trim()}
            className="px-4 py-2 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 rounded-lg transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></span>
                <span>Extracting Commitments...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                <span>Extract Action Items</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMeeting;
