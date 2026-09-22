"use client";

import { Canvas } from "@react-three/fiber";

import type { PortfolioTheme } from "@/lib/theme";

import MascotFactory from "@/components/mascot/MascotFactory";

import WorldAtmosphere from "./WorldAtmosphere";
import WorldCamera from "./WorldCamera";
import WorldLighting from "./WorldLighting";
import type { WorldConfig } from "./WorldTypes";

interface WorldStageProps {
  config: WorldConfig;
  theme: PortfolioTheme;
}

function WorldScene({ config, theme }: WorldStageProps) {
  return (
    <>
      <WorldCamera config={config} />

      <WorldAtmosphere config={config} />

      <WorldLighting
        primary={theme.colors.cyan}
        secondary={theme.colors.red}
        foreground={theme.colors.white}
      />

      <MascotFactory theme={theme} worldId={config.id} />
    </>
  );
}

export default function WorldStage({ config, theme }: WorldStageProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.35]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: config.camera.position,
          fov: config.camera.fov,
          near: config.camera.near,
          far: config.camera.far,
        }}
      >
        <WorldScene config={config} theme={theme} />
      </Canvas>
    </div>
  );
}
