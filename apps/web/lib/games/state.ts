/**
 * Pure game-gating state. No React, no storage, so every rule here
 * is unit tested.
 *
 * Model
 * - A section is "locked" only when game mode is ON for it and it
 *   has not been cleared (solved or skipped).
 * - Turning game mode ON for a section re-locks it, so any section
 *   can become a game midway through a visit.
 * - Turning it OFF, skipping, or "show everything" always opens it.
 *   A visitor can never be stuck behind a game.
 */

export type Choice = "unset" | "play" | "browse";

export interface SectionGameState {
  enabled: boolean;
  cleared: boolean;
}

export interface GameState {
  /** The first-visit answer. */
  choice: Choice;
  sections: Record<string, SectionGameState>;
}

export const initialGameState: GameState = {
  choice: "unset",
  sections: {},
};

const CLOSED: SectionGameState = { enabled: false, cleared: false };

export function getSection(state: GameState, id: string): SectionGameState {
  return state.sections[id] ?? CLOSED;
}

export function isLocked(state: GameState, id: string): boolean {
  const section = getSection(state, id);

  return section.enabled && !section.cleared;
}

/** First-visit answer: play turns every gated section into a game. */
export function chooseMode(
  state: GameState,
  choice: Exclude<Choice, "unset">,
  gatedIds: readonly string[],
): GameState {
  const sections: Record<string, SectionGameState> = { ...state.sections };

  for (const id of gatedIds) {
    sections[id] = { enabled: choice === "play", cleared: false };
  }

  return { choice, sections };
}

export function setSectionEnabled(
  state: GameState,
  id: string,
  enabled: boolean,
): GameState {
  return {
    ...state,
    sections: {
      ...state.sections,
      [id]: { enabled, cleared: false },
    },
  };
}

/** Solved or skipped: the details open and stay open. */
export function clearSection(state: GameState, id: string): GameState {
  return {
    ...state,
    sections: {
      ...state.sections,
      [id]: { ...getSection(state, id), cleared: true },
    },
  };
}

/** Recruiter bypass: open every section at once. */
export function showAll(
  state: GameState,
  gatedIds: readonly string[],
): GameState {
  return chooseMode(state, "browse", gatedIds);
}

/**
 * Validate state read from storage; anything unexpected falls back
 * to the initial state instead of throwing.
 */
export function parseStoredState(value: unknown): GameState {
  if (typeof value !== "object" || value === null) {
    return initialGameState;
  }

  const raw = value as { choice?: unknown; sections?: unknown };

  const choice: Choice =
    raw.choice === "play" || raw.choice === "browse" ? raw.choice : "unset";

  const sections: Record<string, SectionGameState> = {};

  if (typeof raw.sections === "object" && raw.sections !== null) {
    for (const [id, entry] of Object.entries(raw.sections)) {
      if (typeof entry !== "object" || entry === null) {
        continue;
      }

      const { enabled, cleared } = entry as Record<string, unknown>;

      sections[id] = {
        enabled: enabled === true,
        cleared: cleared === true,
      };
    }
  }

  return { choice, sections };
}
