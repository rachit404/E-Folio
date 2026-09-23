"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { PortfolioTheme } from "@/lib/theme";

import PortfolioHUD from "./PortfolioHUD";

import WorldBackground from "@/components/world/WorldBackground";
import WorldStage from "@/components/world/WorldStage";
import WorldTransition from "@/components/world/WorldTransition";
import type { WorldId } from "@/components/world/WorldTypes";

import { getWorldConfig } from "@/lib/worlds";

import {
  PortfolioWorldContext,
  type PortfolioWorldContextValue,
} from "@/components/world/context/PortfolioWorldContext";

interface PortfolioWorldProps {
  theme: PortfolioTheme;
  children: ReactNode;
}

const worldOrder: WorldId[] = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
];

export default function PortfolioWorld({
  theme,
  children,
}: PortfolioWorldProps) {
  const [activeWorld, setActiveWorld] = useState<WorldId>("home");

  const [forcedWorld, setForcedWorld] = useState<WorldId | null>(null);

  const setWorld = useCallback((worldId: WorldId) => {
    setForcedWorld(worldId);
    setActiveWorld(worldId);
  }, []);

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
        if (forcedWorld) {
          return;
        }

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
  }, [forcedWorld]);

  /*
   * Once the user explicitly enters an interaction-driven
   * world such as Case Study, scrolling should not immediately
   * overwrite that world state.
   *
   * Returning to a normal scroll world clears the forced state.
   */
  useEffect(() => {
    if (forcedWorld && forcedWorld !== "case-study") {
      setForcedWorld(null);
    }
  }, [forcedWorld]);

  const contextValue = useMemo<PortfolioWorldContextValue>(
    () => ({
      activeWorld,
      setWorld,
    }),
    [activeWorld, setWorld],
  );

  const config = useMemo(() => getWorldConfig(activeWorld), [activeWorld]);

  return (
    <PortfolioWorldContext.Provider value={contextValue}>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 z-0">
          <WorldBackground
            src={config.background}
            opacity={config.atmosphere.opacity}
          />

          <WorldStage config={config} theme={theme} />

          <WorldTransition worldId={activeWorld} />
        </div>

        <div className="relative z-10">{children}</div>

        <PortfolioHUD
          worldId={activeWorld}
          number={config.number}
          label={config.label}
        />
      </div>
    </PortfolioWorldContext.Provider>
  );
}
