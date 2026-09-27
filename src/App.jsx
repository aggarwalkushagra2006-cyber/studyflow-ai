:root {
  --bg: #0b1120;
  --bg-2: #111827;
  --panel: #111827;
  --panel-soft: #0f172a;
  --border: rgba(148, 163, 184, 0.18);
  --text: #e5e7eb;
  --muted: #94a3b8;
  --accent: #8b5cf6;
  --accent-2: #22c55e;
  --shadow: rgba(15, 23, 42, 0.25);
}

:root[data-theme='light'] {
  --bg: #f8fafc;
  --bg-2: #e2e8f0;
  --panel: #ffffff;
  --panel-soft: #f1f5f9;
  --border: rgba(15, 23, 42, 0.08);
  --text: #0f172a;
  --muted: #475569;
  --accent: #7c3aed;
  --accent-2: #16a34a;
  --shadow: rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, var(--bg), var(--bg-2));
  color: var(--text);
}

body {
  min-height: 100vh;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg), var(--bg-2));
  color: var(--text);
}

.sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid var(--border);
  padding: 20px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 10px 25px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), #4f46e5);
  color: white;
  font-weight: 900;
  font-size: 1.2rem;
}

.brand-title {
  font-size: 1.2rem;
  font-weight: 800;
}

.brand-subtitle {
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.nav-item {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  border-radius: 12px;
  padding: 11px 12px;
  text-align: left;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.3);
  color: #c4b5fd;
}

.main-panel {
  flex: 1;
  padding: 30px 28px 80px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header-kicker {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 700;
}

.header-title {
  margin: 8px 0 0;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  font-weight: 900;
}

.topbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.lang-select,
.theme-toggle {
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 12px;
}

.notice-banner {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #bbf7d0;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 18px;
}

.panel {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 18px 45px var(--shadow);
}

.panel-title {
  font-weight: 800;
  font-size: 1.15rem;
  margin-bottom: 16px;
}

.stat-card {
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border);
}

.stat-card.violet { background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(79, 70, 229, 0.15)); }
.stat-card.green { background: linear-gradient(135deg, rgba(34, 197, 94, 0.16), rgba(16, 185, 129, 0.12)); }
.stat-card.amber { background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(251, 146, 60, 0.12)); }
.stat-card.blue { background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(14, 165, 233, 0.12)); }

.stat-label {
  color: var(--muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-value {
  margin-top: 8px;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
}

.empty-state {
  text-align: center;
  color: var(--muted);
  padding: 28px 12px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px dashed var(--border);
  border-radius: 16px;
}

.info-block {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}

.info-block h4 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.info-block ul {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.flashcard-wrap {
  height: 240px;
  perspective: 1000px;
  cursor: pointer;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s ease;
}

.flashcard-inner.flipped {
  transform: rotateY(180deg);
}

.flashcard-front, .flashcard-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  box-shadow: 0 20px 30px rgba(0,0,0,0.15);
}

.flashcard-front {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
}

.flashcard-back {
  background: linear-gradient(135deg, #16a34a, #10b981);
  transform: rotateY(180deg);
}

.timer-floating {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 50;
}

.timer-box {
  width: min(320px, 85vw);
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 16px;
}

.timer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 12px;
}

.mini-btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.72rem;
}

.timer-display {
  margin: 10px 0 18px;
  text-align: center;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: #c4b5fd;
  font-variant-numeric: tabular-nums;
}

.timer-presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.preset-btn {
  border: 1px solid var(--border);
  background: var(--panel-soft);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.timer-controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.start-btn, .reset-btn, .save-btn {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 10px 8px;
  font-weight: 800;
}

.start-btn { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; }
.reset-btn { background: #334155; color: #fff; }
.save-btn { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }

@media (max-width: 980px) {
  .app-shell {
    display: block;
  }

  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .nav-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .main-panel {
    padding: 18px 14px 90px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .nav-list {
    grid-template-columns: 1fr;
  }
}

input, select, textarea {
  color-scheme: light dark;
}

[theme='light'] .panel {
  background: rgba(255,255,255,0.9);
}

