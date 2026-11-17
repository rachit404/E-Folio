/**
 * Pure helpers for scroll-scrubbed frame sequences. No DOM access, so
 * every rule is unit tested.
 */

export interface SceneManifest {
  /** Number of frames in the desktop sequence. */
  frames: number;
  /** URL with an `{n}` placeholder, e.g. "/assets/scenes/home/{n}.webp". */
  pattern: string;
  /** Optional lighter sequence for narrow screens. */
  mobilePattern?: string;
  mobileFrames?: number;
  /** Zero padding of `{n}` (frame files are 1-based: 0001, 0002, ...). */
  pad: number;
  /** Where the subject sits, 0..1, used when cropping to the viewport. */
  focal: [number, number];
  /**
   * Zoom reached at the end of the scene (1 = none). A single still uses
   * this for a slow push-in as the visitor scrolls.
   */
  push: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Progress 0..1 -> frame index 0..count-1. */
export function frameIndex(progress: number, count: number): number {
  if (count <= 1) {
    return 0;
  }

  return Math.round(clamp(progress, 0, 1) * (count - 1));
}

/** Frame index (0-based) -> URL; `{n}` becomes the 1-based padded number. */
export function framePath(
  pattern: string,
  index: number,
  pad: number = 4,
): string {
  return pattern.replace("{n}", String(index + 1).padStart(pad, "0"));
}

/** Pick the desktop or mobile sequence for the viewport. */
export function pickSequence(
  manifest: SceneManifest,
  mobile: boolean,
): { pattern: string; frames: number } {
  if (mobile && manifest.mobilePattern) {
    return {
      pattern: manifest.mobilePattern,
      frames: manifest.mobileFrames ?? manifest.frames,
    };
  }

  return { pattern: manifest.pattern, frames: manifest.frames };
}

/**
 * Order to load frames so scrubbing works early: the first frame, a
 * coarse pass, then progressively finer passes until all are queued.
 */
export function loadOrder(count: number): number[] {
  if (count <= 0) {
    return [];
  }

  const order: number[] = [];
  const seen = new Set<number>();

  const add = (index: number) => {
    if (index >= 0 && index < count && !seen.has(index)) {
      seen.add(index);
      order.push(index);
    }
  };

  add(0);
  add(count - 1);

  for (let stride = 16; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let index = 0; index < count; index += stride) {
      add(index);
    }
  }

  return order;
}

/** The loaded frame closest to `wanted`, or null if none are loaded. */
export function nearestLoaded(
  loaded: readonly boolean[],
  wanted: number,
): number | null {
  if (loaded[wanted]) {
    return wanted;
  }

  for (let distance = 1; distance < loaded.length; distance++) {
    if (loaded[wanted - distance]) {
      return wanted - distance;
    }

    if (loaded[wanted + distance]) {
      return wanted + distance;
    }
  }

  return null;
}

/**
 * How far a section has scrolled through the viewport:
 * 0 when its top meets the bottom edge, 1 when its bottom leaves the top.
 */
export function sceneProgress(
  top: number,
  height: number,
  viewport: number,
): number {
  return clamp((viewport - top) / (viewport + height), 0, 1);
}

/** Fraction of the viewport a section covers (0..1). */
export function visibleFraction(
  top: number,
  height: number,
  viewport: number,
): number {
  const overlap = Math.min(top + height, viewport) - Math.max(top, 0);

  return clamp(overlap / viewport, 0, 1);
}

/**
 * Cross-dissolve plan. Scenes are drawn strongest first; each is drawn
 * with alpha = weight / cumulativeWeight, which produces an exact
 * weighted blend (two scenes at 0.5 / 0.5 mix 50:50, never dimming).
 */
export function dissolvePlan(
  weights: readonly number[],
): { index: number; alpha: number }[] {
  const ranked = weights
    .map((weight, index) => ({ weight, index }))
    .filter((entry) => entry.weight > 0.01)
    .sort((a, b) => b.weight - a.weight);

  let cumulative = 0;

  return ranked.map(({ weight, index }) => {
    cumulative += weight;

    return { index, alpha: weight / cumulative };
  });
}

/** Eased zoom for a scene at progress 0..1: 1 -> push. */
export function pushZoom(progress: number, push: number): number {
  const t = clamp(progress, 0, 1);

  return 1 + (Math.max(1, push) - 1) * (t * t * (3 - 2 * t));
}

/**
 * Where to draw an image of size src so it covers dst, keeping the
 * focal point (0..1) in view. `zoom` >= 1 pushes in.
 */
export function coverRect(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
  focal: readonly [number, number] = [0.5, 0.5],
  zoom: number = 1,
): { x: number; y: number; width: number; height: number } {
  const scale = Math.max(dstWidth / srcWidth, dstHeight / srcHeight) * zoom;

  const width = srcWidth * scale;
  const height = srcHeight * scale;

  return {
    // "+ 0" turns a possible -0 into 0.
    x: (dstWidth - width) * clamp(focal[0], 0, 1) + 0,
    y: (dstHeight - height) * clamp(focal[1], 0, 1) + 0,
    width,
    height,
  };
}
