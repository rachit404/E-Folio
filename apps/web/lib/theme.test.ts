import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ThemeFileSchema, resolveTheme, type ThemeFile } from "./theme";

const colors = {
  void: "#000",
  graphite: "#111",
  panel: "#222",
  primary: "#0ff",
  accent: "#f00",
  white: "#fff",
  muted: "#999",
  dim: "#555",
};

function makeFile(overrides: Partial<ThemeFile> = {}): ThemeFile {
  return ThemeFileSchema.parse({
    identity: { name: "Jane", shortName: "J", universe: "U" },
    default: "alpha",
    roles: {},
    presets: {
      alpha: { colors },
      beta: {
        identity: { universe: "BETA-U" },
        colors: { ...colors, primary: "#0f0" },
      },
    },
    ...overrides,
  });
}

describe("resolveTheme", () => {
  it("uses the default preset when the role is not listed", () => {
    const theme = resolveTheme(makeFile(), "sde");

    expect(theme.id).toBe("alpha");
    expect(theme.colors.primary).toBe("#0ff");
  });

  it("uses the preset mapped to the role, case-insensitively", () => {
    const theme = resolveTheme(makeFile({ roles: { DevOps: "beta" } }), "devops");

    expect(theme.id).toBe("beta");
    expect(theme.colors.primary).toBe("#0f0");
  });

  it("merges preset identity overrides onto the shared identity", () => {
    const theme = resolveTheme(makeFile({ roles: { ai: "beta" } }), "ai");

    expect(theme.identity).toEqual({
      name: "Jane",
      shortName: "J",
      universe: "BETA-U",
    });
  });

  it("falls back to the default without a role", () => {
    expect(resolveTheme(makeFile()).id).toBe("alpha");
  });
});

describe("ThemeFileSchema", () => {
  it("rejects an unknown default preset", () => {
    expect(() => makeFile({ default: "missing" })).toThrow(/Default preset/);
  });

  it("rejects a role that points at an unknown preset", () => {
    expect(() => makeFile({ roles: { sde: "missing" } })).toThrow(
      /unknown preset/,
    );
  });
});

describe("public/assets/theme.json", () => {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "public", "assets", "theme.json"),
    "utf-8",
  );

  it("is valid and defaults to the Spider-Man preset", () => {
    const file = ThemeFileSchema.parse(JSON.parse(raw));

    expect(file.default).toBe("spiderman");
    expect(Object.keys(file.presets)).toContain("hulk");
  });
});

describe("scene and copy config", () => {
  const file = (extra: Record<string, unknown>) =>
    ThemeFileSchema.parse({
      identity: { name: "J", shortName: "J", universe: "U" },
      default: "a",
      presets: {
        a: {
          colors: {
            void: "#000", graphite: "#111", panel: "#222", primary: "#0ff",
            accent: "#f00", white: "#fff", muted: "#999", dim: "#555",
          },
          ...extra,
        },
      },
    });

  it("defaults copy to the comps' editable wording", () => {
    const { copy } = file({}).presets.a;

    expect(copy.taglineTop).toBe("Same mind. Different universe.");
    expect(copy.pillars).toHaveLength(4);
    expect(copy.roles).toEqual(["Engineer", "Builder", "Curious mind"]);
  });

  it("lets a preset override copy fields independently", () => {
    const { copy } = file({ copy: { intro: "Hello." } }).presets.a;

    expect(copy.intro).toBe("Hello.");
    expect(copy.taglineTop).toBe("Same mind. Different universe.");
  });

  it("accepts a scene manifest and fills defaults", () => {
    const { scenes } = file({
      scenes: { home: { frames: 120, pattern: "/s/home/{n}.webp" } },
    }).presets.a;

    expect(scenes.home).toMatchObject({
      frames: 120,
      pad: 4,
      focal: [0.5, 0.5],
      push: 1,
    });
  });

  it("rejects a scene pattern without {n}", () => {
    expect(() =>
      file({ scenes: { home: { frames: 10, pattern: "/s/home.webp" } } }),
    ).toThrow(/\{n\}/);
  });

  it("has no scenes configured by default (placeholder art)", () => {
    expect(file({}).presets.a.scenes).toEqual({});
  });
});

describe("backwards compatibility", () => {
  it("ignores leftover keys from the old theme format", () => {
    const parsed = ThemeFileSchema.parse({
      identity: { name: "J", shortName: "J", universe: "U" },
      default: "a",
      presets: {
        a: {
          colors,
          hero: { eyebrow: "old" },
          navigation: { showNumbers: true },
          mascot: { enabled: true },
          comic: { borderWidth: 4 },
        },
      },
    });

    expect(Object.keys(parsed.presets.a)).not.toContain("hero");
    expect(Object.keys(parsed.presets.a)).not.toContain("comic");
  });
});
