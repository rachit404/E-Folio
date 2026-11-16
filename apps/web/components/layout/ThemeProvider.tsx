"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { PortfolioTheme } from "@/lib/theme";

const ThemeContext = createContext<PortfolioTheme | null>(null);

interface ThemeProviderProps {
  theme: PortfolioTheme;
  children: ReactNode;
}

/**
 * Makes the resolved theme preset available to client components
 * (scenes, comic panels, games) without prop drilling.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): PortfolioTheme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }

  return theme;
}
