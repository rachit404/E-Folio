"use client";

interface WorldBackgroundProps {
  src: string;
  opacity?: number;
}

export default function WorldBackground({
  src,
  opacity = 0.9,
}: WorldBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-[opacity,transform] duration-1000 ease-out"
        style={{
          backgroundImage: `url("${src}")`,
          opacity,
          transform: "scale(1.025)",
        }}
      />

      <div className="absolute inset-0 bg-[var(--color-void)]/10" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,var(--color-void)/75%_100%)]" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />
    </div>
  );
}
