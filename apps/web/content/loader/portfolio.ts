import fs from "node:fs/promises";
import path from "node:path";

import { PortfolioSchema, type PortfolioData } from "../schema/portfolio";

const contentRoot = path.join(
  process.cwd(),
  "..",
  "..",
  "content",
  "generated",
);

export async function loadPortfolio(profile = "main"): Promise<PortfolioData> {
  const filePath = path.join(contentRoot, `${profile}.json`);

  const raw = await fs.readFile(filePath, "utf-8");

  const parsed: unknown = JSON.parse(raw);

  return PortfolioSchema.parse(parsed);
}
