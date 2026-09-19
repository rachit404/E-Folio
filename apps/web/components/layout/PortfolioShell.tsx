import type { ReactNode } from "react";

import PortfolioNav from "@/components/navigation/PortfolioNav";
import ResetHashOnReload from "@/components/navigation/ResetHashOnReload";
import ThemeRoot from "@/components/layout/ThemeRoot";
import SmoothScroll from "@/components/motion/SmoothScroll";
import UnlockSystem from "@/components/unlocks/UnlockSystem";
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
      <SmoothScroll>
        <ResetHashOnReload />

        <UnlockSystem>
          <div className="relative min-h-screen bg-[var(--color-void)]">
            <PortfolioNav profiles={profiles} activeRole={activeRole} />

            <div className="pointer-events-none fixed inset-0 z-30">
              <div className="absolute inset-0 border border-white/[0.04]" />

              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-cyan)]/20 to-transparent" />

              <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/20 to-transparent" />
            </div>

            <main>{children}</main>
          </div>
        </UnlockSystem>
      </SmoothScroll>
    </ThemeRoot>
  );
}
