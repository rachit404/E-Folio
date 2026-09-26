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

  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    const pointerX = THREE.MathUtils.clamp(pointer.x, -1, 1);

    const pointerY = THREE.MathUtils.clamp(pointer.y, -1, 1);

    const parallax = config.camera.parallax;

    targetPosition.set(
      basePosition.x + pointerX * parallax,
      basePosition.y + pointerY * parallax * 0.6,
      basePosition.z,
    );

    targetLook.set(pointerX * parallax * 0.18, pointerY * parallax * 0.12, 0);

    const positionEase = 1 - Math.exp(-4.8 * delta);

    const lookEase = 1 - Math.exp(-3.8 * delta);

    const projectionEase = 1 - Math.exp(-3.5 * delta);

    perspectiveCamera.position.lerp(targetPosition, positionEase);

    lookTarget.lerp(targetLook, lookEase);

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
