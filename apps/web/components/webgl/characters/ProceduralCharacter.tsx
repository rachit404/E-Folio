"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { CharacterDefinition } from "./CharacterTypes";

interface ProceduralCharacterProps {
  definition: CharacterDefinition;
}

export default function ProceduralCharacter({
  definition,
}: ProceduralCharacterProps) {
  const root = useRef<THREE.Group>(null);

  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (root.current) {
      root.current.position.y = Math.sin(time * 1.7) * 0.08;
      root.current.rotation.y = Math.sin(time * 0.45) * 0.12;
    }

    const swing = Math.sin(time * 1.8) * 0.12;

    if (leftArm.current) {
      leftArm.current.rotation.z = -0.12 + swing;
      leftArm.current.rotation.x = Math.sin(time * 1.8) * 0.06;
    }

    if (rightArm.current) {
      rightArm.current.rotation.z = 0.12 - swing;
      rightArm.current.rotation.x = -Math.sin(time * 1.8) * 0.06;
    }

    if (leftLeg.current) {
      leftLeg.current.rotation.x = -swing * 0.45;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x = swing * 0.45;
    }
  });

  const {
    body,
    secondary,
    accent,
    dark,
    scale,
    shoulderWidth,
    hipWidth,
    torsoWidth,
    limbRadius,
    limbLength,
    headScale,
    id,
  } = definition;

  return (
    <group ref={root} scale={scale}>
      {/* TORSO */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[torsoWidth, torsoWidth * 0.82, 1.35, 12]} />

        <meshStandardMaterial color={body} roughness={0.55} metalness={0.18} />
      </mesh>

      {/* HIPS */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[hipWidth, 0.38, 0.42]} />

        <meshStandardMaterial
          color={secondary}
          roughness={0.45}
          metalness={0.3}
        />
      </mesh>

      {/* HEAD */}
      <mesh position={[0, 2.86, 0]} castShadow>
        <sphereGeometry args={[headScale, 16, 16]} />

        <meshStandardMaterial color={body} roughness={0.5} metalness={0.16} />
      </mesh>

      {/* NECK / ENERGY RING */}
      <mesh position={[0, 2.35, 0]}>
        <torusGeometry args={[torsoWidth * 0.42, 0.025, 8, 32]} />

        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>

      {/* CHEST MARK */}
      <mesh position={[0, 2.0, torsoWidth + 0.018]}>
        <boxGeometry args={[0.16, 0.42, 0.035]} />

        <meshBasicMaterial color={accent} />
      </mesh>

      <mesh position={[0, 1.98, torsoWidth + 0.02]}>
        <sphereGeometry args={[0.07, 10, 10]} />

        <meshBasicMaterial color={dark} />
      </mesh>

      {/* EYES */}
      <mesh position={[-headScale * 0.22, 2.93, headScale * 0.86]}>
        <sphereGeometry args={[0.055, 8, 8]} />

        <meshBasicMaterial color={accent} />
      </mesh>

      <mesh position={[headScale * 0.22, 2.93, headScale * 0.86]}>
        <sphereGeometry args={[0.055, 8, 8]} />

        <meshBasicMaterial color={accent} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArm} position={[-shoulderWidth, 2.35, 0]}>
        <mesh position={[0, -limbLength * 0.48, 0]} castShadow>
          <cylinderGeometry
            args={[limbRadius, limbRadius * 0.82, limbLength, 10]}
          />

          <meshStandardMaterial
            color={body}
            roughness={0.55}
            metalness={0.18}
          />
        </mesh>

        <mesh position={[0, -limbLength, 0]} castShadow>
          <sphereGeometry args={[limbRadius * 1.15, 10, 10]} />

          <meshStandardMaterial
            color={secondary}
            roughness={0.5}
            metalness={0.25}
          />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArm} position={[shoulderWidth, 2.35, 0]}>
        <mesh position={[0, -limbLength * 0.48, 0]} castShadow>
          <cylinderGeometry
            args={[limbRadius, limbRadius * 0.82, limbLength, 10]}
          />

          <meshStandardMaterial
            color={body}
            roughness={0.55}
            metalness={0.18}
          />
        </mesh>

        <mesh position={[0, -limbLength, 0]} castShadow>
          <sphereGeometry args={[limbRadius * 1.15, 10, 10]} />

          <meshStandardMaterial
            color={secondary}
            roughness={0.5}
            metalness={0.25}
          />
        </mesh>
      </group>

      {/* LEFT LEG */}
      <group ref={leftLeg} position={[-hipWidth * 0.38, 0.9, 0]}>
        <mesh position={[0, -limbLength * 0.5, 0]} castShadow>
          <cylinderGeometry
            args={[limbRadius * 1.15, limbRadius, limbLength, 10]}
          />

          <meshStandardMaterial
            color={secondary}
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>

        <mesh position={[0, -limbLength, 0.08]} castShadow>
          <boxGeometry args={[limbRadius * 2.2, 0.24, limbRadius * 2.8]} />

          <meshStandardMaterial
            color={dark}
            roughness={0.45}
            metalness={0.35}
          />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightLeg} position={[hipWidth * 0.38, 0.9, 0]}>
        <mesh position={[0, -limbLength * 0.5, 0]} castShadow>
          <cylinderGeometry
            args={[limbRadius * 1.15, limbRadius, limbLength, 10]}
          />

          <meshStandardMaterial
            color={secondary}
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>

        <mesh position={[0, -limbLength, 0.08]} castShadow>
          <boxGeometry args={[limbRadius * 2.2, 0.24, limbRadius * 2.8]} />

          <meshStandardMaterial
            color={dark}
            roughness={0.45}
            metalness={0.35}
          />
        </mesh>
      </group>

      {/* SPIDER VARIANT */}
      {id === "spider" && (
        <group position={[0, 2.05, -torsoWidth * 0.7]}>
          {[-0.38, -0.19, 0, 0.19, 0.38].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.8, 6]} />

              <meshBasicMaterial color={accent} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* TITAN VARIANT */}
      {id === "titan" && (
        <group position={[0, 2.38, 0]}>
          <mesh position={[-shoulderWidth * 0.72, 0, 0]}>
            <sphereGeometry args={[0.24, 10, 10]} />

            <meshStandardMaterial color={accent} roughness={0.42} />
          </mesh>

          <mesh position={[shoulderWidth * 0.72, 0, 0]}>
            <sphereGeometry args={[0.24, 10, 10]} />

            <meshStandardMaterial color={accent} roughness={0.42} />
          </mesh>
        </group>
      )}

      {/* SENTINEL VARIANT */}
      {id === "sentinel" && (
        <mesh position={[0, 1.72, torsoWidth + 0.04]}>
          <circleGeometry args={[0.26, 16]} />

          <meshStandardMaterial
            color={secondary}
            roughness={0.35}
            metalness={0.55}
            emissive={accent}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
