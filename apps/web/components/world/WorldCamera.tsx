"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import type { WorldConfig } from "./WorldTypes";

interface WorldCameraProps {
  config: WorldConfig;
}

export default function WorldCamera({ config }: WorldCameraProps) {
  const { camera, pointer } = useThree();

  const basePosition = useMemo(
    () => new THREE.Vector3(...config.camera.position),
    [config.camera.position],
  );

  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    const targetX = basePosition.x + pointer.x * config.camera.parallax;

    const targetY = basePosition.y + pointer.y * config.camera.parallax * 0.6;

    target.set(targetX, targetY, basePosition.z);

    perspectiveCamera.position.lerp(target, 0.035);

    perspectiveCamera.lookAt(0, 0, 0);
  });

  return null;
}
