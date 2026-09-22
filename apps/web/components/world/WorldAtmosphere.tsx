"use client";

import type { WorldConfig } from "./WorldTypes";

interface WorldAtmosphereProps {
  config: WorldConfig;
}

export default function WorldAtmosphere({ config }: WorldAtmosphereProps) {
  return (
    <fog
      attach="fog"
      args={["#050608", config.atmosphere.fogNear, config.atmosphere.fogFar]}
    />
  );
}
