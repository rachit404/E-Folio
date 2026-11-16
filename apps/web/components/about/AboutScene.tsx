import type { PortfolioData } from "@/content/schema/portfolio";

import ComicPage from "@/components/comic/ComicPage";
import { ComicBeat, ComicPanel } from "@/components/comic/ComicPanel";
import SceneFrame from "@/components/layout/SceneFrame";

interface AboutSceneProps {
  portfolio: PortfolioData;
}

const KIND_LABEL: Record<
  PortfolioData["sections"][number]["kind"],
  string
> = {
  projects: "PROJECTS",
  skills: "SKILLS",
  timeline: "TIMELINE",
  positions: "POSITIONS",
  content: "RECORDS",
};

export default function AboutScene({ portfolio }: AboutSceneProps) {
  const name = portfolio.metadata.name ?? "ENGINEER";

  /*
   * The index lists what the resume actually contains, so every
   * number here is derived from the parsed data.
   */
  const index = portfolio.sections.filter(
    (section) => section.items.length > 0,
  );

  const stat = (kind: PortfolioData["sections"][number]["kind"]) =>
    portfolio.sections
      .filter((section) => section.kind === kind)
      .reduce((total, section) => total + section.items.length, 0);

  const stats = [
    { label: "TIMELINE", value: stat("timeline") + stat("positions") },
    { label: "PROJECTS", value: stat("projects") },
    { label: "SKILLS", value: stat("skills") },
    { label: "RECORDS", value: stat("content") },
  ].filter((entry) => entry.value > 0);

  return (
    <SceneFrame
      id="about"
      number="01"
      label="IDENTITY / SYSTEM PROFILE"
      className="min-h-screen"
    >
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <ComicPage sceneId="about" issue="ISSUE 01 // IDENTITY">
            <ComicPanel wide caption="ORIGIN FILE">
              <ComicBeat
                as="p"
                className="portfolio-mono mb-6 text-[9px] tracking-[0.2em] text-[var(--color-primary)]"
              >
                01 / IDENTITY
              </ComicBeat>

              <ComicBeat
                as="h2"
                className="portfolio-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.06em]"
              >
                {name}
                <span className="text-[var(--color-accent)]">.</span>
              </ComicBeat>

              {portfolio.metadata.course && (
                <ComicBeat
                  as="p"
                  className="mt-6 inline-block border-l-4 border-[var(--color-accent)] pl-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
                >
                  {portfolio.metadata.course}
                </ComicBeat>
              )}
            </ComicPanel>

            <ComicPanel caption="FILE INDEX">
              <div className="divide-y-2 divide-dashed divide-white/15">
                {index.map((section, sectionIndex) => (
                  <ComicBeat
                    key={`${section.heading}-${sectionIndex}`}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-bold text-[var(--color-white)]">
                        {section.heading}
                      </p>

                      <p className="portfolio-mono mt-1 text-[7px] tracking-[0.14em] text-[var(--color-dim)]">
                        {KIND_LABEL[section.kind]}
                      </p>
                    </div>

                    <span className="portfolio-display text-2xl font-black text-[var(--color-primary)]">
                      {String(section.items.length).padStart(2, "0")}
                    </span>
                  </ComicBeat>
                ))}
              </div>
            </ComicPanel>

            <ComicPanel caption="BY THE NUMBERS">
              <div className="grid grid-cols-2 gap-5">
                {stats.map((entry) => (
                  <ComicBeat key={entry.label}>
                    <span className="portfolio-display block text-5xl font-black text-[var(--color-white)]">
                      {String(entry.value).padStart(2, "0")}
                    </span>

                    <span className="portfolio-mono mt-1 block text-[8px] tracking-[0.16em] text-[var(--color-accent)]">
                      {entry.label}
                    </span>
                  </ComicBeat>
                ))}
              </div>
            </ComicPanel>
          </ComicPage>

          <div className="mt-16 flex justify-end border-t border-white/10 pt-6">
            <a
              href="#experience"
              className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-white)]"
            >
              EXPERIENCE →
            </a>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
