import fs from "node:fs/promises";
import path from "node:path";

import { PortfolioSchema, type PortfolioData } from "../schema/portfolio";

import { parseDocument } from "../parser/parser";

const resumeRoot = path.join(process.cwd(), "..", "..", "content", "resumes");

function normalizeProfile(profile: string): string {
  return profile
    .trim()
    .toLowerCase()
    .replace(/\.tex$/i, "");
}

/**
 * Discover every .tex resume in content/resumes.
 *
 * Adding a new .tex file automatically creates
 * another available portfolio role.
 */
export async function listProfiles(): Promise<string[]> {
  const entries = await fs.readdir(resumeRoot, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && /\.tex$/i.test(entry.name))
    .map((entry) => entry.name.replace(/\.tex$/i, "").toLowerCase())
    .sort();
}

/**
 * Load and parse a specific .tex portfolio.
 */
export async function loadPortfolio(profile = "sde"): Promise<PortfolioData> {
  const normalizedProfile = normalizeProfile(profile);

  if (!/^[a-z0-9_-]+$/.test(normalizedProfile)) {
    throw new Error(`Invalid portfolio profile: ${profile}`);
  }

  const profiles = await listProfiles();

  if (!profiles.includes(normalizedProfile)) {
    throw new Error(
      `Portfolio profile "${normalizedProfile}" does not exist. ` +
        `Available profiles: ${profiles.join(", ")}`,
    );
  }

  const fileName = `${normalizedProfile}.tex`;

  const filePath = path.join(resumeRoot, fileName);

  const source = await fs.readFile(filePath, "utf-8");

  /*
   * .tex → parser → structured portfolio
   */
  const parsed = parseDocument(source, fileName);

  /*
   * Parser output must satisfy the UI contract.
   */
  return PortfolioSchema.parse(parsed);
}
