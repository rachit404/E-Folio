"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import {
  DECODE_HINTS,
  applyHint,
  assembled,
  pickWord,
  scramble,
  type GameProps,
  type LetterTile,
} from "./logic";

/**
 * Unscramble a word taken from the resume (a company or role).
 * Tap letters or type them; Backspace undoes; hints are limited by
 * difficulty.
 */
export default function SignalDecode({ difficulty, data, onWin }: GameProps) {
  const [word] = useState(() => pickWord(data.words));

  const [tiles] = useState<LetterTile[]>(() =>
    scramble(word).map((letter, id) => ({ id, letter })),
  );

  const [picked, setPicked] = useState<number[]>([]);
  const [hints, setHints] = useState(DECODE_HINTS[difficulty]);
  const [wrong, setWrong] = useState(false);

  const root = useRef<HTMLDivElement>(null);

  const evaluate = (next: number[]) => {
    if (next.length < word.length) {
      return;
    }

    if (assembled(tiles, next) === word) {
      onWin();

      return;
    }

    // Full length but wrong: shake, then clear for another try.
    setWrong(true);

    window.setTimeout(() => {
      setWrong(false);
      setPicked([]);
    }, 650);
  };

  const pick = (id: number) => {
    if (wrong || picked.includes(id) || picked.length >= word.length) {
      return;
    }

    const next = [...picked, id];

    setPicked(next);
    evaluate(next);
  };

  const undo = () => {
    if (!wrong) {
      setPicked((current) => current.slice(0, -1));
    }
  };

  const hint = () => {
    if (hints <= 0 || wrong) {
      return;
    }

    const next = applyHint(word, tiles, picked);

    setHints((current) => current - 1);
    setPicked(next);
    evaluate(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      undo();

      return;
    }

    if (/^[a-z]$/i.test(event.key)) {
      const letter = event.key.toUpperCase();

      const tile = tiles.find(
        (candidate) =>
          candidate.letter === letter && !picked.includes(candidate.id),
      );

      if (tile) {
        pick(tile.id);
      }
    }
  };

  return (
    <div
      ref={root}
      tabIndex={0}
      role="group"
      aria-label="Signal decode puzzle. Type letters or tap tiles."
      onKeyDown={onKeyDown}
      className="outline-none"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="micro text-[var(--color-primary)]">Decode the signal</p>

        <p className="micro text-[var(--color-muted)]" aria-live="polite">
          {`${picked.length}/${word.length}`}
        </p>
      </div>

      {/* Answer slots */}
      <div
        className={`mb-6 flex flex-wrap justify-center gap-2 ${wrong ? "shake" : ""}`}
        aria-live="polite"
      >
        {Array.from({ length: word.length }, (_, index) => {
          const id = picked[index];

          return (
            <span
              key={index}
              className={`brush flex h-12 w-10 items-center justify-center border text-xl ${
                wrong
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-[var(--color-primary)]/50 text-[var(--color-white)]"
              }`}
            >
              {id === undefined ? "" : tiles[id].letter}
            </span>
          );
        })}
      </div>

      {/* Scrambled tiles */}
      <div className="flex flex-wrap justify-center gap-2">
        {tiles.map((tile) => {
          const used = picked.includes(tile.id);

          return (
            <button
              key={tile.id}
              type="button"
              disabled={used}
              onClick={() => pick(tile.id)}
              aria-label={`Letter ${tile.letter}`}
              className="brush flex h-11 w-10 items-center justify-center border border-[var(--color-accent)] bg-[var(--color-void)]/60 text-lg text-[var(--color-white)] transition-opacity hover:bg-[var(--color-accent)]/30 disabled:opacity-25"
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="cta-ghost !px-3 !py-2" onClick={undo}>
          Undo
        </button>

        <button
          type="button"
          className="cta-ghost !px-3 !py-2"
          onClick={() => setPicked([])}
        >
          Clear
        </button>

        <button
          type="button"
          className="cta-ghost !px-3 !py-2 disabled:opacity-40"
          disabled={hints <= 0}
          onClick={hint}
        >
          {`Hint (${hints})`}
        </button>
      </div>
    </div>
  );
}
