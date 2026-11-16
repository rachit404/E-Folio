import fs from "node:fs/promises";
import path from "node:path";

import { PortfolioSchema, type PortfolioData } from "../schema/portfolio";

import { parseDocument } from "../parser/parser";

/**
 * Resume .tex files are personal data and are NOT stored in git.
 *
 * Default:  <repo>/content/resumes
 * Override: PORTFOLIO_CONTENT_DIR=/path/to/dir/containing/.tex/files
 *           (used by CI / Vercel builds that fetch the resumes).
 */
function getResumeRoot(): string {
  const override = process.env.PORTFOLIO_CONTENT_DIR?.trim();

  if (override) {
    return path.resolve(override);
  }

  return path.join(process.cwd(), "..", "..", "content", "resumes");
}

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
  const resumeRoot = getResumeRoot();

  let entries;

  try {
    /*
     * Resumes intentionally live outside the app (gitignored), so
     * Turbopack must not try to trace/bundle this directory.
     */
    entries = await fs.readdir(/* turbopackIgnore: true */ resumeRoot, {
      withFileTypes: true,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `Resume directory not found: ${resumeRoot}. ` +
          `Add .tex resumes there (they are gitignored) or set ` +
          `PORTFOLIO_CONTENT_DIR to the directory that contains them.`,
      );
    }

    throw error;
  }

  const profiles = entries
    .filter((entry) => entry.isFile() && /\.tex$/i.test(entry.name))
    .map((entry) => entry.name.replace(/\.tex$/i, "").toLowerCase())
    .sort();

  if (!profiles.length) {
    throw new Error(`No .tex resumes found in ${resumeRoot}.`);
  }

  return profiles;
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

  const filePath = path.join(getResumeRoot(), fileName);

  const source = await fs.readFile(
    /* turbopackIgnore: true */ filePath,
    "utf-8",
  );

  /*
   * .tex → parser → structured portfolio
   */
  const parsed = parseDocument(source, fileName);

  /*
   * Parser output must satisfy the UI contract.
   */
  return PortfolioSchema.parse(parsed);
}
