import { useEffect, useMemo, useState } from 'react';

const NAV = ['Dashboard', 'Study Planner', 'My Subjects', 'Study Timer', 'Analytics', 'Settings'];
const KEY = 'studyflow-data';
const initialData = { theme: 'dark', subjects: [], plan: [], stats: { daily: {}, sessions: 0, streak: 0 } };

function readData() { try { return { ...initialData, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return initialData; } }
function id() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function today() { return new Date().toISOString().slice(0, 10); }

export default function App() {
  const [data, setData] = useState(readData);
  const [page, setPage] = useState('Dashboard');
  const [timer, setTimer] = useState({ minutes: 25, left: 0, running: false });
  const [notice, setNotice] = useState('');
  const [planner, setPlanner] = useState({ exam: '', hours: 2, session: 45 });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(data)); document.documentElement.dataset.theme = data.theme; }, [data]);
  useEffect(() => {
    if (!timer.running) return undefined;
    const handle = setInterval(() => setTimer((current) => {
      if (current.left > 0) return { ...current, left: current.left - 1 };
      const minutes = current.minutes;
      recordSession(minutes);
      if ('Notification' in window && Notification.permission === 'granted') new Notification('Study session complete', { body: `${minutes} minutes added to your progress.` });
      setNotice(`Session complete — ${minutes} minutes saved.`);
      return { ...current, running: false };
    }), 1000);
    return () => clearInterval(handle);
  }, [timer.running]);

  const totals = useMemo(() => {
    const chapters = data.subjects.reduce((n, s) => n + s.chapters.length, 0);
    const complete = data.subjects.reduce((n, s) => n + s.chapters.filter((c) => c.status === 'Completed').length, 0);
    const minutes = Object.values(data.stats.daily || {}).reduce((n, x) => n + x, 0);
    return { chapters, complete, progress: chapters ? Math.round((complete / chapters) * 100) : 0, minutes };
  }, [data]);

  function update(mutator) { setData((current) => mutator({ ...current, subjects: current.subjects.map((s) => ({ ...s, chapters: [...s.chapters] })), stats: { ...current.stats, daily: { ...current.stats.daily } } })); }
  function recordSession(minutes) { update((current) => { const date = today(); return { ...current, stats: { ...current.stats, daily: { ...current.stats.daily, [date]: (current.stats.daily[date] || 0) + minutes }, sessions: current.stats.sessions + 1, streak: current.stats.streak + 1 } }; }); }
  function addSubject() {
    const name = window.prompt('Subject name'); const count = Number(window.prompt('Number of chapters'));
    if (!name || !count) return;
    update((current) => ({ ...current, subjects: [...current.subjects, { id: id(), name, time: 0, score: 0, chapters: Array.from({ length: count }, (_, i) => ({ id: id(), name: `Chapter ${i + 1}`, status: 'Not Started' })) }] }));
    setNotice(`${name} added to your study space.`);
  }
  function toggleChapter(subjectId, chapterId, status) { update((current) => ({ ...current, subjects: current.subjects.map((s) => s.id === subjectId ? { ...s, chapters: s.chapters.map((c) => c.id === chapterId ? { ...c, status } : c) } : s) })); }
  function generatePlan() {
    if (!planner.exam || !data.subjects.length) { setNotice('Add subjects and choose an exam date first.'); return; }
    const days = Math.max(1, Math.ceil((new Date(planner.exam) - new Date()) / 86400000));
    const tasks = data.subjects.flatMap((s) => s.chapters.filter((c) => c.status !== 'Completed').map((c) => ({ subject: s.name, chapter: c.name, duration: Number(planner.session), priority: 'High', done: false })));
    const perDay = Math.max(1, Math.ceil(tasks.length / days));
    const plan = Array.from({ length: Math.min(days, Math.ceil(tasks.length / perDay)) }, (_, day) => { const date = new Date(); date.setDate(date.getDate() + day); return { date: date.toISOString().slice(0, 10), tasks: tasks.slice(day * perDay, (day + 1) * perDay) }; });
    setData((current) => ({ ...current, plan })); setPage('Study Planner'); setNotice('Personalized plan generated from your pending chapters.');
  }
  function setTimer(minutes) { setTimer({ minutes, left: minutes * 60, running: false }); }
  function timerDisplay() { return `${String(Math.floor(timer.left / 60)).padStart(2, '0')}:${String(timer.left % 60).padStart(2, '0')}`; }

  return <div className="app-shell">
    <div className="orb orb-one" /><div className="orb orb-two" />
    <aside className="sidebar"><div className="brand"><span className="brand-icon">S</span><div><b>StudyFlow</b><small>AI learning OS</small></div></div><nav>{NAV.map((item) => <button className={page === item ? 'nav-active' : ''} onClick={() => setPage(item)} key={item}><span>{({ Dashboard: '⌂', 'Study Planner': '◈', 'My Subjects': '◉', 'Study Timer': '◷', Analytics: '◌', Settings: '⚙' })[item]}</span>{item}</button>)}</nav><div className="sidebar-tip"><b>Daily focus</b><small>Small sessions compound into big results.</small></div></aside>
    <main className="content"><header className="topbar"><div><small className="eyebrow">PERSONAL LEARNING SPACE</small><h1>{page}</h1></div><div className="top-actions"><span className="live-dot">● Synced locally</span><button className="theme-button" onClick={() => setData((d) => ({ ...d, theme: d.theme === 'dark' ? 'light' : 'dark' }))}>{data.theme === 'dark' ? '☀ Light' : '☾ Dark'}</button></div></header>{notice && <div className="notice">✓ {notice}</div>}{page === 'Dashboard' && <Dashboard data={data} totals={totals} setPage={setPage} />}{page === 'Study Planner' && <Planner data={data} planner={planner} setPlanner={setPlanner} generatePlan={generatePlan} />}{page === 'My Subjects' && <Subjects data={data} addSubject={addSubject} toggleChapter={toggleChapter} />}{page === 'Study Timer' && <Timer timer={timer} setTimer={setTimer} setTimerPreset={setTimer} display={timerDisplay()} record={recordSession} />}{page === 'Analytics' && <Analytics data={data} totals={totals} />}{page === 'Settings' && <Settings data={data} setData={setData} />}</main>
  </div>;
}

