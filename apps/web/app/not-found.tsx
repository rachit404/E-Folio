import Link from "next/link";

import { listProfiles } from "@/content/loader/portfolio";
import { loadTheme } from "@/lib/theme";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ThemeRoot from "@/components/layout/ThemeRoot";
import Chrome from "@/components/shell/Chrome";
import SceneSection from "@/components/shell/SceneSection";
import SceneStage from "@/components/stage/SceneStage";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import Wordmark from "@/components/ui/Wordmark";

export default async function NotFound() {
  const theme = await loadTheme();

  const profiles = await listProfiles().catch(() => []);

  const home = profiles[0] ? `/${profiles[0]}` : "/";

  return (
    <ThemeRoot theme={theme}>
      <ThemeProvider theme={theme}>
        <div className="relative bg-[var(--color-void)]">
          <SceneStage
            scenes={["404"]}
            manifest={theme.scenes}
            palette={{
              void: theme.colors.void,
              primary: theme.colors.primary,
              accent: theme.colors.accent,
            }}
          />

          <Chrome copy={theme.copy} />

          <header className="fixed inset-x-0 top-0 z-40">
            <div className="mx-auto flex h-[72px] max-w-[1500px] items-center px-6 md:px-12">
              <Link href={home} aria-label="Home">
                <Wordmark name={theme.identity.name} />
              </Link>
            </div>
          </header>

          <main className="relative z-10">
            <SceneSection id="404">
              <div className="flex h-full max-w-[32rem] flex-col justify-center gap-5">
                <p className="micro text-[var(--color-muted)]">
                  Error 404
                  <br />
                  <span className="text-[var(--color-accent)]">
                    DIMENSION_NOT_FOUND
                  </span>
                </p>

                <p className="brush text-[clamp(4rem,min(12vw,18svh),9rem)] text-[var(--color-white)]">
                  404
                </p>

                <BrushTitle first="You took a" second="wrong turn." />

                <p className="micro text-[var(--color-white)]/80">
                  This page doesn&apos;t exist in this universe.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href={home} className="cta-ghost">
                    <span aria-hidden="true">←</span>
                    Return home
                  </Link>

                  <Link href={`${home}#projects`} className="cta">
                    Explore projects
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <HoloCard
                className="absolute bottom-24 right-6 hidden w-64 md:block md:right-12"
                bodyClassName="p-4"
              >
                <p className="micro text-[var(--color-primary)]">
                  Navigation error
                </p>

                <p className="micro mt-3 text-[8px] leading-5 text-[var(--color-muted)]">
                  Coordinates: ???
                  <br />
                  Dimension: unknown
                  <br />
                  Status: lost
                </p>
              </HoloCard>
            </SceneSection>
          </main>
        </div>
      </ThemeProvider>
    </ThemeRoot>
  );
}
