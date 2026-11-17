"use client";

import { useEffect, useState } from "react";

import {
  buildDeck,
  flipCard,
  initialMemoryState,
  isMemoryWon,
  resolveMismatch,
  type GameProps,
} from "./logic";

/**
 * Flip two cards at a time and match the pairs. Labels come from the
 * section's own data (skills).
 */
export default function MemoryMatch({ difficulty, data, onWin }: GameProps) {
  const [deck] = useState(() => buildDeck(data.labels, difficulty));

  const [state, setState] = useState(initialMemoryState);

  const waiting = state.flipped.length === 2;

  /* Turn a mismatched pair face down after a short look. */
  useEffect(() => {
    if (!waiting) {
      return;
    }

    const timer = window.setTimeout(
      () => setState((current) => resolveMismatch(current)),
      800,
    );

    return () => window.clearTimeout(timer);
  }, [waiting]);

  const handleFlip = (index: number) => {
    const next = flipCard(state, deck, index);

    if (next === state) {
      return;
    }

    setState(next);

    if (isMemoryWon(next, deck)) {
      onWin();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="micro text-[var(--color-primary)]">Match the pairs</p>

        <p className="micro text-[var(--color-muted)]" aria-live="polite">
          {`Moves ${String(state.moves).padStart(2, "0")} // ${state.matched.length}/${deck.length / 2}`}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {deck.map((card, index) => {
          const matched = state.matched.includes(card.pairId);

          const faceUp = matched || state.flipped.includes(index);

          return (
            <button
              key={card.id}
              type="button"
              disabled={matched}
              aria-label={faceUp ? card.label : "Hidden card"}
              onClick={() => handleFlip(index)}
              className={[
                "micro flex h-[clamp(3rem,9svh,4.75rem)] items-center justify-center border px-1 text-center leading-tight transition-all duration-150",
                faceUp
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/90 text-[var(--color-void)]"
                  : "border-[var(--color-primary)]/40 bg-[var(--color-void)]/60 text-[var(--color-primary)]/60 hover:border-[var(--color-primary)]",
                matched ? "opacity-60" : "",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-white)]",
              ].join(" ")}
            >
              {faceUp ? card.label : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
