"use client";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface AboutSceneProps {
  portfolio: PortfolioData;
}

export default function AboutScene({ portfolio }: AboutSceneProps) {
  return (
    <SceneFrame
      id="about"
      number="01"
      label="IDENTITY / SYSTEM PROFILE"
      className="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-[8%] top-[18%] h-px w-[28%] bg-[var(--color-cyan)]/30" />
          <div className="absolute right-[8%] top-[32%] h-px w-[24%] bg-[var(--color-red)]/30" />
          <div className="absolute bottom-[20%] left-[12%] h-px w-[18%] bg-[var(--color-cyan)]/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            {/* Identity */}
            <div>
              <div className="portfolio-mono mb-8 flex items-center gap-4 text-[10px] tracking-[0.2em] text-[var(--color-cyan)]">
                <span className="h-px w-12 bg-[var(--color-red)]" />
                01 / IDENTITY
              </div>

              <h2 className="portfolio-display text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
                WHO
                <br />
                <span className="text-[var(--color-red)]">IS</span>
                <br />
                {portfolio.metadata.name ?? "RACHIT"}?
              </h2>

              <div className="mt-10 max-w-xl border-l border-[var(--color-cyan)]/40 pl-6">
                <p className="text-base leading-7 text-[var(--color-muted)] md:text-lg">
                  An engineer focused on building software systems,
                  understanding how they work, and continuously pushing them
                  further.
                </p>
              </div>

              <div className="portfolio-mono mt-10 flex flex-wrap gap-3 text-[9px] tracking-[0.14em] text-[var(--color-dim)]">
                <span className="border border-[var(--color-cyan)]/20 px-3 py-2">
                  ENGINEERING
                </span>
                <span className="border border-[var(--color-red)]/20 px-3 py-2">
                  AI / ML
                </span>
                <span className="border border-[var(--color-cyan)]/20 px-3 py-2">
                  SYSTEMS
                </span>
              </div>
            </div>

            {/* Resume stream */}
            <div className="relative w-full min-w-0">
              <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08),transparent_65%)]" />

              <div className="relative overflow-hidden border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/40 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-[var(--color-white)]/10 px-5 py-4 md:px-6">
                  <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                    RESUME DATA STREAM
                  </span>

                  <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                    LIVE
                  </span>
                </div>

                <div>
                  {portfolio.sections.map((section, index) => (
                    <div
                      key={`${section.heading}-${index}`}
                      className="group border-b border-[var(--color-white)]/10 px-5 py-5 transition-colors duration-300 last:border-b-0 hover:bg-[var(--color-white)]/[0.02] md:px-6 md:py-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-dim)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="min-w-0">
                            <h3 className="truncate text-base font-medium text-[var(--color-white)] transition-colors duration-300 group-hover:text-[var(--color-cyan)] md:text-lg">
                              {section.heading}
                            </h3>

                            <p className="portfolio-mono mt-1 text-[7px] uppercase tracking-[0.14em] text-[var(--color-dim)]">
                              {section.kind} / {section.items.length} RECORDS
                            </p>
                          </div>
                        </div>

                        <span className="h-2 w-2 shrink-0 bg-[var(--color-cyan)] opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <span className="portfolio-mono border border-[var(--color-red)]/30 px-3 py-2 text-[7px] tracking-[0.16em] text-[var(--color-red)]">
                  DATA VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Footer metadata */}
          <div className="mt-20 grid gap-6 border-t border-[var(--color-white)]/10 pt-8 md:grid-cols-3">
            <div>
              <p className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                PROFILE
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {portfolio.metadata.course ?? "Engineering"}
              </p>
            </div>

            <div>
              <p className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                SOURCE
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {portfolio.source.file}
              </p>
            </div>

            <div className="md:text-right">
              <p className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                NEXT SCENE
              </p>

              <a
                href="#experience"
                className="mt-2 inline-block text-sm text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
              >
                EXPERIENCE →
              </a>
            </div>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
