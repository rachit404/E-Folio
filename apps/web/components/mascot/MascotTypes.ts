import type { WorldId } from "@/components/world/WorldTypes";

export type MascotState = "idle" | "travel" | "focus";

export interface MascotConfig {
  id: string;
  enabled: boolean;

  scale: number;

  primary: string;
  secondary: string;
  accent: string;

  position?: [number, number, number];

  interaction?: {
    enabled?: boolean;
    followPointer?: boolean;
  };
}

export interface MascotControllerProps {
  config: MascotConfig;
  worldId: WorldId;
}
