"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PortfolioTheme } from "@/lib/theme";

import PortfolioHUD from "./PortfolioHUD";

import WorldBackground from "@/components/world/WorldBackground";
import WorldStage from "@/components/world/WorldStage";
import WorldTransition from "@/components/world/WorldTransition";
import type { WorldId } from "@/components/world/WorldTypes";

import { getWorldConfig } from "@/lib/worlds";

interface PortfolioWorldProps {
  theme: PortfolioTheme;
  children: ReactNode;
}

const worldOrder: WorldId[] = [
  "home",
  "about",
  "experience",
  "skills",
  "projects",
  "contact",
];

export default function PortfolioWorld({
  theme,
  children,
}: PortfolioWorldProps) {
  const [activeWorld, setActiveWorld] = useState<WorldId>("home");

  useEffect(() => {
    const elements = worldOrder
      .map((worldId) => document.getElementById(worldId))
      .filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const next = visible[0]?.target.id as WorldId | undefined;

        if (next && worldOrder.includes(next)) {
          setActiveWorld(next);
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const config = useMemo(() => getWorldConfig(activeWorld), [activeWorld]);

  return (
    <div className="relative min-h-screen">
      {/* Shared world viewport */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <WorldBackground
          src={config.background}
          opacity={config.atmosphere.opacity}
        />

        <WorldStage config={config} theme={theme} />

        <WorldTransition worldId={activeWorld} />
      </div>

      {/* Portfolio content */}
      <div className="relative z-10">{children}</div>

      {/* Persistent world HUD */}
      <PortfolioHUD
        worldId={activeWorld}
        number={config.number}
        label={config.label}
      />
    </div>
  );
}
