"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DynamicModelProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function DynamicModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: DynamicModelProps) {
  const { scene } = useGLTF(src);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.envMapIntensity = 1.5;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}
