import { describe, expect, it } from "vitest";

import {
  coverRect,
  dissolvePlan,
  frameIndex,
  framePath,
  loadOrder,
  nearestLoaded,
  pickSequence,
  pushZoom,
  sceneProgress,
  visibleFraction,
  type SceneManifest,
} from "./frames";

describe("frameIndex", () => {
  it("maps progress to the first and last frame", () => {
    expect(frameIndex(0, 120)).toBe(0);
    expect(frameIndex(1, 120)).toBe(119);
    expect(frameIndex(0.5, 101)).toBe(50);
  });

  it("clamps out-of-range progress and tiny sequences", () => {
    expect(frameIndex(-3, 10)).toBe(0);
    expect(frameIndex(9, 10)).toBe(9);
    expect(frameIndex(0.7, 1)).toBe(0);
    expect(frameIndex(0.7, 0)).toBe(0);
  });
});

describe("framePath", () => {
  it("fills the 1-based padded number", () => {
    expect(framePath("/a/{n}.webp", 0)).toBe("/a/0001.webp");
    expect(framePath("/a/{n}.webp", 119)).toBe("/a/0120.webp");
    expect(framePath("/a/f{n}.jpg", 4, 2)).toBe("/a/f05.jpg");
  });
});

describe("pickSequence", () => {
  const manifest: SceneManifest = {
    frames: 120,
    pattern: "/d/{n}.webp",
    mobilePattern: "/m/{n}.webp",
    mobileFrames: 80,
    pad: 4,
    focal: [0.5, 0.5],
    push: 1,
  };

  it("uses the mobile sequence on narrow screens", () => {
    expect(pickSequence(manifest, true)).toEqual({
      pattern: "/m/{n}.webp",
      frames: 80,
    });
  });

  it("falls back to desktop without a mobile sequence", () => {
    expect(pickSequence({ ...manifest, mobilePattern: undefined }, true)).toEqual(
      { pattern: "/d/{n}.webp", frames: 120 },
    );

    expect(pickSequence(manifest, false).pattern).toBe("/d/{n}.webp");
  });
});

describe("loadOrder", () => {
  it("queues every frame exactly once, first frame first", () => {
    const order = loadOrder(100);

    expect(order[0]).toBe(0);
    expect(order).toHaveLength(100);
    expect(new Set(order).size).toBe(100);
    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 100 }, (_, index) => index),
    );
  });

  it("loads the last frame early and coarse frames before fine ones", () => {
    const order = loadOrder(100);

    expect(order[1]).toBe(99);
    expect(order.indexOf(16)).toBeLessThan(order.indexOf(15));
  });

  it("handles empty and single-frame sequences", () => {
    expect(loadOrder(0)).toEqual([]);
    expect(loadOrder(1)).toEqual([0]);
  });
});

describe("nearestLoaded", () => {
  it("returns the frame itself when loaded", () => {
    expect(nearestLoaded([true, false, true], 2)).toBe(2);
  });

  it("finds the closest loaded neighbour", () => {
    expect(nearestLoaded([true, false, false, false, true], 3)).toBe(4);
    expect(nearestLoaded([true, false, false, false, false], 3)).toBe(0);
  });

  it("returns null when nothing is loaded", () => {
    expect(nearestLoaded([false, false], 1)).toBeNull();
    expect(nearestLoaded([], 0)).toBeNull();
  });
});

describe("sceneProgress / visibleFraction", () => {
  it("runs 0 -> 1 as a section scrolls through the viewport", () => {
    expect(sceneProgress(800, 800, 800)).toBe(0);
    expect(sceneProgress(0, 800, 800)).toBeCloseTo(0.5);
    expect(sceneProgress(-800, 800, 800)).toBe(1);
  });

  it("measures how much of the viewport a section covers", () => {
    expect(visibleFraction(0, 800, 800)).toBe(1);
    expect(visibleFraction(400, 800, 800)).toBe(0.5);
    expect(visibleFraction(-400, 800, 800)).toBe(0.5);
    expect(visibleFraction(900, 800, 800)).toBe(0);
  });
});

describe("dissolvePlan", () => {
  it("draws the strongest scene opaque and blends the rest exactly", () => {
    const plan = dissolvePlan([0.3, 0.7]);

    expect(plan[0]).toEqual({ index: 1, alpha: 1 });
    expect(plan[1].index).toBe(0);
    expect(plan[1].alpha).toBeCloseTo(0.3);
  });

  it("skips scenes that are not visible", () => {
    expect(dissolvePlan([0, 1, 0])).toEqual([{ index: 1, alpha: 1 }]);
    expect(dissolvePlan([0, 0])).toEqual([]);
  });
});

describe("pushZoom", () => {
  it("eases from 1 to the push value", () => {
    expect(pushZoom(0, 1.2)).toBe(1);
    expect(pushZoom(1, 1.2)).toBeCloseTo(1.2);
    expect(pushZoom(0.5, 1.2)).toBeCloseTo(1.1);
  });

  it("never zooms out and clamps progress", () => {
    expect(pushZoom(0.5, 0.5)).toBe(1);
    expect(pushZoom(3, 1.2)).toBeCloseTo(1.2);
  });
});

describe("coverRect", () => {
  it("covers the destination and keeps the aspect ratio", () => {
    const rect = coverRect(1600, 900, 800, 800);

    expect(rect.height).toBeCloseTo(800);
    expect(rect.width).toBeCloseTo(1422.2, 0);
    expect(rect.width / rect.height).toBeCloseTo(1600 / 900);
  });

  it("uses the focal point to choose the crop", () => {
    const left = coverRect(1600, 900, 800, 800, [0, 0.5]);
    const right = coverRect(1600, 900, 800, 800, [1, 0.5]);

    expect(left.x).toBe(0);
    expect(right.x).toBeLessThan(0);
  });

  it("zooms in around the focal point", () => {
    const base = coverRect(1600, 900, 1600, 900);
    const zoomed = coverRect(1600, 900, 1600, 900, [0.5, 0.5], 1.2);

    expect(zoomed.width).toBeCloseTo(base.width * 1.2);
  });
});
