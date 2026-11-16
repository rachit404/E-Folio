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

const HeroSchema = z.object({
  backgroundImage: z.string(),
  foregroundImage: z.string(),
  character: z.string(),
  eyebrow: z.string(),
  status: z.string(),
  cta: z.string(),
  scrollLabel: z.string(),
});

const WorldSchema = z.object({
  defaultWorld: z.string().optional(),
  backgroundOpacity: z.number().optional(),
  enableParallax: z.boolean().optional(),
  enableAtmosphere: z.boolean().optional(),
  /**
   * Optional per-world background image overrides
   * (world id -> public path). Missing worlds use the default art
   * from lib/worlds.ts.
   */
  backgrounds: z.record(z.string(), z.string()).optional(),
});

const MascotSchema = z.object({
  id: z.string().optional(),
  enabled: z.boolean().optional(),
  scale: z.number().optional(),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
});

/**
 * One visual preset (Spider-Man, Hulk, ...).
 */
const PresetSchema = z.object({
  /** Optional per-preset overrides of the shared identity. */
  identity: IdentitySchema.partial().optional(),
  colors: ColorsSchema,
  hero: HeroSchema,
  navigation: z.object({
    showNumbers: z.boolean(),
  }),
  world: WorldSchema.optional(),
  mascot: MascotSchema.optional(),
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

  hero: z.infer<typeof HeroSchema>;

  navigation: {
    showNumbers: boolean;
  };

  world?: z.infer<typeof WorldSchema>;

  mascot?: z.infer<typeof MascotSchema>;
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
