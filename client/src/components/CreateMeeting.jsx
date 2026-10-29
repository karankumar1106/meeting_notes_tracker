import { useState } from 'react';

/**
 * CreateMeeting Component
 * 
 * Props:
 * - onCreateMeeting: callback function passed from parent (App.jsx)
 *   Receives (title, notes) and adds them to state.
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          Paste Meeting Notes
        </h2>
        <p className="text-sm text-slate-400">
          Paste raw transcripts, bullet points, or discussion summaries.
        </p>
      </div>

      {/* Banner explaining mock extraction */}
      <div className="p-3.5 mb-6 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
        <span className="text-base">💡</span>
        <span>
          <strong>Phase 1 Mock Mode:</strong> Submitting will simulate AI extraction and generate trackable items linked to your sentences. Real LLM extraction will be connected in Phase 5!
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meeting Title Input */}
        <div>
          <label
            htmlFor="meeting-title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
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
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm disabled:opacity-50"
          />
        </div>

        {/* Meeting Notes Textarea */}
        <div>
          <label
            htmlFor="meeting-notes"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
          >
            Raw Meeting Notes
          </label>
          <textarea
            id="meeting-notes"
            rows={8}
            required
            disabled={isProcessing}
            placeholder="Paste raw notes here... e.g.&#10;Alice agreed to refactor auth endpoints by next Friday. Bob will take care of creating the Redis cluster for queue testing. Karan confirmed the Mongoose Job model fields match the spec."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            {notes.length} characters entered
          </p>
          <button
            type="submit"
            disabled={isProcessing || !notes.trim()}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span>Extracting Items...</span>
              </>
            ) : (
              <span>Extract Action Items ✨</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMeeting;
