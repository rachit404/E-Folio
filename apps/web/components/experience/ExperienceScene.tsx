"use client";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface ExperienceSceneProps {
  portfolio: PortfolioData;
}

export default function ExperienceScene({ portfolio }: ExperienceSceneProps) {
  const timelineSections = portfolio.sections.filter(
    (section) => section.kind === "timeline" || section.kind === "positions",
  );

  return (
    <SceneFrame
      id="experience"
      number="02"
      label="JOURNEY / EXPERIENCE"
      className="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden">
        {/* Atmospheric lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[18%] h-[70%] w-px bg-gradient-to-b from-transparent via-[var(--color-cyan)]/20 to-transparent" />

          <div className="absolute left-[15%] top-[32%] h-px w-[70%] bg-[var(--color-cyan)]/10" />

          <div className="absolute left-[15%] top-[62%] h-px w-[55%] bg-[var(--color-red)]/10" />
        </div>

        <div className="relative z-10 grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Heading */}
          <div>
            <p className="portfolio-mono mb-7 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
              02 / CHRONOLOGY
            </p>

            <h2 className="portfolio-display text-[clamp(4rem,8vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]">
              THE
              <br />
              <span className="text-[var(--color-red)]">JOURNEY</span>
            </h2>

            <p className="mt-10 max-w-md border-l border-[var(--color-cyan)]/30 pl-6 text-sm leading-7 text-[var(--color-muted)] md:text-base">
              A record of the environments, problems, systems and experiences
              that shaped the engineer behind E-FOLIO.
            </p>

            <div className="portfolio-mono mt-10 text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              CURRENT POSITION
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span className="h-2 w-2 bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />
              <span className="portfolio-mono text-[10px] text-[var(--color-white)]">
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {timelineSections.length === 0 ? (
              <div className="border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/40 p-8">
                <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                  NO TIMELINE RECORDS DETECTED
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline rail */}
                <div className="absolute bottom-0 left-[18px] top-0 w-px bg-gradient-to-b from-[var(--color-cyan)]/60 via-[var(--color-cyan)]/20 to-transparent" />

                <div className="space-y-8">
                  {timelineSections.flatMap((section) =>
                    section.items.map((item, index) => {
                      if (
                        section.kind === "timeline" &&
                        "organization" in item &&
                        "role" in item &&
                        "dates" in item
                      ) {
                        return (
                          <article
                            key={`${section.heading}-${index}`}
                            className="group relative pl-12"
                          >
                            {/* Checkpoint */}
                            <div className="absolute left-[12px] top-6 h-3 w-3 border border-[var(--color-cyan)] bg-[var(--color-void)] transition-all duration-300 group-hover:bg-[var(--color-cyan)] group-hover:shadow-[0_0_18px_var(--color-cyan)]" />

                            <div className="border border-[var(--color-white)]/10 bg-[var(--color-panel)]/40 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-[var(--color-cyan)]/30 group-hover:bg-[var(--color-panel)]/70">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]">
                                    {section.heading}
                                  </p>

                                  <h3 className="mt-2 text-xl font-medium text-[var(--color-white)] md:text-2xl">
                                    {item.role}
                                  </h3>

                                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                                    {item.organization}
                                  </p>
                                </div>

                                <span className="portfolio-mono border border-[var(--color-red)]/25 px-3 py-2 text-[8px] text-[var(--color-red)]">
                                  {item.dates}
                                </span>
                              </div>

                              <p className="portfolio-mono mt-5 text-[8px] text-[var(--color-dim)]">
                                {item.secondary}
                              </p>

                              {item.details.length > 0 && (
                                <ul className="mt-5 space-y-2">
                                  {item.details
                                    .slice(0, 3)
                                    .map((detail, detailIndex) => (
                                      <li
                                        key={detailIndex}
                                        className="flex gap-3 text-xs leading-6 text-[var(--color-muted)]"
                                      >
                                        <span className="mt-3 h-1 w-1 shrink-0 bg-[var(--color-red)]" />
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          </article>
                        );
                      }

                      if (
                        section.kind === "positions" &&
                        "organization" in item &&
                        "title" in item &&
                        "dates" in item
                      ) {
                        return (
                          <article
                            key={`${section.heading}-${index}`}
                            className="group relative pl-12"
                          >
                            <div className="absolute left-[13px] top-6 h-2.5 w-2.5 bg-[var(--color-red)] transition-all duration-300 group-hover:shadow-[0_0_16px_var(--color-red)]" />

                            <div className="border border-[var(--color-white)]/10 bg-[var(--color-panel)]/30 p-6 transition-all duration-300 group-hover:border-[var(--color-red)]/30">
                              <div className="flex flex-wrap justify-between gap-4">
                                <div>
                                  <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                                    {section.heading}
                                  </p>

                                  <h3 className="mt-2 text-lg text-[var(--color-white)]">
                                    {item.title}
                                  </h3>

                                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                                    {item.organization}
                                  </p>
                                </div>

                                <span className="portfolio-mono text-[8px] text-[var(--color-red)]">
                                  {item.dates}
                                </span>
                              </div>
                            </div>
                          </article>
                        );
                      }

                      return null;
                    }),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="relative z-10 mt-20 flex items-center justify-between border-t border-[var(--color-white)]/10 pt-6">
          <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
            01 → 02 → CURRENT
          </span>

          <a
            href="#skills"
            className="portfolio-mono text-[9px] tracking-[0.14em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
          >
            SKILL MATRIX →
          </a>
        </div>
      </section>
    </SceneFrame>
  );
}
