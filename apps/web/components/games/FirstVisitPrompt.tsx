"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
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
        className="enlarge-in w-full max-w-lg"
      >
        <HoloCard tone="accent" bodyClassName="space-y-5 p-6 md:p-8">
          <p className="micro text-[var(--color-primary)]">Before you enter</p>

          <div id="game-prompt-title">
            <BrushTitle first="Play" second="or browse?" />
          </div>

          <p className="text-sm leading-6 text-[var(--color-white)]/80">
            Some sections are case files: solve a quick puzzle to open the
            details. You can skip any puzzle, switch games on or off per
            section, or use Interviewer mode to open everything at once.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              ref={browseRef}
              type="button"
              className="cta"
              onClick={() => choose("browse")}
            >
              Just show me the portfolio
            </button>

            <button
              type="button"
              className="cta-ghost"
              onClick={() => choose("play")}
            >
              Play the cases
            </button>
          </div>
        </HoloCard>
      </div>
    </div>
  );
}
