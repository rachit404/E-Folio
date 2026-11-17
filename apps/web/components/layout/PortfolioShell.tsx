import type { ReactNode } from "react";

import Nav from "@/components/nav/Nav";
import ResetHashOnReload from "@/components/navigation/ResetHashOnReload";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Chrome from "@/components/shell/Chrome";
import SceneStage from "@/components/stage/SceneStage";
import ThemeRoot from "@/components/layout/ThemeRoot";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SCENE_IDS } from "@/lib/scenes/order";
import type { PortfolioTheme } from "@/lib/theme";

interface PortfolioShellProps {
  theme: PortfolioTheme;
  children: ReactNode;
  profiles: string[];
  activeRole: string;
}

export default function PortfolioShell({
  theme,
  children,
  profiles,
  activeRole,
}: PortfolioShellProps) {
  return (
    <ThemeRoot theme={theme}>
      <ThemeProvider theme={theme}>
        <SmoothScroll>
          <ResetHashOnReload />

          <div className="relative bg-[var(--color-void)]">
            <SceneStage
              scenes={SCENE_IDS}
              manifest={theme.scenes}
              palette={{
                void: theme.colors.void,
                primary: theme.colors.primary,
                accent: theme.colors.accent,
              }}
            />

            <Chrome copy={theme.copy} />

            <Nav
              name={theme.identity.name}
              profiles={profiles}
              activeRole={activeRole}
            />

            <main className="relative z-10">{children}</main>
          </div>
        </SmoothScroll>
      </ThemeProvider>
    </ThemeRoot>
  );
}
