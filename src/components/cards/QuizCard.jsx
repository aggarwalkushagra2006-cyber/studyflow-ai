import { useState } from 'react';

export default function QuizCard({ quiz }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz[index];

  function selectAnswer(option) {
    setAnswers((prev) => ({ ...prev, [index]: option }));
  }

  function calculateScore() {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) correct += 1;
    });
    return Math.round((correct / quiz.length) * 100);
  }

  if (submitted) {
    return (
      <article className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">❓ Quiz Results</h2>
        <div className="mt-4 rounded-xl bg-slate-800 p-5 text-center">
          <p className="text-sm text-slate-300">Your score</p>
          <p className="text-4xl font-black text-emerald-400">{calculateScore()}%</p>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setIndex(0);
            setAnswers({});
          }}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold"
        >
          Retake Quiz
        </button>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-blue-500/30 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">❓ Quiz</h2>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
          {index + 1}/{quiz.length}
        </span>
      </div>

      <p className="mb-4 font-semibold text-white">{currentQuestion.question}</p>

      <div className="space-y-2">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => selectAnswer(option)}
            className={`flex w-full items-center rounded-lg border px-3 py-3 text-left transition ${
              answers[index] === option
                ? 'border-blue-500 bg-blue-600/20 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
            }`}
          >
            <span className="mr-2 font-bold text-blue-400">{String.fromCharCode(65 + idx)}.</span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          disabled={index === 0}
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          className="flex-1 rounded-lg bg-slate-700 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        {index < quiz.length - 1 ? (
          <button
            onClick={() => setIndex((prev) => prev + 1)}
            className="flex-1 rounded-lg bg-slate-700 px-4 py-2"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold"
          >
            Submit
          </button>
        )}
      </div>
    </article>
  );
}
