export default function SummaryCard({ summary }) {
  return (
    <article className="rounded-2xl border border-violet-500/30 bg-slate-900 p-6 shadow-lg shadow-violet-950/20">
      <h2 className="mb-3 text-xl font-bold">📋 Summary</h2>
      <p className="leading-7 text-slate-300">{summary}</p>
    </article>
  );
}
