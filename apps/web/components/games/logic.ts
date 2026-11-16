import type { Difficulty } from "@/lib/theme";

/** Returns a number in [0, 1). Injectable so tests are deterministic. */
export type Rng = () => number;

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(rng() * (index + 1));

    [result[index], result[other]] = [result[other], result[index]];
  }

  return result;
}

/** Data a section hands to its game (taken from the parsed resume). */
export interface GameData {
  /** Short labels: skills, project names, ... */
  labels: string[];
  /** Words for letter puzzles: company names, roles, ... */
  words: string[];
}

export interface GameProps {
  difficulty: Difficulty;
  data: GameData;
  onWin: () => void;
}

// ---------------------------------------------------------------
// Memory match
// ---------------------------------------------------------------

export interface MemoryCard {
  id: number;
  pairId: number;
  label: string;
}

export const MEMORY_PAIRS: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

const FALLBACK_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Build a shuffled deck of `pairs` matching pairs. Labels come from
 * the resume (skills) and are de-duplicated; generic symbols fill in
 * when there are not enough.
 */
export function buildDeck(
  labels: readonly string[],
  difficulty: Difficulty,
  rng: Rng = Math.random,
): MemoryCard[] {
  const pairs = MEMORY_PAIRS[difficulty];

  const unique = [...new Set(labels.map((label) => label.trim()))].filter(
    Boolean,
  );

  const chosen = shuffle(unique, rng).slice(0, pairs);

  for (const fallback of FALLBACK_LABELS) {
    if (chosen.length >= pairs) {
      break;
    }

    if (!chosen.includes(fallback)) {
      chosen.push(fallback);
    }
  }

  const cards = chosen.flatMap((label, pairId) => [
    { pairId, label },
    { pairId, label },
  ]);

  return shuffle(cards, rng).map((card, id) => ({ ...card, id }));
}

export interface MemoryState {
  /** Indices of the cards currently face up and unresolved (max 2). */
  flipped: number[];
  /** Pair ids that have been matched. */
  matched: number[];
  moves: number;
}

export const initialMemoryState: MemoryState = {
  flipped: [],
  matched: [],
  moves: 0,
};

/**
 * Flip a card. Ignored when the card is already face up, already
 * matched, or two cards are waiting to be resolved.
 */
export function flipCard(
  state: MemoryState,
  deck: readonly MemoryCard[],
  index: number,
): MemoryState {
  const card = deck[index];

  if (
    !card ||
    state.flipped.length >= 2 ||
    state.flipped.includes(index) ||
    state.matched.includes(card.pairId)
  ) {
    return state;
  }

  const flipped = [...state.flipped, index];

  if (flipped.length < 2) {
    return { ...state, flipped };
  }

  const [first, second] = flipped.map((position) => deck[position]);

  const isMatch = first.pairId === second.pairId;

  return {
    flipped: isMatch ? [] : flipped,
    matched: isMatch ? [...state.matched, first.pairId] : state.matched,
    moves: state.moves + 1,
  };
}

/** Turn a mismatched pair face down again. */
export function resolveMismatch(state: MemoryState): MemoryState {
  return { ...state, flipped: [] };
}

export function isMemoryWon(
  state: MemoryState,
  deck: readonly MemoryCard[],
): boolean {
  return deck.length > 0 && state.matched.length * 2 === deck.length;
}

// ---------------------------------------------------------------
// Signal decode (unscramble a word)
// ---------------------------------------------------------------

export const DECODE_HINTS: Record<Difficulty, number> = {
  easy: 3,
  medium: 1,
  hard: 0,
};

const FALLBACK_WORD = "SIGNAL";

/**
 * Pick a word from the resume's company / role names: letters only,
 * 4 to 9 characters, upper-cased. Falls back to a neutral word.
 */
export function pickWord(
  words: readonly string[],
  rng: Rng = Math.random,
): string {
  const candidates = words
    .flatMap((entry) => entry.split(/[^A-Za-z]+/))
    .map((word) => word.toUpperCase())
    .filter((word) => word.length >= 4 && word.length <= 9);

  if (!candidates.length) {
    return FALLBACK_WORD;
  }

  const unique = [...new Set(candidates)];

  return unique[Math.floor(rng() * unique.length)];
}

/**
 * Scramble a word's letters so the result never equals the word
 * (unless every letter is identical, where that is impossible).
 */
export function scramble(word: string, rng: Rng = Math.random): string[] {
  const letters = word.split("");

  if (new Set(letters).size < 2) {
    return letters;
  }

  let result = shuffle(letters, rng);

  // Deterministic fallback: rotate by one, which always differs when
  // at least two distinct letters exist and is cheap to verify.
  for (let attempt = 0; attempt < 8 && result.join("") === word; attempt++) {
    result = shuffle(letters, rng);
  }

  if (result.join("") === word) {
    result = [...letters.slice(1), letters[0]];
  }

  if (result.join("") === word) {
    result = [...letters].reverse();
  }

  return result;
}

// ---------------------------------------------------------------
// Target practice
// ---------------------------------------------------------------

export interface TargetSettings {
  /** Hits needed to win. */
  goal: number;
  /** How long one target stays, ms. */
  lifetimeMs: number;
  /** Whole-round time limit, seconds. */
  seconds: number;
}

export const TARGET_SETTINGS: Record<Difficulty, TargetSettings> = {
  easy: { goal: 6, lifetimeMs: 1800, seconds: 30 },
  medium: { goal: 8, lifetimeMs: 1300, seconds: 25 },
  hard: { goal: 10, lifetimeMs: 950, seconds: 20 },
};

export interface TargetPosition {
  /** Percent of the play area, kept away from the edges. */
  x: number;
  y: number;
}

export function randomPosition(rng: Rng = Math.random): TargetPosition {
  const clamp = (value: number) => 10 + value * 80;

  return { x: clamp(rng()), y: clamp(rng()) };
}

export interface LetterTile {
  id: number;
  letter: string;
}

/** The word spelled by the picked tiles, in pick order. */
export function assembled(
  tiles: readonly LetterTile[],
  picked: readonly number[],
): string {
  return picked.map((id) => tiles[id]?.letter ?? "").join("");
}

/**
 * Hint: keep the longest correct prefix the player already built and
 * place the next correct letter after it. Wrong letters are dropped.
 */
export function applyHint(
  word: string,
  tiles: readonly LetterTile[],
  picked: readonly number[],
): number[] {
  let keep = 0;

  while (keep < picked.length && tiles[picked[keep]]?.letter === word[keep]) {
    keep++;
  }

  const base = picked.slice(0, keep);

  if (base.length >= word.length) {
    return base;
  }

  const needed = word[base.length];

  const tile = tiles.find(
    (candidate) => candidate.letter === needed && !base.includes(candidate.id),
  );

  return tile ? [...base, tile.id] : base;
}
