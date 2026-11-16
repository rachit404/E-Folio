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

const hero = {
  backgroundImage: "",
  foregroundImage: "",
  character: "c",
  eyebrow: "eyebrow",
  status: "status",
  cta: "cta",
  scrollLabel: "scroll",
};

function makeFile(overrides: Partial<ThemeFile> = {}): ThemeFile {
  return ThemeFileSchema.parse({
    identity: { name: "Jane", shortName: "J", universe: "U" },
    default: "alpha",
    roles: {},
    presets: {
      alpha: { colors, hero, navigation: { showNumbers: true } },
      beta: {
        identity: { universe: "BETA-U" },
        colors: { ...colors, primary: "#0f0" },
        hero,
        navigation: { showNumbers: false },
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
    expect(theme.navigation.showNumbers).toBe(false);
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
