import type { CSSProperties, ReactNode } from "react";

import type { PortfolioTheme } from "@/lib/theme";

interface ThemeRootProps {
  theme: PortfolioTheme;
  children: ReactNode;
}

export default function ThemeRoot({ theme, children }: ThemeRootProps) {
  const variables = {
    "--color-void": theme.colors.void,
    "--color-graphite": theme.colors.graphite,
    "--color-panel": theme.colors.panel,
    "--color-primary": theme.colors.primary,
    "--color-accent": theme.colors.accent,
    "--color-white": theme.colors.white,
    "--color-muted": theme.colors.muted,
    "--color-dim": theme.colors.dim,

  } as CSSProperties;

  return (
    <div style={variables} data-theme={theme.id} className="min-h-screen">
      {children}
    </div>
  );
}
