"use client";

import { useEffect, useMemo, useRef } from "react";

import { useAnimations, useGLTF } from "@react-three/drei";

import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

interface DynamicModelProps {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];

  /**
   * Target world-space height before the
   * additional `scale` multiplier is applied.
   */
  targetHeight?: number;

  /**
   * Automatically normalize the model so
   * arbitrary character assets have a
   * predictable size and origin.
   */
  autoFrame?: boolean;

  /**
   * Optional animation name.
   *
   * If omitted, the first animation embedded
   * in the GLTF is played automatically.
   */
  animationName?: string;
}

export default function DynamicModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  targetHeight = 3.2,
  autoFrame = true,
  animationName,
}: DynamicModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF(src);

  /*
   * GLTFLoader caches loaded scenes.
   *
   * SkeletonUtils.clone() gives each rendered
   * character its own skeleton, which is
   * important for animated/skinned characters.
   */
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  /*
   * Normalize the model once.
   *
   * This means a character downloaded from
   * one source does not need the same scale
   * as a character downloaded from another.
   */
  useMemo(() => {
    model.updateMatrixWorld(true);

    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        /*
         * Keep materials compatible with
         * the existing cinematic lighting.
         */
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = 1.5;
          }
        });
      }
    });

    if (!autoFrame) {
      return;
    }

    const box = new THREE.Box3().setFromObject(model);

    const size = box.getSize(new THREE.Vector3());

    const center = box.getCenter(new THREE.Vector3());

    if (size.y <= 0) {
      return;
    }

    const fitScale = targetHeight / size.y;

    const finalScale = fitScale * scale;

    model.scale.setScalar(finalScale);

    /*
     * Center horizontally/depth-wise and
     * place the model's feet on y = 0.
     */
    model.position.set(
      -center.x * finalScale,
      -box.min.y * finalScale,
      -center.z * finalScale,
    );
  }, [model, scale, targetHeight, autoFrame]);

  /*
   * Animation support.
   *
   * Models without animations simply have
   * an empty actions object and continue
   * rendering normally.
   */
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!animations.length) {
      return;
    }

    const selectedName = animationName ?? animations[0]?.name;

    if (!selectedName) {
      return;
    }

    const action = actions[selectedName];

    if (!action) {
      return;
    }

    action.reset();
    action.fadeIn(0.35);
    action.play();

    return () => {
      action.fadeOut(0.25);
      action.stop();
    };
  }, [actions, animations, animationName]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}
