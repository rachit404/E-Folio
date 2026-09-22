"use client";

import { useEffect, useRef } from "react";

import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

import type { MascotControllerProps, MascotState } from "./MascotTypes";

import { animateMascot } from "./MascotAnimation";
import MascotBuilder from "./MascotBuilder";

const WORLD_POSITIONS: Record<
  MascotControllerProps["worldId"],
  [number, number, number]
> = {
  home: [2.1, -0.75, 0],
  about: [-2.2, 0.1, 0.25],
  experience: [2.15, -0.45, 0.15],
  projects: [2.15, -0.2, 0.2],
  "case-study": [-2, 0.15, 0.1],
  skills: [-2.05, 0.35, 0.2],
  contact: [1.95, -0.55, 0.1],
  loading: [0, 0, 0],
  "404": [1.8, -0.3, 0],
};

export default function MascotController({
  config,
  worldId,
}: MascotControllerProps) {
  const root = useRef<THREE.Group>(null);

  const reducedMotion = useRef(false);

  const transitionStarted = useRef(0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    transitionStarted.current = performance.now();
  }, [worldId]);

  useFrame((state) => {
    if (!root.current) {
      return;
    }

    const target = WORLD_POSITIONS[worldId];

    const targetVector = new THREE.Vector3(target[0], target[1], target[2]);

    root.current.position.lerp(
      targetVector,
      reducedMotion.current ? 0.12 : 0.045,
    );

    if (config.interaction?.followPointer) {
      root.current.rotation.y +=
        (state.pointer.x * 0.12 - root.current.rotation.y) * 0.02;
    }

    const transitionAge =
      (performance.now() - transitionStarted.current) / 1000;

    const mascotState: MascotState = reducedMotion.current
      ? "idle"
      : transitionAge < 1.1
        ? "travel"
        : "idle";

    const rig = root.current.getObjectByName("mascot-rig");

    if (rig) {
      animateMascot(
        root.current,
        rig as THREE.Group,
        state.clock.elapsedTime,
        mascotState,
      );
    }
  });

  return <MascotBuilder config={config} rootRef={root} />;
}
