import { useState } from 'react';

export default function SubjectProgress({ subjects, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', totalChapters: '' });
  const [expandedSubject, setExpandedSubject] = useState(null);

  function addSubject() {
    if (formData.name && formData.totalChapters) {
      const newSubject = {
        id: Date.now(),
        name: formData.name,
        totalChapters: parseInt(formData.totalChapters),
        completedChapters: 0,
        chapters: Array.from({ length: parseInt(formData.totalChapters) }, (_, i) => ({
          id: i + 1,
          name: `Chapter ${i + 1}`,
          completed: false,
        })),
        createdAt: new Date().toISOString(),
        hoursSpent: 0,
      };
      onUpdate([...subjects, newSubject]);
      setFormData({ name: '', totalChapters: '' });
      setShowForm(false);
    }
  }

  function toggleChapter(subjectId, chapterId) {
    const updated = subjects.map((subject) => {
      if (subject.id === subjectId) {
        const chapter = subject.chapters.find((ch) => ch.id === chapterId);
        chapter.completed = !chapter.completed;
        subject.completedChapters = subject.chapters.filter((ch) => ch.completed).length;
      }
      return subject;
    });
    onUpdate(updated);
  }

  function deleteSubject(id) {
    onUpdate(subjects.filter((s) => s.id !== id));
  }

  function calculateProgress(subject) {
    return Math.round((subject.completedChapters / subject.totalChapters) * 100);
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total Subjects</p>
          <p className="text-3xl font-black text-violet-400">{subjects.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Completed Chapters</p>
          <p className="text-3xl font-black text-green-400">
            {subjects.reduce((sum, s) => sum + s.completedChapters, 0)}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total Chapters</p>
          <p className="text-3xl font-black text-blue-400">
            {subjects.reduce((sum, s) => sum + s.totalChapters, 0)}
          </p>
        </div>
      </div>

      {/* Add Subject Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 py-3 rounded-xl font-semibold transition"
        >
          + Add Subject
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h3 className="font-bold mb-4">Add New Subject</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Subject name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
            />
            <input
              type="number"
              min="1"
              placeholder="Number of chapters"
              value={formData.totalChapters}
              onChange={(e) => setFormData({ ...formData, totalChapters: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
            />
            <div className="flex gap-3">
              <button
                onClick={addSubject}
                className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-semibold transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-700 rounded-xl">
            <p className="text-slate-400">No subjects yet. Add one to get started!</p>
          </div>
        ) : (
          subjects.map((subject) => {
            const progress = calculateProgress(subject);
            const isExpanded = expandedSubject === subject.id;

            return (
              <div key={subject.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 cursor-pointer hover:bg-slate-800 transition" onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{subject.name}</h3>
                      <p className="text-sm text-slate-400">
                        {subject.completedChapters} / {subject.totalChapters} chapters completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-violet-400">{progress}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Chapters List */}
                {isExpanded && (
                  <div className="border-t border-slate-700 bg-slate-800/50 p-6">
                    <div className="space-y-2 mb-4">
                      {subject.chapters.map((chapter) => (
                        <label key={chapter.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={chapter.completed}
                            onChange={() => toggleChapter(subject.id, chapter.id)}
                            className="w-5 h-5 rounded accent-violet-500"
                          />
                          <span className={chapter.completed ? 'line-through text-slate-500' : ''}>
                            {chapter.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-300 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Delete Subject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
