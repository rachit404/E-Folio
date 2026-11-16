"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  chooseMode,
  clearSection,
  initialGameState,
  parseStoredState,
  setSectionEnabled,
  showAll,
  type Choice,
  type GameState,
} from "./state";

interface GameStore extends GameState {
  /** Gated section ids for the active theme (set by GameProvider). */
  gatedIds: string[];

  /**
   * False until the saved choice has been read from localStorage.
   * Until then nothing is locked, so server HTML and the first client
   * render match and no visitor ever waits behind a game.
   */
  ready: boolean;

  configure: (gatedIds: string[]) => void;
  choose: (choice: Exclude<Choice, "unset">) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  clear: (id: string) => void;
  showAll: () => void;
}

/**
 * One visitor preference shared by every role page.
 *
 * Storage access is wrapped by zustand's persist, which tolerates
 * unavailable storage (private windows, blocked cookies).
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,
      gatedIds: [],
      ready: false,

      configure: (gatedIds) => set({ gatedIds }),

      choose: (choice) =>
        set((state) => chooseMode(state, choice, state.gatedIds)),

      setEnabled: (id, enabled) =>
        set((state) => setSectionEnabled(state, id, enabled)),

      clear: (id) => set((state) => clearSection(state, id)),

      showAll: () => set((state) => showAll(state, get().gatedIds)),
    }),
    {
      name: "efolio-games-v1",
      skipHydration: true,
      partialize: (state) => ({
        choice: state.choice,
        sections: state.sections,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...parseStoredState(persisted),
      }),
      onRehydrateStorage: () => () => {
        useGameStore.setState({ ready: true });
      },
    },
  ),
);
