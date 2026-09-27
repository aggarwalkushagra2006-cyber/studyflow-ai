import { useState } from 'react';

export default function UploadSection({ onAnalyze, loading, error }) {
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!notes.trim() && !file) {
      alert('Please paste notes or upload a file.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (notes.trim()) formData.append('notes', notes);

    onAnalyze(formData);
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-violet-400 uppercase tracking-[0.25em] text-xs font-bold">AI learning assistant</p>
        <h1 className="mt-4 text-5xl font-black leading-tight">Turn notes into smarter study material.</h1>
        <p className="mt-4 text-lg text-slate-300">
          Upload a PDF or paste lecture notes to instantly generate summaries, flashcards, and quizzes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <label className="block text-sm font-semibold text-slate-200 mb-2">Upload notes or PDF</label>
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-600 file:text-white file:font-semibold hover:file:bg-violet-500"
        />

        {file && (
          <div className="mt-3 text-sm text-emerald-400">Selected: {file.name}</div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={10}
          placeholder="Paste your notes here..."
          className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
        />

        {error && (
          <div className="mt-4 rounded-lg border border-red-700 bg-red-900/20 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 px-4 font-bold text-lg transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Generating...' : 'Generate Study Pack'}
        </button>
      </form>
    </section>
  );
}
