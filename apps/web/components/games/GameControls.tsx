"use client";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import HoloCard from "@/components/ui/HoloCard";
import { getSection } from "@/lib/games/state";
import { useGameStore } from "@/lib/games/store";
import { SCENES } from "@/lib/scenes/order";

/**
 * Nav controls for games:
 * - Interviewer mode: opens every section at once (recruiter bypass).
 * - Games menu: a switch per section, so any section can become a
 *   game (or stop being one) midway through a visit.
 *
 * Renders nothing when the theme has no games.
 */
export default function GameControls() {
  const theme = useTheme();

  const gatedIds = Object.keys(theme.games.sections);

  const ready = useGameStore((state) => state.ready);
  const sections = useGameStore((state) => state.sections);
  const showAll = useGameStore((state) => state.showAll);
  const setEnabled = useGameStore((state) => state.setEnabled);

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (gatedIds.length === 0 || !ready) {
    return null;
  }

  const anyLocked = gatedIds.some((id) => {
    const section = sections[id];

    return section?.enabled && !section.cleared;
  });

  return (
    <div ref={menuRef} className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={showAll}
        aria-pressed={!anyLocked}
        title="Open every section at once"
        className={`micro whitespace-nowrap border px-3 py-1.5 transition-colors ${
          anyLocked
            ? "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-void)]"
            : "border-white/20 text-[var(--color-white)]/70"
        }`}
      >
        {anyLocked ? (
          <>
            Interviewer<span className="hidden xl:inline"> mode</span>
          </>
        ) : (
          "All open"
        )}
      </button>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className="micro text-[var(--color-muted)] transition-colors hover:text-[var(--color-white)]"
      >
        Games
      </button>

      {open && (
        <div
          role="group"
          aria-label="Game mode per section"
          className="absolute right-0 top-full z-50 mt-3 w-64"
        >
          <HoloCard bodyClassName="space-y-3 p-4">
            <p className="micro text-[8px] text-[var(--color-muted)]">
              Turn a section into a game
            </p>

            <ul className="space-y-2">
              {gatedIds.map((id) => {
                const label = SCENES.find((scene) => scene.id === id)?.label ?? id;

                const on = getSection({ choice: "unset", sections }, id).enabled;

                return (
                  <li key={id} className="flex items-center justify-between">
                    <span className="micro text-[var(--color-white)]">{label}</span>

                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={`${label} game mode`}
                      onClick={() => setEnabled(id, !on)}
                      className={`micro border px-2 py-1 text-[8px] ${
                        on
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-void)]"
                          : "border-white/25 text-[var(--color-white)]/80"
                      }`}
                    >
                      {on ? "On" : "Off"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </HoloCard>
        </div>
      )}
    </div>
  );
}
