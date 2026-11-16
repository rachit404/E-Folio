import { describe, expect, it } from "vitest";

import {
  chooseMode,
  clearSection,
  getSection,
  initialGameState,
  isLocked,
  parseStoredState,
  setSectionEnabled,
  showAll,
} from "./state";

const IDS = ["experience", "skills", "projects"];

describe("isLocked", () => {
  it("never locks anything by default", () => {
    for (const id of IDS) {
      expect(isLocked(initialGameState, id)).toBe(false);
    }
  });
});

describe("chooseMode", () => {
  it("play locks every gated section", () => {
    const state = chooseMode(initialGameState, "play", IDS);

    expect(state.choice).toBe("play");

    for (const id of IDS) {
      expect(isLocked(state, id)).toBe(true);
    }
  });

  it("browse leaves everything open", () => {
    const state = chooseMode(initialGameState, "browse", IDS);

    expect(state.choice).toBe("browse");

    for (const id of IDS) {
      expect(isLocked(state, id)).toBe(false);
    }
  });

  it("does not touch sections that are not gated", () => {
    const state = chooseMode(initialGameState, "play", ["skills"]);

    expect(isLocked(state, "experience")).toBe(false);
  });
});

describe("section toggles", () => {
  it("turns any single section into a game midway", () => {
    const browsing = chooseMode(initialGameState, "browse", IDS);

    const state = setSectionEnabled(browsing, "skills", true);

    expect(isLocked(state, "skills")).toBe(true);
    expect(isLocked(state, "projects")).toBe(false);
  });

  it("turning a game off opens the section", () => {
    const playing = chooseMode(initialGameState, "play", IDS);

    const state = setSectionEnabled(playing, "skills", false);

    expect(isLocked(state, "skills")).toBe(false);
    expect(isLocked(state, "projects")).toBe(true);
  });

  it("re-enabling a cleared section locks it again", () => {
    let state = chooseMode(initialGameState, "play", IDS);

    state = clearSection(state, "skills");

    expect(isLocked(state, "skills")).toBe(false);

    state = setSectionEnabled(state, "skills", true);

    expect(isLocked(state, "skills")).toBe(true);
  });
});

describe("clearSection", () => {
  it("opens only the cleared section and keeps game mode on", () => {
    let state = chooseMode(initialGameState, "play", IDS);

    state = clearSection(state, "projects");

    expect(isLocked(state, "projects")).toBe(false);
    expect(getSection(state, "projects").enabled).toBe(true);
    expect(isLocked(state, "skills")).toBe(true);
  });
});

describe("showAll (recruiter bypass)", () => {
  it("opens every section from any state", () => {
    let state = chooseMode(initialGameState, "play", IDS);

    state = showAll(state, IDS);

    expect(state.choice).toBe("browse");

    for (const id of IDS) {
      expect(isLocked(state, id)).toBe(false);
    }
  });
});

describe("parseStoredState", () => {
  it("falls back to the initial state for garbage", () => {
    expect(parseStoredState(null)).toEqual(initialGameState);
    expect(parseStoredState("nope")).toEqual(initialGameState);
    expect(parseStoredState(42)).toEqual(initialGameState);
  });

  it("keeps valid data and drops invalid entries", () => {
    const state = parseStoredState({
      choice: "play",
      sections: {
        skills: { enabled: true, cleared: false },
        broken: "x",
        weird: { enabled: "yes", cleared: 1 },
      },
    });

    expect(state.choice).toBe("play");
    expect(isLocked(state, "skills")).toBe(true);
    expect(state.sections.broken).toBeUndefined();
    expect(getSection(state, "weird")).toEqual({
      enabled: false,
      cleared: false,
    });
  });

  it("ignores an unknown choice", () => {
    expect(parseStoredState({ choice: "hack" }).choice).toBe("unset");
  });
});