function Dashboard({ data, totals, setPage }) { const todayMinutes = data.stats.daily[today()] || 0; return <div className="stack"><section className="hero-card"><div><small className="eyebrow">YOUR MOMENTUM</small><h2>Make today count.</h2><p>A calm, focused workspace for turning study time into measurable progress.</p><button className="primary" onClick={() => setPage('Study Planner')}>Open study planner →</button></div><div className="ring" style={{ '--progress': `${totals.progress * 3.6}deg` }}><strong>{totals.progress}%</strong><span>complete</span></div></section><div className="stat-grid"><Stat label="Progress" value={`${totals.progress}%`} icon="↗" /><Stat label="Study time" value={`${totals.minutes}m`} icon="◷" /><Stat label="Today" value={`${todayMinutes}m`} icon="✦" /><Stat label="Streak" value={`${data.stats.streak}d`} icon="♢" /></div><div className="two-col"><section className="card"><Title text="Subject progress" action="Manage subjects" onClick={() => setPage('My Subjects')} />{data.subjects.length ? data.subjects.map((s) => { const done = s.chapters.filter((c) => c.status === 'Completed').length; const percent = Math.round(done / s.chapters.length * 100); return <div className="progress-item" key={s.id}><div className="label-row"><b>{s.name}</b><span>{done}/{s.chapters.length} · {percent}%</span></div><div className="progress-track"><i style={{ width: `${percent}%` }} /></div></div>; }) : <Empty text="Add a subject to see progress here." />}</section><section className="card"><Title text="Upcoming focus" action="View plan" onClick={() => setPage('Study Planner')} />{data.plan.length ? data.plan[0].tasks.map((task, i) => <div className="focus-row" key={i}><span className="focus-number">0{i + 1}</span><div><b>{task.subject}</b><small>{task.chapter} · {task.duration} min</small></div><em>{task.priority}</em></div>) : <Empty text="Your next focused tasks will appear here." />}</section></div></div>; }
function Planner({ data, planner, setPlanner, generatePlan }) { return <div className="stack"><section className="hero-card planner-hero"><div><small className="eyebrow">SMART PLANNING</small><h2>Your plan, made realistic.</h2><p>Distribute pending chapters across the days you actually have available.</p></div><div className="planner-form"><input type="date" value={planner.exam} onChange={(e) => setPlanner({ ...planner, exam: e.target.value })} /><label><input type="number" min="1" value={planner.hours} onChange={(e) => setPlanner({ ...planner, hours: e.target.value })} /> hrs/day</label><label><input type="number" min="15" value={planner.session} onChange={(e) => setPlanner({ ...planner, session: e.target.value })} /> min/session</label><button className="primary" onClick={generatePlan}>Generate plan</button></div></section>{data.plan.length ? <div className="plan-grid">{data.plan.map((day) => <section className="card day-card" key={day.date}><div className="day-heading"><div><small>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</small><h3>{new Date(day.date).toLocaleDateString()}</h3></div><span>{day.tasks.length} tasks</span></div>{day.tasks.map((task, i) => <div className="plan-task" key={i}><span className="task-check">{task.done ? '✓' : '○'}</span><div><b>{task.subject}</b><small>{task.chapter} · {task.duration} min</small></div><em className="priority">{task.priority}</em></div>)}</section>)}</div> : <Empty text="Generate a plan to see your day-by-day schedule." />}</div>; }
function Subjects({ data, addSubject, toggleChapter }) { return <div className="stack"><div className="section-heading"><div><small className="eyebrow">YOUR CURRICULUM</small><h2>Subjects & chapters</h2></div><button className="primary" onClick={addSubject}>+ Add subject</button></div>{data.subjects.length ? data.subjects.map((s) => <section className="card" key={s.id}><div className="subject-heading"><div><h3>{s.name}</h3><small>{s.chapters.filter((c) => c.status === 'Completed').length} of {s.chapters.length} completed</small></div><span className="subject-score">{Math.round(s.chapters.filter((c) => c.status === 'Completed').length / s.chapters.length * 100)}%</span></div><div className="chapter-grid">{s.chapters.map((c) => <div className="chapter-row" key={c.id}><span>{c.name}</span><select value={c.status} onChange={(e) => toggleChapter(s.id, c.id, e.target.value)}><option>Not Started</option><option>In Progress</option><option>Completed</option></select></div>)}</div></section>) : <Empty text="No subjects yet. Add your first subject to begin." />}</div>; }
function Timer({ timer, setTimerPreset, display, record }) { return <div className="timer-card card"><div className="timer-top"><div><small className="eyebrow">DEEP WORK</small><h2>Focus timer</h2></div><span className="timer-status">● Ready</span></div><div className="timer-face">{display}</div><div className="preset-row">{PRESETS.map((p) => <button onClick={() => setTimerPreset(p)} key={p}>{p}m</button>)}</div><div className="timer-actions"><button className="primary" onClick={() => setTimerPreset(timer.minutes)}>{timer.running ? 'Pause' : 'Start'}</button><button className="secondary" onClick={() => { record(timer.minutes); }}>Save session</button><button className="secondary" onClick={() => setTimerPreset(25)}>Reset</button></div><p className="muted">Sessions are saved to your dashboard automatically.</p></div>; }
function Analytics({ data, totals }) { const bars = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); const key = d.toISOString().slice(0, 10); return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), value: data.stats.daily[key] || 0 }; }); const max = Math.max(...bars.map((b) => b.value), 60); return <div className="stack"><div className="stat-grid"><Stat label="All-time study" value={`${totals.minutes}m`} icon="◷" /><Stat label="Sessions" value={data.stats.sessions} icon="✦" /><Stat label="Streak" value={`${data.stats.streak} days`} icon="♢" /></div><section className="card"><Title text="Study activity" /><div className="chart">{bars.map((b) => <div className="chart-bar" key={b.day}><b>{b.value}m</b><i style={{ height: `${Math.max(7, b.value / max * 100)}%` }} /><small>{b.day}</small></div>)}</div></section></div>; }
function Settings({ data, setData }) { return <section className="card settings"><Title text="Preferences" /><div className="setting-row"><div><b>Appearance</b><small>Choose the visual mode for your workspace.</small></div><button className="secondary" onClick={() => setData({ ...data, theme: data.theme === 'dark' ? 'light' : 'dark' })}>{data.theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</button></div><div className="setting-row"><div><b>Local persistence</b><small>Your subjects, planner, and statistics are saved in this browser.</small></div><span className="pill">Active</span></div></section>; }
function Stat({ label, value, icon }) { return <div className="stat-card"><span className="stat-icon">{icon}</span><small>{label}</small><strong>{value}</strong></div>; }
function Title({ text, action, onClick }) { return <div className="card-title"><h3>{text}</h3>{action && <button onClick={onClick}>{action} →</button>}</div>; }
function Empty({ text }) { return <div className="empty">{text}</div>; }
