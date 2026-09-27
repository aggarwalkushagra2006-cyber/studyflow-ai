import SummaryCard from './cards/SummaryCard';
import FlashcardsCard from './cards/FlashcardsCard';
import QuizCard from './cards/QuizCard';

export default function ResultsSection({ result, loading }) {
  if (!result && !loading) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-slate-200">Your study pack will appear here.</h2>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center text-slate-300">
        <div className="inline-block animate-spin text-4xl">✨</div>
        <p className="mt-4 text-lg font-semibold">AI is creating your study pack...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {result?.summary && <SummaryCard summary={result.summary} />}
      {result?.flashcards?.length > 0 && <FlashcardsCard flashcards={result.flashcards} />}
      {result?.quiz?.length > 0 && <QuizCard quiz={result.quiz} />}
    </section>
  );
}
