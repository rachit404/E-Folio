"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

const worldSet = new Set<WorldId>(worldOrder);

export default function PortfolioWorld({
  theme,
  children,
}: PortfolioWorldProps) {
  const [activeWorld, setActiveWorld] = useState<WorldId>("home");
  const [forcedWorld, setForcedWorld] = useState<WorldId | null>(null);

  const forcedWorldRef = useRef<WorldId | null>(null);
  const rafRef = useRef<number | null>(null);

  const setWorld = useCallback((worldId: WorldId) => {
    setActiveWorld(worldId);

    if (worldId === "case-study") {
      forcedWorldRef.current = worldId;
      setForcedWorld(worldId);
      return;
    }

    forcedWorldRef.current = null;
    setForcedWorld(null);
  }, []);

  useEffect(() => {
    const updateActiveWorld = () => {
      rafRef.current = null;

      if (forcedWorldRef.current) {
        return;
      }

      const viewportCenter = window.innerHeight * 0.48;

      let closestWorld: WorldId = "home";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const worldId of worldOrder) {
        const element = document.getElementById(worldId);

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
          continue;
        }

        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestWorld = worldId;
        }
      }

      setActiveWorld((current) =>
        current === closestWorld ? current : closestWorld,
      );
    };

    const requestUpdate = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(updateActiveWorld);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!forcedWorld) {
      return;
    }

    if (forcedWorld !== "case-study") {
      forcedWorldRef.current = null;
      setForcedWorld(null);
    }
  }, [forcedWorld]);

  useEffect(() => {
    if (!forcedWorld) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        forcedWorldRef.current = null;
        setForcedWorld(null);
        setActiveWorld("projects");
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
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
          forced={Boolean(forcedWorld)}
        />
      </div>
    </PortfolioWorldContext.Provider>
  );
}
