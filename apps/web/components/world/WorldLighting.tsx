"use client";

interface WorldLightingProps {
  primary: string;
  secondary: string;
  foreground: string;
}

export default function WorldLighting({
  primary,
  secondary,
  foreground,
}: WorldLightingProps) {
  return (
    <>
      <ambientLight intensity={0.28} />

      <pointLight
        position={[4, 3, 5]}
        color={primary}
        intensity={5}
        distance={14}
      />

      <pointLight
        position={[-4, -2, 3]}
        color={secondary}
        intensity={3.5}
        distance={12}
      />

      <pointLight
        position={[0, 5, -3]}
        color={foreground}
        intensity={1.4}
        distance={10}
      />

      <directionalLight
        position={[0, 4, 5]}
        color={foreground}
        intensity={0.45}
      />
    </>
  );
}
