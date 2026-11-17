"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  TARGET_SETTINGS,
  randomPosition,
  type GameProps,
  type TargetPosition,
} from "./logic";

type Phase = "ready" | "running" | "won" | "lost";

interface Target extends TargetPosition {
  id: number;
}

/**
 * Hit the targets before the time runs out. One target at a time,
 * each stays briefly. Targets are real buttons, so Tab + Enter plays
 * it without a mouse.
 */
export default function TargetPractice({ difficulty, onWin }: GameProps) {
  const settings = TARGET_SETTINGS[difficulty];

  const [phase, setPhase] = useState<Phase>("ready");
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.seconds);
  const [target, setTarget] = useState<Target | null>(null);

  const nextId = useRef(0);
  const remaining = useRef(settings.seconds);

  const spawn = useCallback(() => {
    setTarget({ id: nextId.current++, ...randomPosition() });
  }, []);

  const start = () => {
    remaining.current = settings.seconds;

    setHits(0);
    setTimeLeft(settings.seconds);
    setPhase("running");

    spawn();
  };

  /* Round clock. */
  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const timer = window.setInterval(() => {
      remaining.current = Math.max(0, +(remaining.current - 0.1).toFixed(1));

      setTimeLeft(remaining.current);

      if (remaining.current <= 0) {
        window.clearInterval(timer);

        setPhase("lost");
        setTarget(null);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [phase]);

  /* A target that is not hit in time moves on. */
  useEffect(() => {
    if (phase !== "running" || !target) {
      return;
    }

    const timer = window.setTimeout(spawn, settings.lifetimeMs);

    return () => window.clearTimeout(timer);
  }, [phase, target, settings.lifetimeMs, spawn]);

  const hit = () => {
    const next = hits + 1;

    setHits(next);

    if (next >= settings.goal) {
      setPhase("won");
      setTarget(null);
      onWin();

      return;
    }

    spawn();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="micro text-[var(--color-primary)]">Hit the targets</p>

        <p className="micro text-[var(--color-muted)]" aria-live="polite">
          {`${hits}/${settings.goal} // ${timeLeft.toFixed(1)}s`}
        </p>
      </div>

      <div className="relative h-[clamp(11rem,34svh,17rem)] overflow-hidden border border-[var(--color-primary)]/30 bg-[var(--color-void)]/60">
        {phase === "running" && target && (
          <button
            key={target.id}
            type="button"
            onClick={hit}
            aria-label="Target"
            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/25 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-white)]"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          >
            <span className="h-4 w-4 rounded-full border border-[var(--color-white)] bg-[var(--color-accent)]" />
          </button>
        )}

        {phase !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <p className="micro text-[var(--color-white)]">
              {phase === "won"
                ? "All targets hit"
                : phase === "lost"
                  ? "Time is up"
                  : `${settings.goal} hits in ${settings.seconds} seconds`}
            </p>

            {phase !== "won" && (
              <button type="button" className="cta" onClick={start}>
                {phase === "lost" ? "Try again" : "Start"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
