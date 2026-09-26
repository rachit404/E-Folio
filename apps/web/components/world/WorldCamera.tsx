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

  const targetPosition = useMemo(() => new THREE.Vector3(), []);

  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_, delta) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    const targetX = basePosition.x + pointer.x * config.camera.parallax;

    const targetY = basePosition.y + pointer.y * config.camera.parallax * 0.6;

    targetPosition.set(targetX, targetY, basePosition.z);

    const positionEase = 1 - Math.exp(-5.5 * delta);

    const projectionEase = 1 - Math.exp(-4.5 * delta);

    perspectiveCamera.position.lerp(targetPosition, positionEase);

    perspectiveCamera.fov = THREE.MathUtils.lerp(
      perspectiveCamera.fov,
      config.camera.fov,
      projectionEase,
    );

    perspectiveCamera.lookAt(lookTarget);

    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}
