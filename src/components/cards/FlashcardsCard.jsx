import { useState } from 'react';

export default function FlashcardsCard({ flashcards }) {
  const [index, setIndex] = useState(0);

  return (
    <article className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">🎴 Flashcards</h2>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
          {index + 1}/{flashcards.length}
        </span>
      </div>

      <CardItem card={flashcards[index]} />

      <div className="mt-4 flex gap-3">
        <button
          disabled={index === 0}
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          className="flex-1 rounded-lg bg-slate-700 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={index === flashcards.length - 1}
          onClick={() => setIndex((prev) => Math.min(flashcards.length - 1, prev + 1))}
          className="flex-1 rounded-lg bg-slate-700 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </article>
  );
}

function CardItem({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className={`flip-card h-48 w-full cursor-pointer ${flipped ? 'flipped' : ''}`}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front flex items-center justify-center rounded-xl bg-violet-600 p-6 text-center">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-violet-200">Question</p>
            <p className="text-lg font-bold">{card.question}</p>
          </div>
        </div>

        <div className="flip-card-back flex items-center justify-center rounded-xl bg-emerald-600 p-6 text-center">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-emerald-200">Answer</p>
            <p className="text-lg font-bold">{card.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
