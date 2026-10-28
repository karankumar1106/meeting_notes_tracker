import { useState } from 'react';

/**
 * CreateMeeting Component
 * 
 * Demonstrates:
 * 1. Component-local state (title & notes text).
 * 2. Controlled inputs (React controls the input value via value & onChange).
 */
function CreateMeeting() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents full browser page reload
    alert(`Meeting "${title}" ready for extraction! (We will connect AI extraction next)`);
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
            placeholder="e.g., Sprint 14 Planning & Architecture Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
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
            placeholder="Paste raw notes here... e.g.&#10;Alice agreed to refactor auth endpoints by Friday. Bob raised a question: do we need Redis cluster for multi-region?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            {notes.length} characters entered
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Extract Action Items ✨
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMeeting;
