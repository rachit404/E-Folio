"use client";

import type { PortfolioData } from "@/content/schema/portfolio";

import ComicPage from "@/components/comic/ComicPage";
import { ComicBeat, ComicPanel } from "@/components/comic/ComicPanel";
import { panelSpans } from "@/components/comic/layout";
import SceneFrame from "@/components/layout/SceneFrame";

interface ExperienceSceneProps {
  portfolio: PortfolioData;
}

type Item = PortfolioData["sections"][number]["items"][number];

interface TimelineItem {
  organization: string;
  secondary: string;
  role: string;
  dates: string;
  details: string[];
}

interface PositionItem {
  title: string;
  organization: string;
  dates: string;
}

function isTimelineItem(item: Item): item is TimelineItem {
  return (
    "organization" in item &&
    "role" in item &&
    "dates" in item &&
    "details" in item
  );
}

function isPositionItem(item: Item): item is PositionItem {
  return "title" in item && "organization" in item && "dates" in item;
}

export default function ExperienceScene({ portfolio }: ExperienceSceneProps) {
  const timelineSections = portfolio.sections
    .filter((section) => section.kind === "timeline")
    .map((section) => ({
      heading: section.heading,
      items: section.items.filter(isTimelineItem),
    }))
    .filter((section) => section.items.length > 0);

  const positions = portfolio.sections
    .filter((section) => section.kind === "positions")
    .flatMap((section) => section.items.filter(isPositionItem));

  const hasRecords = timelineSections.length > 0 || positions.length > 0;

  /*
   * Sections are numbered continuously ("ISSUE 02 / PAGE 1", ...),
   * one comic page per resume section (Education, Experience, ...).
   */
  const pageCount = timelineSections.length + (positions.length ? 1 : 0);

  return (
    <SceneFrame
      id="experience"
      number="02"
      label="JOURNEY / EXPERIENCE"
      className="min-h-screen"
    >
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-primary)]">
                CAREER LOG // 02
              </p>

              <h2 className="portfolio-display text-[clamp(3rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.06em]">
                FIELD
                <br />
                <span className="text-[var(--color-accent)]">RECORDS</span>
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-sm leading-6 text-[var(--color-muted)] md:text-base">
                A chronological record of engineering work, internships, roles
                and technical environments.
              </p>
            </div>
          </div>

          <div className="space-y-24">
            {timelineSections.map((section, sectionIndex) => {
              const spans = panelSpans(section.items.length);

              return (
                <div key={section.heading}>
                  <ComicPage
                    sceneId="experience"
                    showSfx={sectionIndex === 0}
                    issue={`PAGE ${sectionIndex + 1}/${pageCount} // ${section.heading.toUpperCase()}`}
                  >
                    {section.items.map((item, itemIndex) => (
                      <ComicPanel
                        key={`${section.heading}-${itemIndex}`}
                        caption={item.dates}
                        wide={spans[itemIndex]}
                      >
                        <ComicBeat
                          as="p"
                          className="portfolio-mono mb-3 text-[8px] tracking-[0.16em] text-[var(--color-primary)]"
                        >
                          {`${String(itemIndex + 1).padStart(2, "0")} // ${section.heading}`}
                        </ComicBeat>

                        <ComicBeat
                          as="h3"
                          className="portfolio-display text-2xl font-black tracking-tight text-[var(--color-white)] md:text-3xl"
                        >
                          {item.organization}
                        </ComicBeat>

                        <ComicBeat
                          as="p"
                          className="mt-2 text-sm font-semibold text-[var(--color-accent)]"
                        >
                          {item.role}
                        </ComicBeat>

                        {item.secondary && (
                          <ComicBeat
                            as="p"
                            className="mt-3 text-xs text-[var(--color-dim)]"
                          >
                            {item.secondary}
                          </ComicBeat>
                        )}

                        {item.details.length > 0 && (
                          <ul className="mt-6 space-y-3 border-t-2 border-dashed border-white/15 pt-5">
                            {item.details.map((detail, detailIndex) => (
                              <ComicBeat
                                as="li"
                                key={`${detail}-${detailIndex}`}
                                className="flex gap-4 text-sm leading-6 text-[var(--color-muted)]"
                              >
                                <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-primary)]">
                                  {String(detailIndex + 1).padStart(2, "0")}
                                </span>

                                <span>{detail}</span>
                              </ComicBeat>
                            ))}
                          </ul>
                        )}
                      </ComicPanel>
                    ))}
                  </ComicPage>
                </div>
              );
            })}

            {positions.length > 0 && (
              <ComicPage
                sceneId="experience"
                showSfx={false}
                issue={`PAGE ${pageCount}/${pageCount} // ADDITIONAL RECORDS`}
              >
                {positions.map((position, index) => (
                  <ComicPanel key={`${position.title}-${index}`}>
                    <ComicBeat
                      as="p"
                      className="portfolio-mono mb-5 text-[8px] tracking-[0.16em] text-[var(--color-dim)]"
                    >
                      POSITION
                    </ComicBeat>

                    <ComicBeat
                      as="h3"
                      className="portfolio-display text-xl font-black text-[var(--color-white)] md:text-2xl"
                    >
                      {position.title}
                    </ComicBeat>

                    <ComicBeat
                      as="p"
                      className="mt-2 text-sm text-[var(--color-accent)]"
                    >
                      {position.organization}
                    </ComicBeat>

                    <ComicBeat
                      as="p"
                      className="portfolio-mono mt-5 text-[8px] tracking-[0.12em] text-[var(--color-muted)]"
                    >
                      {position.dates}
                    </ComicBeat>
                  </ComicPanel>
                ))}
              </ComicPage>
            )}
          </div>

          {!hasRecords && (
            <div className="border border-dashed border-white/10 p-10 text-center">
              <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                NO EXPERIENCE RECORDS AVAILABLE
              </p>
            </div>
          )}

          <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              END OF RECORD
            </span>

            <a
              href="#skills"
              className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-white)]"
            >
              SKILLS →
            </a>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
