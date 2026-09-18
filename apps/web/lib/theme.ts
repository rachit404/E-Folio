import fs from "node:fs/promises";
import path from "node:path";

export interface PortfolioTheme {
  identity: {
    name: string;
    shortName: string;
    universe: string;
  };

  colors: {
    void: string;
    graphite: string;
    panel: string;
    cyan: string;
    red: string;
    white: string;
    muted: string;
    dim: string;
  };

  hero: {
    backgroundImage: string;
    foregroundImage: string;
    model: string;
    eyebrow: string;
    status: string;
    cta: string;
    scrollLabel: string;
  };

  navigation: {
    showNumbers: boolean;
  };
}

export async function loadTheme(): Promise<PortfolioTheme> {
  const filePath = path.join(process.cwd(), "public", "assets", "theme.json");

  const raw = await fs.readFile(filePath, "utf-8");

  return JSON.parse(raw) as PortfolioTheme;
}
