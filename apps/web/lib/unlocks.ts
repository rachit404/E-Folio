export const UNLOCK_STORAGE_KEY = "e-folio-unlocks";

export type UnlockableSection = "skills" | "projects";

export interface UnlockState {
  skills: boolean;
  projects: boolean;
  interviewMode: boolean;
}

const DEFAULT_UNLOCK_STATE: UnlockState = {
  skills: false,
  projects: false,
  interviewMode: false,
};

export function getUnlockState(): UnlockState {
  if (typeof window === "undefined") {
    return DEFAULT_UNLOCK_STATE;
  }

  try {
    const raw = window.localStorage.getItem(UNLOCK_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_UNLOCK_STATE;
    }

    const parsed = JSON.parse(raw) as Partial<UnlockState>;

    return {
      skills: Boolean(parsed.skills),
      projects: Boolean(parsed.projects),
      interviewMode: Boolean(parsed.interviewMode),
    };
  } catch {
    return DEFAULT_UNLOCK_STATE;
  }
}

export function saveUnlockState(state: UnlockState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(state));

  window.dispatchEvent(
    new CustomEvent("e-folio-unlocks-changed", {
      detail: state,
    }),
  );
}

export function unlockSkills(): UnlockState {
  const nextState: UnlockState = {
    ...getUnlockState(),
    skills: true,
  };

  saveUnlockState(nextState);

  return nextState;
}

export function unlockProjects(): UnlockState {
  const nextState: UnlockState = {
    ...getUnlockState(),
    projects: true,
  };

  saveUnlockState(nextState);

  return nextState;
}

export function enableInterviewMode(): UnlockState {
  const nextState: UnlockState = {
    skills: true,
    projects: true,
    interviewMode: true,
  };

  saveUnlockState(nextState);

  return nextState;
}

export function resetUnlockSection(section: UnlockableSection): UnlockState {
  const current = getUnlockState();

  const nextState: UnlockState = {
    ...current,
    [section]: false,
    interviewMode: false,
  };

  saveUnlockState(nextState);

  return nextState;
}

export function resetUnlockState(): UnlockState {
  saveUnlockState(DEFAULT_UNLOCK_STATE);

  return DEFAULT_UNLOCK_STATE;
}
