import { describe, expect, it } from "vitest";

import {
  ComicSchema,
  CopySchema,
  GamesSchema,
  type PortfolioTheme,
} from "./theme";
import { WORLD_CONFIGS, getWorldConfig } from "./worlds";

function themeWith(backgrounds?: Record<string, string>): PortfolioTheme {
  return {
    id: "test",
    identity: { name: "n", shortName: "n", universe: "u" },
    colors: {
      void: "#000",
      graphite: "#000",
      panel: "#000",
      primary: "#fff",
      accent: "#fff",
      white: "#fff",
      muted: "#fff",
      dim: "#fff",
    },
    hero: {
      backgroundImage: "",
      foregroundImage: "",
      character: "c",
      eyebrow: "",
      status: "",
      cta: "",
      scrollLabel: "",
    },
    navigation: { showNumbers: true },
    world: backgrounds ? { backgrounds } : undefined,
    comic: ComicSchema.parse({}),
    games: GamesSchema.parse({}),
    copy: CopySchema.parse({}),
    scenes: {},
  };
}

describe("getWorldConfig", () => {
  it("returns the default art without a theme", () => {
    expect(getWorldConfig("about")).toBe(WORLD_CONFIGS.about);
  });

  it("returns the default art when the theme has no override", () => {
    expect(getWorldConfig("about", themeWith())).toBe(WORLD_CONFIGS.about);
  });

  it("applies a per-world background override only to that world", () => {
    const theme = themeWith({ about: "/assets/worlds/hulk/about.png" });

    expect(getWorldConfig("about", theme).background).toBe(
      "/assets/worlds/hulk/about.png",
    );

    expect(getWorldConfig("skills", theme)).toBe(WORLD_CONFIGS.skills);
  });
});
