"use client";

import type { RefObject } from "react";
import type * as THREE from "three";

import type { MascotConfig } from "./MascotTypes";

interface MascotBuilderProps {
  config: MascotConfig;
  rootRef: RefObject<THREE.Group | null>;
}

const LEG_LAYOUT = [
  {
    side: -1,
    index: 0,
    y: 0.95,
    z: 0.16,
    rotation: -0.52,
    length: 0.78,
  },
  {
    side: -1,
    index: 1,
    y: 0.72,
    z: 0.08,
    rotation: -0.34,
    length: 0.9,
  },
  {
    side: -1,
    index: 2,
    y: 0.48,
    z: 0,
    rotation: -0.2,
    length: 0.98,
  },
  {
    side: -1,
    index: 3,
    y: 0.24,
    z: -0.08,
    rotation: -0.08,
    length: 0.84,
  },

  {
    side: 1,
    index: 0,
    y: 0.95,
    z: 0.16,
    rotation: 0.52,
    length: 0.78,
  },
  {
    side: 1,
    index: 1,
    y: 0.72,
    z: 0.08,
    rotation: 0.34,
    length: 0.9,
  },
  {
    side: 1,
    index: 2,
    y: 0.48,
    z: 0,
    rotation: 0.2,
    length: 0.98,
  },
  {
    side: 1,
    index: 3,
    y: 0.24,
    z: -0.08,
    rotation: 0.08,
    length: 0.84,
  },
] as const;

function SpiderLeg({
  side,
  index,
  y,
  z,
  rotation,
  length,
  primary,
  secondary,
}: {
  side: number;
  index: number;
  y: number;
  z: number;
  rotation: number;
  length: number;
  primary: string;
  secondary: string;
}) {
  return (
    <group
      name={`leg-${side < 0 ? "left" : "right"}-${index}`}
      position={[side * 0.38, y, z]}
      rotation={[0, 0, rotation]}
    >
      <mesh
        position={[side * 0.34, -0.02, 0]}
        rotation={[0, 0, side * Math.PI * 0.18]}
        castShadow
      >
        <cylinderGeometry args={[0.065, 0.08, length, 8]} />

        <meshStandardMaterial
          color={primary}
          roughness={0.48}
          metalness={0.28}
        />
      </mesh>

      <mesh
        position={[side * 0.7, -0.05, 0]}
        rotation={[0, 0, side * Math.PI * 0.08]}
        castShadow
      >
        <cylinderGeometry args={[0.04, 0.055, length * 0.7, 8]} />

        <meshStandardMaterial
          color={secondary}
          roughness={0.4}
          metalness={0.38}
        />
      </mesh>

      <mesh position={[side * 0.98, -0.08, 0]}>
        <sphereGeometry args={[0.075, 8, 8]} />

        <meshStandardMaterial
          color={primary}
          roughness={0.4}
          metalness={0.35}
        />
      </mesh>
    </group>
  );
}

export default function MascotBuilder({ config, rootRef }: MascotBuilderProps) {
  return (
    <group
      ref={rootRef}
      scale={config.scale}
      position={config.position ?? [2.1, -0.75, 0]}
    >
      <group name="mascot-rig">
        {/* Main abdomen */}
        <mesh position={[0, 0.45, -0.08]} scale={[0.78, 0.85, 0.62]} castShadow>
          <sphereGeometry args={[0.62, 20, 16]} />

          <meshStandardMaterial
            color={config.secondary}
            roughness={0.4}
            metalness={0.42}
          />
        </mesh>

        {/* Chest */}
        <mesh position={[0, 0.82, 0.06]} scale={[0.7, 0.78, 0.52]} castShadow>
          <sphereGeometry args={[0.58, 20, 16]} />

          <meshStandardMaterial
            color={config.primary}
            roughness={0.48}
            metalness={0.24}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.42, 0.04]} scale={[0.68, 0.58, 0.58]} castShadow>
          <sphereGeometry args={[0.55, 20, 16]} />

          <meshStandardMaterial
            color={config.primary}
            roughness={0.42}
            metalness={0.24}
          />
        </mesh>

        {/* Face mask */}
        <mesh position={[0, 1.4, 0.52]} scale={[0.52, 0.34, 0.08]}>
          <sphereGeometry args={[0.6, 16, 12]} />

          <meshStandardMaterial
            color={config.secondary}
            roughness={0.32}
            metalness={0.5}
          />
        </mesh>

        {/* Left eye */}
        <mesh position={[-0.19, 1.48, 0.98]}>
          <sphereGeometry args={[0.105, 12, 10]} />

          <meshBasicMaterial color={config.accent} />
        </mesh>

        {/* Right eye */}
        <mesh position={[0.19, 1.48, 0.98]}>
          <sphereGeometry args={[0.105, 12, 10]} />

          <meshBasicMaterial color={config.accent} />
        </mesh>

        {/* Chest core */}
        <mesh position={[0, 0.86, 0.58]}>
          <sphereGeometry args={[0.105, 12, 12]} />

          <meshBasicMaterial color={config.accent} />
        </mesh>

        {/* Spider/web chest lines */}
        <group position={[0, 0.84, 0.61]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.035, 0.85, 0.018]} />

            <meshBasicMaterial
              color={config.accent}
              transparent
              opacity={0.75}
            />
          </mesh>

          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.035, 0.85, 0.018]} />

            <meshBasicMaterial
              color={config.accent}
              transparent
              opacity={0.75}
            />
          </mesh>

          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.025, 0.72, 0.018]} />

            <meshBasicMaterial
              color={config.accent}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>

        {/* Spider legs */}
        {LEG_LAYOUT.map((leg) => (
          <SpiderLeg
            key={`${leg.side}-${leg.index}`}
            {...leg}
            primary={config.primary}
            secondary={config.secondary}
          />
        ))}

        {/* Small energy ring */}
        <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.74, 0.018, 8, 48]} />

          <meshBasicMaterial color={config.accent} transparent opacity={0.45} />
        </mesh>
      </group>
    </group>
  );
}
