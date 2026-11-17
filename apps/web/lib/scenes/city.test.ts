import { describe, expect, it } from "vitest";

import {
  buildSkyline,
  hashString,
  mix,
  mulberry32,
  parseColor,
  rgba,
} from "./city";

describe("mulberry32", () => {
  it("is deterministic for a seed and stays in [0, 1)", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);

    const first = Array.from({ length: 50 }, () => a());
    const second = Array.from({ length: 50 }, () => b());

    expect(first).toEqual(second);
    expect(first.every((value) => value >= 0 && value < 1)).toBe(true);
  });

  it("produces different streams for different seeds", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});

describe("hashString", () => {
  it("is stable and distinguishes ids", () => {
    expect(hashString("home")).toBe(hashString("home"));
    expect(hashString("home")).not.toBe(hashString("about"));
  });
});

describe("colour helpers", () => {
  it("parses short and long hex", () => {
    expect(parseColor("#00e5ff", [0, 0, 0])).toEqual([0, 229, 255]);
    expect(parseColor("#f0a", [0, 0, 0])).toEqual([255, 0, 170]);
  });

  it("falls back for anything that is not hex", () => {
    expect(parseColor("var(--color-accent)", [1, 2, 3])).toEqual([1, 2, 3]);
    expect(parseColor("red", [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("mixes and formats", () => {
    expect(mix([0, 0, 0], [100, 200, 50], 0.5)).toEqual([50, 100, 25]);
    expect(rgba([1, 2, 3], 0.5)).toBe("rgba(1,2,3,0.5)");
  });
});

describe("buildSkyline", () => {
  const skyline = buildSkyline(7, 0.2, 0.6, 0.3);

  it("is deterministic", () => {
    expect(buildSkyline(7, 0.2, 0.6, 0.3)).toEqual(skyline);
  });

  it("covers the whole span left to right", () => {
    expect(skyline[0].x).toBe(0);

    const last = skyline[skyline.length - 1];

    expect(last.x + last.width).toBeGreaterThanOrEqual(1);
  });

  it("keeps heights in range and window data consistent", () => {
    for (const building of skyline) {
      expect(building.height).toBeGreaterThanOrEqual(0.2);
      expect(building.height).toBeLessThanOrEqual(0.6);
      expect(building.lit).toHaveLength(building.cols * building.rows);
      expect(building.hue).toHaveLength(building.cols * building.rows);
    }
  });
});
