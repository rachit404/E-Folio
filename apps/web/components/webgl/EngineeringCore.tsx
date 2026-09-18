"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

import DynamicModel from "./DynamicModel";

interface EngineeringCoreProps {
  model?: string;
}

function Particles() {
  const points = useRef<THREE.Points>(null);

  const particleCount = 900;

  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 12;

    positions[i3 + 1] = (Math.random() - 0.5) * 8;

    positions[i3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((_, delta) => {
    if (!points.current) return;

    points.current.rotation.y += delta * 0.015;

    points.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        color="#00e5ff"
        size={0.018}
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

function EnergyRing({
  radius,
  color,
  speed,
}: {
  radius: number;
  color: string;
  speed: number;
}) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ring.current) return;

    ring.current.rotation.x += delta * speed;

    ring.current.rotation.y += delta * speed * 0.7;
  });

  return (
    <mesh ref={ring}>
      <torusGeometry args={[radius, 0.008, 16, 128]} />

      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
}

function CoreGeometry() {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outer.current) {
      outer.current.rotation.x += delta * 0.12;

      outer.current.rotation.y += delta * 0.2;

      outer.current.rotation.z += delta * 0.08;
    }

    if (inner.current) {
      inner.current.rotation.x -= delta * 0.25;

      inner.current.rotation.y -= delta * 0.35;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={outer}>
        <mesh>
          <icosahedronGeometry args={[1.8, 1]} />

          <meshBasicMaterial
            color="#00e5ff"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>

        <mesh rotation={[0.4, 0.2, 0.6]}>
          <octahedronGeometry args={[1.15, 0]} />

          <meshBasicMaterial
            color="#ff2147"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        <mesh ref={inner} rotation={[0.3, 0.6, 0.2]}>
          <icosahedronGeometry args={[0.55, 1]} />

          <meshBasicMaterial
            color="#f4f1ea"
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />

          <meshBasicMaterial color="#00e5ff" />
        </mesh>

        <EnergyRing radius={2.15} color="#00e5ff" speed={0.15} />

        <EnergyRing radius={2.45} color="#ff2147" speed={-0.1} />
      </group>
    </Float>
  );
}

function Scene({ model }: { model?: string }) {
  const camera = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (!camera.current) return;

    const targetX = state.pointer.x * 0.45;

    const targetY = state.pointer.y * 0.28;

    camera.current.position.x += (targetX - camera.current.position.x) * 0.025;

    camera.current.position.y += (targetY - camera.current.position.y) * 0.025;

    camera.current.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        position={[0, 0, 6]}
        fov={42}
      />

      <fog attach="fog" args={["#050608", 5, 13]} />

      <ambientLight intensity={0.18} />

      <pointLight
        position={[3, 2, 4]}
        color="#00e5ff"
        intensity={8}
        distance={10}
      />

      <pointLight
        position={[-3, -1, 2]}
        color="#ff2147"
        intensity={5}
        distance={8}
      />

      <pointLight
        position={[0, 3, -2]}
        color="#f4f1ea"
        intensity={2}
        distance={7}
      />

      <Particles />

      <Suspense fallback={null}>
        {model ? (
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <DynamicModel src={model} scale={1.8} />
          </Float>
        ) : (
          <CoreGeometry />
        )}
      </Suspense>

      <Environment preset="night" />
    </>
  );
}

export default function EngineeringCore({ model }: EngineeringCoreProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene model={model} />
      </Canvas>
    </div>
  );
}
