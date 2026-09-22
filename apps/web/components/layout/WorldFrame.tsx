"use client";

import type { ReactNode } from "react";

import type { WorldId } from "@/components/world/WorldTypes";

interface WorldFrameProps {
  id: WorldId;
  number: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export default function WorldFrame({
  id,
  number,
  label,
  children,
  className = "",
}: WorldFrameProps) {
  return (
    <section
      id={id}
      data-world-id={id}
      data-world-frame
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-24 z-20 px-6 md:px-10">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4">
          <span className="portfolio-mono text-[9px] text-[var(--color-cyan)]">
            {number}
          </span>

          <span className="h-px w-8 bg-[var(--color-red)]" />

          <span className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-muted)]">
            {label}
          </span>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
