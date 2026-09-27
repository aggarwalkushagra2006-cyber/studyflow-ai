export default function Header({ currentPage, onPageChange }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-20">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              StudyFlow
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-violet-400">AI</span>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onPageChange('home')}
            className={`font-semibold transition ${
              currentPage === 'home'
                ? 'text-violet-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📚 Study
          </button>
          <button
            onClick={() => onPageChange('dashboard')}
            className={`font-semibold transition ${
              currentPage === 'dashboard'
                ? 'text-violet-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📊 Dashboard
          </button>
          <a
            href="https://github.com/aggarwalkushagra2006-cyber/studyflow-ai"
            target="_blank"
            rel="noreferrer"
            className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg font-semibold transition"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
