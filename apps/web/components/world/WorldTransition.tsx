"use client";

import { useEffect, useState } from "react";

import type { WorldId } from "./WorldTypes";

interface WorldTransitionProps {
  worldId: WorldId;
}

export default function WorldTransition({ worldId }: WorldTransitionProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);

    const frame = window.requestAnimationFrame(() => {
      setVisible(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [worldId]);

  return (
    <div
      key={worldId}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-[var(--color-void)] transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-35" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-[var(--color-cyan)]/70 to-transparent transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-[var(--color-red)]/40 to-transparent transition-all duration-[1200ms] delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "scale-x-75 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-[45vh] w-[45vh] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-cyan)]/10 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? "scale-75 rotate-0 opacity-100"
            : "scale-150 rotate-12 opacity-0"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-[28vh] w-[28vh] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-red)]/10 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? "scale-75 rotate-45 opacity-100"
            : "scale-150 rotate-90 opacity-0"
        }`}
      />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-cyan)]/30 to-transparent" />

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/25 to-transparent" />
    </div>
  );
}
