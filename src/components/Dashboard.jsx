import { useState, useEffect } from 'react';
import SubjectProgress from './dashboard/SubjectProgress';
import StudyStats from './dashboard/StudyStats';
import StudyPlanner from './dashboard/StudyPlanner';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('progress');
  const [subjects, setSubjects] = useState([]);
  const [studyStats, setStudyStats] = useState({
    todayMinutes: 0,
    weeklyMinutes: 0,
    totalSessions: 0,
    lastSession: null,
  });

  useEffect(() => {
    loadSubjects();
    loadStudyStats();
  }, []);

  function loadSubjects() {
    const stored = localStorage.getItem('subjects');
    if (stored) setSubjects(JSON.parse(stored));
  }

  function loadStudyStats() {
    const stored = localStorage.getItem('studyStats');
    if (stored) setStudyStats(JSON.parse(stored));
  }

  function updateSubjects(newSubjects) {
    setSubjects(newSubjects);
    localStorage.setItem('subjects', JSON.stringify(newSubjects));
  }

  function updateStats(newStats) {
    setStudyStats(newStats);
    localStorage.setItem('studyStats', JSON.stringify(newStats));
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-black mb-4">📊 Study Dashboard</h1>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'progress'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              📈 Progress
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'stats'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              📉 Statistics
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'planner'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              🗓️ Study Planner
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'progress' && (
          <SubjectProgress subjects={subjects} onUpdate={updateSubjects} />
        )}
        {activeTab === 'stats' && (
          <StudyStats stats={studyStats} subjects={subjects} />
        )}
        {activeTab === 'planner' && (
          <StudyPlanner subjects={subjects} onUpdate={updateSubjects} onStatsUpdate={updateStats} />
        )}
      </div>
    </div>
  );
}
