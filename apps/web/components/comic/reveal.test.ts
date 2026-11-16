import { describe, expect, it } from "vitest";

import { frameLabel, revealVars } from "./reveal";

describe("revealVars", () => {
  it("pops panels up and alternates the tilt direction", () => {
    const even = revealVars("pop", 0);
    const odd = revealVars("pop", 1);

    expect(even.from).toMatchObject({ opacity: 0, y: 46, scale: 0.94 });
    expect(even.to).toMatchObject({ opacity: 1, y: 0, scale: 1, rotate: 0 });

    expect(even.from.rotate).toBe(-1.4);
    expect(odd.from.rotate).toBe(1.4);
  });

  it("slides panels in from alternating sides", () => {
    expect(revealVars("slide", 0).from.x).toBe(-90);
    expect(revealVars("slide", 1).from.x).toBe(90);
    expect(revealVars("slide", 1).to.x).toBe(0);
  });

  it("wipes with clip-path only for the wipe style", () => {
    expect(revealVars("wipe", 0).from.clipPath).toBe("inset(0% 100% 0% 0%)");

    // clip-path would clip the panel's hard offset shadow.
    expect(revealVars("pop", 0).from.clipPath).toBeUndefined();
    expect(revealVars("slide", 0).from.clipPath).toBeUndefined();
  });
});

describe("frameLabel", () => {
  it("zero-pads the current and total frame", () => {
    expect(frameLabel(3, 8)).toBe("FRAME 03/08");
    expect(frameLabel(0, 0)).toBe("FRAME 00/00");
    expect(frameLabel(12, 12)).toBe("FRAME 12/12");
  });
});
