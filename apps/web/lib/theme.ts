import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const IdentitySchema = z.object({
  name: z.string(),
  shortName: z.string(),
  universe: z.string(),
});

const ColorsSchema = z.object({
  void: z.string(),
  graphite: z.string(),
  panel: z.string(),
  primary: z.string(),
  accent: z.string(),
  white: z.string(),
  muted: z.string(),
  dim: z.string(),
});

/**
 * Frame sequence for one scene (see tools/frames.mjs). A scene with no
 * entry here is drawn by the procedural placeholder instead.
 */
export const SceneSchema = z.object({
  frames: z.number().int().positive(),
  /** URL with an {n} placeholder, e.g. "/assets/scenes/home/{n}.webp". */
  pattern: z.string().refine((value) => value.includes("{n}"), {
    message: "pattern must contain {n}",
  }),
  mobilePattern: z.string().optional(),
  mobileFrames: z.number().int().positive().optional(),
  pad: z.number().int().min(1).max(8).default(4),
  /** Subject position 0..1, used when cropping to the viewport. */
  focal: z.tuple([z.number(), z.number()]).default([0.5, 0.5]),
  /** Zoom at the end of the scene (1 = none); stills use ~1.12. */
  push: z.number().min(1).max(2).default(1),
});

/**
 * Short, editable wording from the design comps. Facts about the
 * person (name, course, projects, ...) never live here: they come
 * from the resume.
 */
export const CopySchema = z.object({
  taglineTop: z.string().default("Same mind. Different universe."),
  taglineFooter: z
    .string()
    .default("Built in another universe for a brighter one."),
  greeting: z.string().default("Hey, I'm"),
  roles: z.array(z.string()).default(["Engineer", "Builder", "Curious mind"]),
  intro: z
    .string()
    .default(
      "Turning ideas into impactful tech, with a bit of creativity, a lot of curiosity, and a vision for a bigger tomorrow.",
    ),
  /** About paragraphs shown after the facts taken from the resume. */
  about: z
    .array(z.string())
    .default([
      "I explore the intersection of software, AI, and cybersecurity: building, breaking, and learning my way towards a more interesting tomorrow.",
    ]),
  /** Handwritten notes scattered through the scenes. */
  notes: z
    .array(z.string())
    .default(["Build. Break. Learn. Repeat.", "A better version ahead", "Ideas. Code. Impact."]),
  pillars: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
        tags: z.array(z.string()).default([]),
      }),
    )
    .default([
      {
        title: "Engineering",
        text: "Turning ideas into scalable, real-world solutions.",
        tags: ["System design", "Full stack", "Dev tools"],
      },
      {
        title: "AI / ML",
        text: "Exploring intelligent systems to solve meaningful problems.",
        tags: ["LLMs", "Data science", "Generative AI"],
      },
      {
        title: "Cybersecurity",
        text: "Understanding systems deeply by breaking and securing them.",
        tags: ["Networking", "Linux", "Security research"],
      },
      {
        title: "Experimentation",
        text: "Always building, always learning, always curious.",
        tags: ["Side projects", "New tech", "Open source"],
      },
    ]),
  ctaPrimary: z.string().default("Explore my work"),
  ctaSecondary: z.string().default("Download resume"),
});

export const GAME_IDS = ["match", "decode", "target"] as const;

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type GameId = (typeof GAME_IDS)[number];

export type Difficulty = (typeof DIFFICULTIES)[number];

/**
 * Optional mini-games that can gate a section's details.
 *
 * Games are theme-neutral puzzles; a preset only chooses which
 * section gets which game and how hard it is. A section that is not
 * listed here is never gated.
 */
export const GamesSchema = z.object({
  /** Ask visitors on their first visit whether they want to play. */
  prompt: z.boolean().default(true),
  /** Section id -> game. */
  sections: z
    .record(
      z.string(),
      z.object({
        game: z.enum(GAME_IDS),
        difficulty: z.enum(DIFFICULTIES).default("easy"),
      }),
    )
    .default({}),
});

/**
 * One visual preset (Spider-Man, Hulk, ...).
 */
const PresetSchema = z.object({
  /** Optional per-preset overrides of the shared identity. */
  identity: IdentitySchema.partial().optional(),
  colors: ColorsSchema,
  games: GamesSchema.prefault({}),
  copy: CopySchema.prefault({}),
  scenes: z.record(z.string(), SceneSchema).default({}),
});

/**
 * public/assets/theme.json
 *
 * - `identity`  shared by every preset
 * - `presets`   all available looks
 * - `default`   preset used by every resume role...
 * - `roles`     ...unless the role is listed here (role -> preset id)
 */
export const ThemeFileSchema = z
  .object({
    identity: IdentitySchema,
    default: z.string(),
    roles: z.record(z.string(), z.string()).default({}),
    presets: z.record(z.string(), PresetSchema),
  })
  .superRefine((file, context) => {
    if (!file.presets[file.default]) {
      context.addIssue({
        code: "custom",
        path: ["default"],
        message: `Default preset "${file.default}" is not defined in presets.`,
      });
    }

    for (const [role, preset] of Object.entries(file.roles)) {
      if (!file.presets[preset]) {
        context.addIssue({
          code: "custom",
          path: ["roles", role],
          message: `Role "${role}" uses unknown preset "${preset}".`,
        });
      }
    }
  });

export type ThemeFile = z.infer<typeof ThemeFileSchema>;

export interface PortfolioTheme {
  /** Resolved preset id, e.g. "spiderman". */
  id: string;

  identity: z.infer<typeof IdentitySchema>;

  colors: z.infer<typeof ColorsSchema>;

  games: z.infer<typeof GamesSchema>;

  copy: z.infer<typeof CopySchema>;

  scenes: Record<string, z.infer<typeof SceneSchema>>;
}

/**
 * Pure resolution step (no I/O) so it can be unit tested.
 *
 * Role lookup is case-insensitive and falls back to `default`.
 */
export function resolveTheme(file: ThemeFile, role?: string): PortfolioTheme {
  const normalizedRole = role?.trim().toLowerCase();

  const roleEntry = normalizedRole
    ? Object.entries(file.roles).find(
        ([name]) => name.toLowerCase() === normalizedRole,
      )
    : undefined;

  const id = roleEntry ? roleEntry[1] : file.default;

  const { identity: identityOverride, ...preset } = file.presets[id];

  return {
    id,
    identity: { ...file.identity, ...identityOverride },
    ...preset,
  };
}

export async function loadTheme(role?: string): Promise<PortfolioTheme> {
  const filePath = path.join(process.cwd(), "public", "assets", "theme.json");

  const raw = await fs.readFile(filePath, "utf-8");

  const file = ThemeFileSchema.parse(JSON.parse(raw));

  return resolveTheme(file, role);
}
