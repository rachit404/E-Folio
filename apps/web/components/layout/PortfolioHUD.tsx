"use client";

import type { WorldId } from "@/components/world/WorldTypes";

interface PortfolioHUDProps {
  worldId: WorldId;
  number: string;
  label: string;
  forced?: boolean;
}

export default function PortfolioHUD({
  worldId,
  number,
  label,
  forced = false,
}: PortfolioHUDProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-6 pb-5 md:px-10 md:pb-7">
        <div
          key={`${worldId}-meta`}
          className="portfolio-mono flex items-center gap-3 text-[8px] tracking-[0.16em] text-[var(--color-dim)]"
        >
          <span className="text-[var(--color-cyan)]">{number}</span>

          <span className="h-px w-8 bg-[var(--color-red)]/60" />

          <span>{label}</span>

          {forced && (
            <>
              <span className="h-1 w-1 rounded-full bg-[var(--color-red)] shadow-[0_0_8px_var(--color-red)]" />

              <span className="text-[var(--color-red)]">LOCKED</span>
            </>
          )}
        </div>

        <div
          key={`${worldId}-world`}
          className="portfolio-mono text-[7px] tracking-[0.18em] text-[var(--color-dim)]"
        >
          WORLD / {worldId.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
