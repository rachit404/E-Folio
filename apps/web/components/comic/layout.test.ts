import { describe, expect, it } from "vitest";

import { panelSpans } from "./layout";

describe("panelSpans", () => {
  it("returns nothing for no panels", () => {
    expect(panelSpans(0)).toEqual([]);
  });

  it("makes a single panel full width", () => {
    expect(panelSpans(1)).toEqual([true]);
  });

  it("makes both panels of a pair full width (splash + closer)", () => {
    expect(panelSpans(2)).toEqual([true, true]);
  });

  it("pairs the rest after the splash when the count is odd", () => {
    expect(panelSpans(3)).toEqual([true, false, false]);
    expect(panelSpans(5)).toEqual([true, false, false, false, false]);
  });

  it("spans the last panel when one would be left alone", () => {
    expect(panelSpans(4)).toEqual([true, false, false, true]);
    expect(panelSpans(6)).toEqual([true, false, false, false, false, true]);
  });
});
