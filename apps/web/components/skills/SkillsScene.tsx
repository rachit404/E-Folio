"use client";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface SkillsSceneProps {
  portfolio: PortfolioData;
}

export default function SkillsScene({ portfolio }: SkillsSceneProps) {
  const skillSections = portfolio.sections.filter(
    (section) => section.kind === "skills",
  );

  const totalSkills = skillSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );

  return (
    <SceneFrame
      id="skills"
      number="03"
      label="ENGINEERING ARSENAL"
      className="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden">
        {/* Background technical geometry */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[8%] top-[12%] h-40 w-40 border border-[var(--color-cyan)]/10" />
          <div className="absolute right-[11%] top-[15%] h-28 w-28 border border-[var(--color-red)]/10" />

          <div className="absolute left-[5%] top-[48%] h-px w-[35%] bg-[var(--color-cyan)]/10" />

          <div className="absolute bottom-[18%] right-[5%] h-px w-[30%] bg-[var(--color-red)]/10" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="portfolio-mono mb-7 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                03 / CAPABILITY MATRIX
              </p>

              <h2 className="portfolio-display text-[clamp(4rem,8vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]">
                ENGINEERING
                <br />
                <span className="text-[var(--color-red)]">ARSENAL</span>
              </h2>

              <p className="mt-10 max-w-md border-l border-[var(--color-cyan)]/30 pl-6 text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Technologies, disciplines and tools used to turn ideas into
                working systems.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <div>
                  <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                    CAPABILITIES
                  </p>

                  <p className="portfolio-mono mt-2 text-2xl text-[var(--color-white)]">
                    {String(totalSkills).padStart(2, "0")}
                  </p>
                </div>

                <div className="h-10 w-px bg-[var(--color-white)]/10" />

                <div>
                  <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                    STATUS
                  </p>

                  <p className="portfolio-mono mt-2 text-[9px] text-[var(--color-cyan)]">
                    OPERATIONAL
                  </p>
                </div>
              </div>
            </div>

            {/* Skill matrix */}
            <div>
              {skillSections.length === 0 ? (
                <div className="border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/40 p-8">
                  <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                    NO SKILL RECORDS DETECTED
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {skillSections.map((section, sectionIndex) => (
                    <div key={`${section.heading}-${sectionIndex}`}>
                      {/* Dynamic LaTeX section heading */}
                      <div className="mb-5 flex items-center gap-4">
                        <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                          {String(sectionIndex + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-8 bg-[var(--color-red)]" />

                        <h3 className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                          {section.heading}
                        </h3>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {section.items.map((item, itemIndex) => {
                          if (!("name" in item) || !("description" in item)) {
                            return null;
                          }

                          return (
                            <article
                              key={`${item.name}-${itemIndex}`}
                              className="group relative overflow-hidden border border-[var(--color-white)]/10 bg-[var(--color-panel)]/40 p-5 transition-all duration-300 hover:border-[var(--color-cyan)]/30 hover:bg-[var(--color-panel)]/70"
                            >
                              {/* Index */}
                              <span className="portfolio-mono absolute right-4 top-4 text-[7px] text-[var(--color-dim)]">
                                {String(itemIndex + 1).padStart(2, "0")}
                              </span>

                              {/* Accent */}
                              <div className="mb-6 h-1 w-8 bg-[var(--color-red)] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--color-cyan)]" />

                              <h4 className="max-w-[80%] text-lg font-medium text-[var(--color-white)] transition-colors duration-300 group-hover:text-[var(--color-cyan)]">
                                {item.name}
                              </h4>

                              <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
                                {item.description}
                              </p>

                              {/* Bottom telemetry */}
                              <div className="mt-6 flex items-center justify-between border-t border-[var(--color-white)]/5 pt-3">
                                <span className="portfolio-mono text-[7px] tracking-[0.14em] text-[var(--color-dim)]">
                                  MODULE
                                </span>

                                <span className="h-1.5 w-1.5 bg-[var(--color-cyan)] opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 flex flex-col gap-5 border-t border-[var(--color-white)]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              EXPERIENCE → CAPABILITY → EXECUTION
            </span>

            <a
              href="#projects"
              className="portfolio-mono text-[9px] tracking-[0.14em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
            >
              PROJECT VAULT →
            </a>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
