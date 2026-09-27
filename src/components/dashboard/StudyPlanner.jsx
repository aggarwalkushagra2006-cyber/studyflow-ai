import { useState } from 'react';

export default function StudyPlanner({ subjects, onUpdate, onStatsUpdate }) {
  const [showPlanner, setShowPlanner] = useState(false);
  const [planData, setPlanData] = useState({
    examDate: '',
    dailyStudyTime: 2,
    preferredSessionDuration: 30,
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);

  function calculateStudyPlan() {
    if (!planData.examDate) {
      alert('Please select an exam date');
      return;
    }

    const today = new Date();
    const examDate = new Date(planData.examDate);
    const daysRemaining = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      alert('Please select a future date');
      return;
    }

    const totalChapters = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
    const chaptersPerDay = Math.ceil(totalChapters / daysRemaining);
    const sessionsPerDay = Math.ceil((planData.dailyStudyTime * 60) / planData.preferredSessionDuration);

    // Create day-by-day plan
    const plan = [];
    let chapterIndex = 0;
    let subjectIndex = 0;

    for (let day = 0; day < daysRemaining; day++) {
      const planDate = new Date(today);
      planDate.setDate(planDate.getDate() + day);

      const dayPlan = {
        date: planDate.toISOString().split('T')[0],
        dayNumber: day + 1,
        chapters: [],
        sessions: sessionsPerDay,
        completed: false,
      };

      // Assign chapters to this day
      for (let i = 0; i < chaptersPerDay && subjectIndex < subjects.length; i++) {
        const subject = subjects[subjectIndex];
        if (chapterIndex < subject.totalChapters) {
          dayPlan.chapters.push({
            subjectName: subject.name,
            chapterNumber: chapterIndex + 1,
            completed: false,
          });
          chapterIndex++;
        } else {
          subjectIndex++;
          chapterIndex = 0;
          if (subjectIndex < subjects.length) {
            i--; // Retry with next subject
          }
        }
      }

      if (dayPlan.chapters.length > 0) {
        plan.push(dayPlan);
      }
    }

    setGeneratedPlan({
      plan,
      daysRemaining,
      totalChapters,
      chaptersPerDay,
      sessionsPerDay,
    });
  }

  function markDayComplete(dayIndex) {
    const updatedPlan = [...generatedPlan.plan];
    updatedPlan[dayIndex].completed = !updatedPlan[dayIndex].completed;
    setGeneratedPlan({ ...generatedPlan, plan: updatedPlan });

    // Update subjects
    const updatedSubjects = subjects.map((subject) => {
      updatedPlan[dayIndex].chapters.forEach((chapter) => {
        if (chapter.subjectName === subject.name) {
          const chapter_idx = subject.chapters.findIndex((ch) => ch.id === chapter.chapterNumber);
          if (chapter_idx >= 0 && updatedPlan[dayIndex].completed) {
            subject.chapters[chapter_idx].completed = true;
            subject.completedChapters = subject.chapters.filter((ch) => ch.completed).length;
          }
        }
      });
      return subject;
    });
    onUpdate(updatedSubjects);

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');
    dailyStats[today] = (dailyStats[today] || 0) + planData.dailyStudyTime * 60;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
  }

  return (
    <div className="space-y-6">
      {!showPlanner && !generatedPlan ? (
        <button
          onClick={() => setShowPlanner(true)}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg transition"
        >
          🗓️ Create Study Plan
        </button>
      ) : null}

      {/* Input Form */}
      {showPlanner && !generatedPlan && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4">Create Your Study Plan</h3>

          <div>
            <label className="block text-sm font-semibold mb-2">📅 Exam Date</label>
            <input
              type="date"
              value={planData.examDate}
              onChange={(e) => setPlanData({ ...planData, examDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">⏰ Daily Study Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={planData.dailyStudyTime}
                  onChange={(e) => setPlanData({ ...planData, dailyStudyTime: parseFloat(e.target.value) })}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                />
                <span className="text-slate-400">hours</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">🎯 Session Duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={planData.preferredSessionDuration}
                  onChange={(e) => setPlanData({ ...planData, preferredSessionDuration: parseInt(e.target.value) })}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                />
                <span className="text-slate-400">min</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateStudyPlan}
              className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition"
            >
              Generate Plan
            </button>
            <button
              onClick={() => setShowPlanner(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Generated Plan */}
      {generatedPlan && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Your Study Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Days Remaining</p>
                <p className="text-3xl font-black text-violet-400">{generatedPlan.daysRemaining}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Total Chapters</p>
                <p className="text-3xl font-black text-blue-400">{generatedPlan.totalChapters}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Per Day</p>
                <p className="text-3xl font-black text-green-400">{generatedPlan.chaptersPerDay}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Sessions/Day</p>
                <p className="text-3xl font-black text-amber-400">{generatedPlan.sessionsPerDay}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setGeneratedPlan(null);
                setShowPlanner(false);
              }}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              ← Back
            </button>
          </div>

          {/* Daily Schedule */}
          <div className="space-y-3">
            {generatedPlan.plan.slice(0, 7).map((day, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 cursor-pointer transition ${
                  day.completed
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => markDayComplete(idx)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold mb-2">
                      {day.completed ? '✅' : '📅'} Day {day.dayNumber} ({new Date(day.date).toLocaleDateString()})
                    </h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      {day.chapters.map((ch, i) => (
                        <p key={i} className={day.completed ? 'line-through text-slate-500' : ''}>
                          • {ch.subjectName} - Chapter {ch.chapterNumber}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                      {day.sessions} sessions
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
