import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { CopySchema } from "@/lib/theme";

/**
 * Optional, gitignored extras that sit next to the resumes:
 *
 *   content/resumes/<role>.pdf        -> "Download resume" button
 *   content/site/<role>.json          -> extra copy for that role
 *   content/site/default.json         -> extra copy for every role
 *
 * Everything is optional; the UI hides what is missing. Personal
 * facts always come from the .tex resume, never from here.
 */

/**
 * Every field optional and WITHOUT defaults: CopySchema.partial() would
 * still fill defaults and silently reset fields the file never mentioned.
 */
const CopyOverrideSchema = z
  .object({
    taglineTop: z.string(),
    taglineFooter: z.string(),
    greeting: z.string(),
    roles: z.array(z.string()),
    intro: z.string(),
    about: z.array(z.string()),
    notes: z.array(z.string()),
    pillars: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        tags: z.array(z.string()).default([]),
      }),
    ),
    ctaPrimary: z.string(),
    ctaSecondary: z.string(),
  } satisfies Record<keyof z.infer<typeof CopySchema>, z.ZodType>)
  .partial()
  .strict();

const SiteSchema = z.object({
  /** Overrides individual fields of the theme's copy block. */
  copy: CopyOverrideSchema.optional(),
});

export type SiteExtras = z.infer<typeof SiteSchema>;

/** Same folder the resume loader reads (PORTFOLIO_CONTENT_DIR or content/resumes). */
function resumesDir(): string {
  const override = process.env.PORTFOLIO_CONTENT_DIR?.trim();

  return override
    ? path.resolve(override)
    : path.join(process.cwd(), "..", "..", "content", "resumes");
}

/** Optional extras live in a "site" folder beside the resumes folder. */
function siteDir(): string {
  return path.join(resumesDir(), "..", "site");
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(/* turbopackIgnore: true */ file);

    return true;
  } catch {
    return false;
  }
}

function safeRole(role: string): string | null {
  const normalized = role.trim().toLowerCase();

  return /^[a-z0-9_-]+$/.test(normalized) ? normalized : null;
}

/** Roles that have a compiled resume PDF next to their .tex. */
export async function listResumePdfs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(/* turbopackIgnore: true */ resumesDir());

    return entries
      .filter((name) => /\.pdf$/i.test(name))
      .map((name) => name.replace(/\.pdf$/i, "").toLowerCase())
      .sort();
  } catch {
    return [];
  }
}

export async function hasResumePdf(role: string): Promise<boolean> {
  const safe = safeRole(role);

  return safe !== null && (await listResumePdfs()).includes(safe);
}

export async function readResumePdf(role: string): Promise<Buffer | null> {
  const safe = safeRole(role);

  if (!safe || !(await hasResumePdf(safe))) {
    return null;
  }

  // The file name on disk may differ in case from the role.
  const entries = await fs.readdir(/* turbopackIgnore: true */ resumesDir());

  const match = entries.find((name) => name.toLowerCase() === `${safe}.pdf`);

  return match
    ? fs.readFile(/* turbopackIgnore: true */ path.join(resumesDir(), match))
    : null;
}

async function readJson(file: string): Promise<unknown | null> {
  if (!(await exists(file))) {
    return null;
  }

  return JSON.parse(await fs.readFile(/* turbopackIgnore: true */ file, "utf-8"));
}

/** Default extras overlaid with the role's own; invalid files throw. */
export async function loadSiteExtras(role: string): Promise<SiteExtras> {
  const safe = safeRole(role);

  const dir = siteDir();

  const base = await readJson(path.join(dir, "default.json"));
  const own = safe ? await readJson(path.join(dir, `${safe}.json`)) : null;

  const parsedBase = base ? SiteSchema.parse(base) : {};
  const parsedOwn = own ? SiteSchema.parse(own) : {};

  return {
    copy: { ...parsedBase.copy, ...parsedOwn.copy },
  };
}

/** Theme copy with the optional site overrides applied. */
export function applyExtras<T extends object>(copy: T, extras: SiteExtras): T {
  return { ...copy, ...(extras.copy ?? {}) };
}
