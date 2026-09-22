"use client";

import type { PortfolioTheme } from "@/lib/theme";

import type { WorldId } from "@/components/world/WorldTypes";

import MascotController from "./MascotController";

interface MascotFactoryProps {
  theme: PortfolioTheme;
  worldId: WorldId;
}

const DEFAULT_MASCOT = {
  id: "spider-engineer",
  enabled: true,
  scale: 0.78,
  primary: "#b51232",
  secondary: "#0b1530",
  accent: "#00e5ff",
};

export default function MascotFactory({ theme, worldId }: MascotFactoryProps) {
  const mascot = {
    ...DEFAULT_MASCOT,
    ...theme.mascot,
  };

  if (!mascot.enabled) {
    return null;
  }

  return (
    <MascotController
      worldId={worldId}
      config={{
        id: mascot.id ?? DEFAULT_MASCOT.id,
        enabled: mascot.enabled ?? true,
        scale: mascot.scale ?? DEFAULT_MASCOT.scale,
        primary: mascot.primary ?? DEFAULT_MASCOT.primary,
        secondary: mascot.secondary ?? DEFAULT_MASCOT.secondary,
        accent: mascot.accent ?? DEFAULT_MASCOT.accent,
        interaction: {
          enabled: true,
          followPointer: true,
        },
      }}
    />
  );
}
