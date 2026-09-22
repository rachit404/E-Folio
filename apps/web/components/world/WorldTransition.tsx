"use client";

import type { WorldId } from "./WorldTypes";

interface WorldTransitionProps {
  worldId: WorldId;
}

export default function WorldTransition({ worldId }: WorldTransitionProps) {
  return (
    <div
      key={worldId}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,var(--color-void)/55%_100%)]" />

      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-cyan)]/30 to-transparent" />

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/25 to-transparent" />
    </div>
  );
}
