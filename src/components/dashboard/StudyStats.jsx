import { useEffect, useState } from 'react';

export default function StudyStats({ stats, subjects }) {
  const [dailyStats, setDailyStats] = useState({});
  const [weeklyStats, setWeeklyStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  function loadStats() {
    const daily = localStorage.getItem('dailyStats');
    const weekly = localStorage.getItem('weeklyStats');
    if (daily) setDailyStats(JSON.parse(daily));
    if (weekly) setWeeklyStats(JSON.parse(weekly));
  }

  const today = new Date().toISOString().split('T')[0];
  const todayMinutes = dailyStats[today] || 0;

  // Calculate weekly stats
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const weeklyMinutes = last7Days.reduce((sum, date) => sum + (dailyStats[date] || 0), 0);

  // Subject-wise stats
  const subjectStats = subjects.map((subject) => ({
    name: subject.name,
    progress: Math.round((subject.completedChapters / subject.totalChapters) * 100),
    hoursSpent: subject.hoursSpent || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-900 to-violet-800 border border-violet-700 rounded-xl p-6">
          <p className="text-sm text-violet-200 mb-2">Today's Study Time</p>
          <p className="text-4xl font-black text-violet-300">{todayMinutes}</p>
          <p className="text-xs text-violet-300 mt-1">minutes</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-xl p-6">
          <p className="text-sm text-blue-200 mb-2">Weekly Study Time</p>
          <p className="text-4xl font-black text-blue-300">{weeklyMinutes}</p>
          <p className="text-xs text-blue-300 mt-1">minutes</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-xl p-6">
          <p className="text-sm text-green-200 mb-2">Total Sessions</p>
          <p className="text-4xl font-black text-green-300">{stats.totalSessions}</p>
          <p className="text-xs text-green-300 mt-1">study sessions</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900 to-amber-800 border border-amber-700 rounded-xl p-6">
          <p className="text-sm text-amber-200 mb-2">Subjects in Progress</p>
          <p className="text-4xl font-black text-amber-300">{subjects.length}</p>
          <p className="text-xs text-amber-300 mt-1">active subjects</p>
        </div>
      </div>

      {/* Daily Study Chart */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">📅 Last 7 Days Study Time</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {last7Days.map((date, idx) => {
            const minutes = dailyStats[date] || 0;
            const maxMinutes = Math.max(...last7Days.map((d) => dailyStats[d] || 0), 60);
            const height = (minutes / maxMinutes) * 100;
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={date} className="flex-1 flex flex-col items-center">
                <div className="text-sm text-slate-300 mb-2 font-semibold">{minutes}m</div>
                <div className="w-full bg-slate-700 rounded-t-lg" style={{ height: `${Math.max(height, 10)}%` }} />
                <p className="text-xs text-slate-500 mt-2">{dayName}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">📚 Subject-wise Progress</h3>
        <div className="space-y-4">
          {subjects.length === 0 ? (
            <p className="text-slate-400 text-center py-6">No subjects to display</p>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{subject.name}</p>
                  <p className="text-sm text-slate-400">{subject.completedChapters}/{subject.totalChapters} chapters</p>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${(subject.completedChapters / subject.totalChapters) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
