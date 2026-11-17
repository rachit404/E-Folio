"use client";

import { useRef, useState, type ReactNode } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import { getSection, isLocked } from "@/lib/games/state";
import { useGameStore } from "@/lib/games/store";
import { SCENES, sceneNumber, type SceneId } from "@/lib/scenes/order";

import CaseFile from "./CaseFile";
import type { GameData } from "./logic";

interface GameGateProps {
  sectionId: SceneId;
  data: GameData;
  children: ReactNode;
}

/**
 * Wraps a scene's content. When game mode is on for the section and
 * it has not been cleared, the content is replaced by its case file;
 * otherwise the content shows as normal.
 *
 * Nothing is locked until the visitor's saved choice has loaded
 * (`ready`), so server HTML and the first render always show
 * everything. A section without a game in the theme is never gated.
 */
export default function GameGate({ sectionId, data, children }: GameGateProps) {
  const theme = useTheme();

  const config = theme.games.sections[sectionId];

  const ready = useGameStore((state) => state.ready);
  const locked = useGameStore((state) => isLocked(state, sectionId));
  const enabled = useGameStore((state) => getSection(state, sectionId).enabled);
  const setEnabled = useGameStore((state) => state.setEnabled);
  const clear = useGameStore((state) => state.clear);

  const [justOpened, setJustOpened] = useState(false);

  const root = useRef<HTMLDivElement>(null);

  if (!config) {
    return <>{children}</>;
  }

  const label = SCENES.find((scene) => scene.id === sectionId)?.label ?? "";

  if (ready && locked) {
    return (
      <CaseFile
        number={sceneNumber(sectionId)}
        label={label}
        game={config.game}
        difficulty={config.difficulty}
        data={data}
        onOpen={() => {
          setJustOpened(true);
          clear(sectionId);
        }}
      />
    );
  }

  return (
    <div ref={root} className="relative h-full">
      <div className={`h-full ${justOpened ? "unlock-in" : ""}`}>
        {children}
      </div>

      {ready && (
        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => {
            setJustOpened(false);
            setEnabled(sectionId, !enabled);
          }}
          className="micro absolute bottom-0 right-0 z-20 border border-white/20 bg-[var(--color-void)]/70 px-3 py-1.5 text-[8px] text-[var(--color-white)]/80 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          {enabled ? "Game mode on: turn off" : "Play this as a game"}
        </button>
      )}
    </div>
  );
}
