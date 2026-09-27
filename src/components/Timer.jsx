import { useState, useEffect } from 'react';

const PRESETS = [
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
];

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            playNotification();
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  function playNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Timer Complete!', {
        body: 'Great work! Time for a break.',
        icon: '✨'
      });
    }
    // Fallback audio
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==');
    audio.play().catch(() => {});
  }

  function handleSetCustom() {
    const val = parseInt(customMinutes);
    if (val > 0) {
      setMinutes(val);
      setSeconds(0);
      setIsRunning(false);
      setShowCustom(false);
      setCustomMinutes('');
    }
  }

  function resetTimer() {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
  }

  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-indigo-500 rounded-2xl p-6 shadow-2xl shadow-indigo-500/20 w-80">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">⏱️</span> Study Timer
        </h3>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-black text-indigo-400 font-mono mb-2">{displayTime}</div>
          <p className="text-sm text-slate-400">Focus time remaining</p>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setMinutes(preset.value);
                setSeconds(0);
                setIsRunning(false);
              }}
              className="bg-slate-700 hover:bg-indigo-600 text-xs font-semibold py-2 rounded transition"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Duration */}
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="w-full text-xs text-indigo-300 py-2 mb-4 hover:text-indigo-200"
          >
            + Custom Duration
          </button>
        ) : (
          <div className="mb-4 flex gap-2">
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              placeholder="Minutes"
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-2 text-sm text-white"
            />
            <button
              onClick={handleSetCustom}
              className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded text-xs font-semibold"
            >
              Set
            </button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-2 rounded font-semibold text-sm transition ${
              isRunning
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded font-semibold text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
