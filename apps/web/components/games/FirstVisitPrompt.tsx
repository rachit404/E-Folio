"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import { useGameStore } from "@/lib/games/store";

/**
 * Asked once. "Just show me the portfolio" is the default (focused,
 * and what Escape does), so nobody has to play to read anything.
 */
export default function FirstVisitPrompt() {
  const theme = useTheme();

  const ready = useGameStore((state) => state.ready);
  const choice = useGameStore((state) => state.choice);
  const choose = useGameStore((state) => state.choose);

  const browseRef = useRef<HTMLButtonElement>(null);

  const visible =
    ready &&
    choice === "unset" &&
    theme.games.prompt &&
    Object.keys(theme.games.sections).length > 0;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    browseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        choose("browse");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, choose]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-void)]/85 p-6 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-prompt-title"
        className="comic-panel comic-enlarge w-full max-w-xl p-8 md:p-10"
      >
        <span className="comic-caption absolute -top-3 right-4">
          NEW CASE FILES
        </span>

        <p className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-primary)]">
          BEFORE YOU ENTER
        </p>

        <h2
          id="game-prompt-title"
          className="portfolio-display mt-4 text-4xl font-black leading-[0.9] tracking-tight md:text-5xl"
        >
          PLAY
          <br />
          <span className="text-[var(--color-accent)]">OR BROWSE?</span>
        </h2>

        <p className="mt-6 text-sm leading-7 text-[var(--color-muted)]">
          Some sections are case files: solve a quick puzzle to open the
          details. You can skip any puzzle, or switch games on and off per
          section, whenever you like.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            ref={browseRef}
            type="button"
            className="comic-button"
            onClick={() => choose("browse")}
          >
            Just show me the portfolio
          </button>

          <button
            type="button"
            className="comic-button comic-button--ghost"
            onClick={() => choose("play")}
          >
            Play the cases
          </button>
        </div>
      </div>
    </div>
  );
}
