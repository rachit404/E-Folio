"use client";

import { createContext, useContext } from "react";

import type { WorldId } from "@/components/world/WorldTypes";

export interface PortfolioWorldContextValue {
  activeWorld: WorldId;
  setWorld: (worldId: WorldId) => void;
}

export const PortfolioWorldContext =
  createContext<PortfolioWorldContextValue | null>(null);

export function usePortfolioWorld(): PortfolioWorldContextValue {
  const context = useContext(PortfolioWorldContext);

  if (!context) {
    throw new Error("usePortfolioWorld must be used inside PortfolioWorld.");
  }

  return context;
}
