"use client";

import { useEffect, type ReactNode } from "react";

import { useTheme } from "@/components/layout/ThemeProvider";
import { useGameStore } from "@/lib/games/store";

import FirstVisitPrompt from "./FirstVisitPrompt";

interface GameProviderProps {
  children: ReactNode;
}

/**
 * Wires the game store to the active theme and reads the visitor's
 * saved choice once on the client.
 *
 * Until that read finishes `ready` stays false, so nothing is ever
 * locked on the server render or on the first client render.
 */
export default function GameProvider({ children }: GameProviderProps) {
  const theme = useTheme();

  const gatedKey = Object.keys(theme.games.sections).sort().join(",");

  useEffect(() => {
    useGameStore.getState().configure(gatedKey ? gatedKey.split(",") : []);

    /*
     * ready must become true even if storage is unavailable
     * (private window, blocked site data), otherwise the first-visit
     * prompt would never appear and toggles would stay hidden.
     */
    Promise.resolve(useGameStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => useGameStore.setState({ ready: true }));
  }, [gatedKey]);

  return (
    <>
      {children}

      <FirstVisitPrompt />
    </>
  );
}
