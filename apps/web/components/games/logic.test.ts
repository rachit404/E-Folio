import { describe, expect, it } from "vitest";

import {
  MEMORY_PAIRS,
  applyHint,
  assembled,
  TARGET_SETTINGS,
  buildDeck,
  flipCard,
  initialMemoryState,
  isMemoryWon,
  pickWord,
  randomPosition,
  resolveMismatch,
  scramble,
  shuffle,
  type MemoryCard,
  type Rng,
} from "./logic";

/** Deterministic rng cycling through the given values. */
function sequence(...values: number[]): Rng {
  let index = 0;

  return () => values[index++ % values.length];
}

describe("shuffle", () => {
  it("keeps every item and does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];

    const output = shuffle(input, sequence(0.1, 0.7, 0.3, 0.9));

    expect([...output].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("buildDeck", () => {
  const labels = ["Java", "Python", "C", "Go", "Rust", "SQL", "Bash", "Lua"];

  it("builds the right number of cards per difficulty", () => {
    expect(buildDeck(labels, "easy")).toHaveLength(MEMORY_PAIRS.easy * 2);
    expect(buildDeck(labels, "medium")).toHaveLength(MEMORY_PAIRS.medium * 2);
    expect(buildDeck(labels, "hard")).toHaveLength(MEMORY_PAIRS.hard * 2);
  });

  it("makes every card part of exactly one pair", () => {
    const deck = buildDeck(labels, "medium");

    const counts = new Map<number, number>();

    for (const card of deck) {
      counts.set(card.pairId, (counts.get(card.pairId) ?? 0) + 1);
    }

    expect([...counts.values()].every((count) => count === 2)).toBe(true);
  });

  it("de-duplicates labels and pads with generic symbols", () => {
    const deck = buildDeck(["Java", "java ", "Java"], "easy");

    const deckLabels = new Set(deck.map((card) => card.label));

    expect(deck).toHaveLength(8);
    expect(deckLabels.size).toBe(4);
    expect(deckLabels.has("Java")).toBe(true);
  });

  it("numbers cards by deck position", () => {
    expect(buildDeck(labels, "easy").map((card) => card.id)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
  });
});

describe("flipCard", () => {
  const deck: MemoryCard[] = [
    { id: 0, pairId: 0, label: "A" },
    { id: 1, pairId: 1, label: "B" },
    { id: 2, pairId: 0, label: "A" },
    { id: 3, pairId: 1, label: "B" },
  ];

  it("flips one card face up", () => {
    expect(flipCard(initialMemoryState, deck, 0).flipped).toEqual([0]);
  });

  it("matches a pair and counts the move", () => {
    let state = flipCard(initialMemoryState, deck, 0);

    state = flipCard(state, deck, 2);

    expect(state).toEqual({ flipped: [], matched: [0], moves: 1 });
  });

  it("keeps a mismatch face up until it is resolved", () => {
    let state = flipCard(initialMemoryState, deck, 0);

    state = flipCard(state, deck, 1);

    expect(state.flipped).toEqual([0, 1]);
    expect(state.matched).toEqual([]);
    expect(state.moves).toBe(1);

    // A third card is ignored while two wait.
    expect(flipCard(state, deck, 2)).toBe(state);

    expect(resolveMismatch(state).flipped).toEqual([]);
  });

  it("ignores the same card twice, matched cards and bad indices", () => {
    const once = flipCard(initialMemoryState, deck, 0);

    expect(flipCard(once, deck, 0)).toBe(once);
    expect(flipCard(initialMemoryState, deck, 99)).toBe(initialMemoryState);

    const matched = flipCard(flipCard(initialMemoryState, deck, 0), deck, 2);

    expect(flipCard(matched, deck, 0)).toBe(matched);
  });

  it("is won once every pair is matched", () => {
    let state = initialMemoryState;

    expect(isMemoryWon(state, deck)).toBe(false);

    for (const index of [0, 2, 1, 3]) {
      state = flipCard(state, deck, index);
    }

    expect(isMemoryWon(state, deck)).toBe(true);
    expect(isMemoryWon(initialMemoryState, [])).toBe(false);
  });
});

describe("pickWord", () => {
  it("picks a letters-only word of 4 to 9 characters, upper-cased", () => {
    const word = pickWord(["Acme Corp (Remote)", "DJ Unicode"], sequence(0));

    expect(word).toMatch(/^[A-Z]{4,9}$/);
  });

  it("ignores words that are too short or too long", () => {
    expect(pickWord(["DJ", "Co", "Internationalization"])).toBe("SIGNAL");
  });

  it("falls back when there are no words", () => {
    expect(pickWord([])).toBe("SIGNAL");
  });
});

describe("scramble", () => {
  it("keeps the same letters", () => {
    expect(scramble("ACME").sort()).toEqual(["A", "C", "E", "M"]);
  });

  it("never returns the original word", () => {
    // An rng that would produce the identity shuffle.
    const identity = () => 0.999;

    for (const word of ["ACME", "TUSTA", "AB"]) {
      expect(scramble(word, identity).join("")).not.toBe(word);
    }
  });

  it("returns identical-letter words unchanged (nothing to scramble)", () => {
    expect(scramble("AAAA")).toEqual(["A", "A", "A", "A"]);
  });
});

describe("target practice", () => {
  it("gets harder with difficulty", () => {
    expect(TARGET_SETTINGS.hard.goal).toBeGreaterThan(TARGET_SETTINGS.easy.goal);
    expect(TARGET_SETTINGS.hard.lifetimeMs).toBeLessThan(
      TARGET_SETTINGS.easy.lifetimeMs,
    );
  });

  it("keeps targets away from the edges", () => {
    for (const value of [0, 0.5, 0.999999]) {
      const { x, y } = randomPosition(() => value);

      expect(x).toBeGreaterThanOrEqual(10);
      expect(x).toBeLessThanOrEqual(90);
      expect(y).toBeGreaterThanOrEqual(10);
      expect(y).toBeLessThanOrEqual(90);
    }
  });
});

describe("assembled / applyHint", () => {
  const tiles = "TOAD".split("").map((letter, id) => ({ id, letter }));
  // word "DATO" would need D(3) A(2) T(0) O(1); use word TOAD instead:
  const word = "TOAD";

  it("spells the picked tiles in order", () => {
    expect(assembled(tiles, [3, 0])).toBe("DT");
    expect(assembled(tiles, [])).toBe("");
  });

  it("adds the first correct letter to an empty answer", () => {
    expect(applyHint(word, tiles, [])).toEqual([0]);
  });

  it("extends a correct prefix", () => {
    expect(applyHint(word, tiles, [0])).toEqual([0, 1]);
  });

  it("drops wrong letters but keeps the correct prefix", () => {
    // T, then wrong D -> keep T, place O.
    expect(applyHint(word, tiles, [0, 3])).toEqual([0, 1]);
  });

  it("handles repeated letters by tile id", () => {
    const repeated = "ANNA".split("").map((letter, id) => ({ id, letter }));

    expect(applyHint("ANNA", repeated, [0, 1])).toEqual([0, 1, 2]);
  });

  it("returns a complete correct answer unchanged", () => {
    expect(applyHint(word, tiles, [0, 1, 2, 3])).toEqual([0, 1, 2, 3]);
  });
});
