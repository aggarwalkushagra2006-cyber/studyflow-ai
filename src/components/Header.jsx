export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-20">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
            StudyFlow
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-violet-400">AI</span>
        </div>

        <a
          href="https://github.com/aggarwalkushagra2006-cyber/studyflow-ai"
          target="_blank"
          rel="noreferrer"
          className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg font-semibold transition"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
