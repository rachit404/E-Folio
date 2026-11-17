"use client";

import { useState } from "react";

import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import type { Difficulty, GameId } from "@/lib/theme";

import MemoryMatch from "./MemoryMatch";
import SignalDecode from "./SignalDecode";
import TargetPractice from "./TargetPractice";
import type { GameData } from "./logic";

interface CaseFileProps {
  number: string;
  label: string;
  game: GameId;
  difficulty: Difficulty;
  data: GameData;
  /** Solved: open the section. */
  onOpen: () => void;
}

const COPY: Record<GameId, { name: string; hint: string }> = {
  match: {
    name: "Memory match",
    hint: "Match the pairs to open the file.",
  },
  decode: {
    name: "Signal decode",
    hint: "Unscramble the signal to open the file.",
  },
  target: {
    name: "Target practice",
    hint: "Hit the targets before time runs out.",
  },
};

/**
 * A locked section. Collapsed it is a small card; "Open the case"
 * enlarges it in place into the puzzle, and closing collapses it back.
 * Skipping is always one click away.
 */
export default function CaseFile({
  number,
  label,
  game,
  difficulty,
  data,
  onOpen,
}: CaseFileProps) {
  const [expanded, setExpanded] = useState(false);
  const [solved, setSolved] = useState(false);

  const copy = COPY[game];

  const Game =
    game === "match"
      ? MemoryMatch
      : game === "decode"
        ? SignalDecode
        : TargetPractice;

  return (
    <div className="flex h-full items-center">
      <HoloCard
        tone="accent"
        className={`comic-enlarge w-full ${expanded ? "max-w-[46rem]" : "max-w-[34rem]"}`}
        bodyClassName="space-y-5 p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <SectionChip number={number} label={label} />

          <p className="micro text-[var(--color-accent)]">
            {solved ? "Case solved" : "Evidence locked"}
          </p>
        </div>

        {!expanded && (
          <>
            <BrushTitle first={label} second="Case file" />

            <p className="text-sm leading-6 text-[var(--color-white)]/80">
              {copy.hint}
            </p>

            <div aria-hidden="true" className="space-y-2">
              <span className="comic-redacted w-4/5" />
              <span className="comic-redacted w-3/5" />
              <span className="comic-redacted w-2/3" />
            </div>
          </>
        )}

        {expanded && !solved && (
          <Game
            difficulty={difficulty}
            data={data}
            onWin={() => setSolved(true)}
          />
        )}

        {solved && (
          <div className="space-y-3">
            <BrushTitle first="Case" second="solved" />

            <p className="text-sm leading-6 text-[var(--color-white)]/80">
              The evidence is yours.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          {solved ? (
            <button type="button" className="cta" onClick={onOpen} autoFocus>
              Open the evidence
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <>
              {!expanded ? (
                <button
                  type="button"
                  className="cta"
                  onClick={() => setExpanded(true)}
                >
                  Open the case
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="cta-ghost"
                  onClick={() => setExpanded(false)}
                >
                  Close the case
                </button>
              )}

              <button type="button" className="cta-ghost" onClick={onOpen}>
                Skip, show me this section
              </button>
            </>
          )}
        </div>
      </HoloCard>
    </div>
  );
}
