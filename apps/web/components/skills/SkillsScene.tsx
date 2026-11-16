import type { PortfolioData } from "@/content/schema/portfolio";

import ComicPage from "@/components/comic/ComicPage";
import { ComicBeat, ComicPanel } from "@/components/comic/ComicPanel";
import { panelSpans } from "@/components/comic/layout";
import SceneFrame from "@/components/layout/SceneFrame";

import { collectCertificates, groupSkills } from "./group";

interface SkillsSceneProps {
  portfolio: PortfolioData;
}

export default function SkillsScene({ portfolio }: SkillsSceneProps) {
  const groups = groupSkills(portfolio);

  const certificateSections = collectCertificates(portfolio);

  const skillCount = groups.reduce(
    (total, group) => total + group.skills.length,
    0,
  );

  const hasRecords = groups.length > 0 || certificateSections.length > 0;

  const spans = panelSpans(groups.length);

  return (
    <SceneFrame
      id="skills"
      number="05"
      label="ENGINEERING ARSENAL"
      className="min-h-screen"
    >
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-primary)]">
                CAPABILITY MATRIX // 05
              </p>

              <h2 className="portfolio-display text-[clamp(2.25rem,4.2vw,4.25rem)] font-black leading-[0.82] tracking-[-0.06em]">
                ENGINEERING
                <br />
                <span className="text-[var(--color-accent)]">ARSENAL</span>
              </h2>
            </div>

            <div className="comic-panel grid grid-cols-2">
              <div className="border-r-2 border-dashed border-white/20 px-6 py-5">
                <span className="portfolio-mono block text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                  SKILLS
                </span>

                <span className="portfolio-display mt-2 block text-4xl font-black text-[var(--color-white)]">
                  {String(skillCount).padStart(2, "0")}
                </span>
              </div>

              <div className="px-6 py-5">
                <span className="portfolio-mono block text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                  GROUPS
                </span>

                <span className="portfolio-display mt-2 block text-4xl font-black text-[var(--color-primary)]">
                  {String(groups.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-24">
            {groups.length > 0 && (
              <ComicPage sceneId="skills" issue="PAGE 1 // TOOLKIT">
                {groups.map((group, groupIndex) => (
                  <ComicPanel
                    key={group.category}
                    wide={spans[groupIndex]}
                    caption={`${String(group.skills.length).padStart(2, "0")} SKILLS`}
                  >
                    <ComicBeat
                      as="h3"
                      className="portfolio-display mb-6 text-2xl font-black text-[var(--color-accent)] md:text-3xl"
                    >
                      {group.category}
                    </ComicBeat>

                    <div className="flex flex-wrap gap-3">
                      {group.skills.map((skill) => (
                        <ComicBeat as="span" key={skill} className="comic-chip">
                          {skill}
                        </ComicBeat>
                      ))}
                    </div>
                  </ComicPanel>
                ))}
              </ComicPage>
            )}

            {certificateSections.map((section) => (
              <ComicPage
                key={section.heading}
                sceneId="skills"
                showSfx={false}
                issue={`PAGE 2 // ${section.heading.toUpperCase()}`}
              >
                <ComicPanel wide caption={`${section.certificates.length} ON FILE`}>
                  <ComicBeat
                    as="h3"
                    className="portfolio-display mb-6 text-2xl font-black text-[var(--color-accent)] md:text-3xl"
                  >
                    {section.heading}
                  </ComicBeat>

                  <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {section.certificates.map((certificate, index) => (
                      <ComicBeat
                        as="li"
                        key={`${certificate.title}-${index}`}
                        className="flex gap-4 border-b-2 border-dashed border-white/15 pb-4"
                      >
                        <span className="portfolio-mono shrink-0 pt-1 text-[8px] text-[var(--color-primary)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span>
                          {certificate.issuer && (
                            <span className="portfolio-mono block text-[8px] tracking-[0.14em] text-[var(--color-primary)]">
                              {certificate.issuer.toUpperCase()}
                            </span>
                          )}

                          <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--color-white)]">
                            {certificate.title}
                          </span>
                        </span>
                      </ComicBeat>
                    ))}
                  </ul>
                </ComicPanel>
              </ComicPage>
            ))}
          </div>

          {!hasRecords && (
            <div className="border border-dashed border-white/10 p-12 text-center">
              <span className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                NO SKILL RECORDS AVAILABLE
              </span>
            </div>
          )}

          <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
              CAPABILITY MATRIX / END
            </span>

            <a
              href="#projects"
              className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-primary)] hover:text-[var(--color-white)]"
            >
              PROJECT ARCHIVE →
            </a>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
