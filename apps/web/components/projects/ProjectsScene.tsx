"use client";

import { useCallback, useMemo, useState } from "react";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";
import ProjectCarousel, {
  type ProjectCarouselItem,
} from "@/components/projects/ProjectCarousel";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";
import { usePortfolioWorld } from "@/components/world/context/PortfolioWorldContext";

interface ProjectsSceneProps {
  portfolio: PortfolioData;
}

function isProjectItem(
  item: PortfolioData["sections"][number]["items"][number],
): item is ProjectCarouselItem {
  return (
    "name" in item &&
    "description" in item &&
    "metadata" in item &&
    "details" in item &&
    "links" in item &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    typeof item.metadata === "object" &&
    item.metadata !== null &&
    "primary" in item.metadata &&
    "secondary" in item.metadata &&
    Array.isArray(item.details) &&
    Array.isArray(item.links)
  );
}

export default function ProjectsScene({ portfolio }: ProjectsSceneProps) {
  const { setWorld } = usePortfolioWorld();

  const [selectedProject, setSelectedProject] =
    useState<ProjectCarouselItem | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [scrollY, setScrollY] = useState(0);

  const projects = useMemo(
    () =>
      portfolio.sections
        .filter((section) => section.kind === "projects")
        .flatMap((section) => section.items.filter(isProjectItem)),
    [portfolio.sections],
  );

  const handleSelect = useCallback(
    (project: ProjectCarouselItem, index: number) => {
      setScrollY(window.scrollY);
      setSelectedProject(project);
      setSelectedIndex(index);
      setWorld("case-study");
    },
    [setWorld],
  );

  const handleClose = useCallback(() => {
    setSelectedProject(null);
    setWorld("projects");
  }, [setWorld]);

  return (
    <SceneFrame
      id="projects"
      number="03"
      label="PROJECT ARCHIVE"
      className="min-h-screen"
    >
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[15%] h-px w-[32%] bg-[var(--color-cyan)]/20" />
          <div className="absolute right-[8%] top-[28%] h-px w-[24%] bg-[var(--color-red)]/20" />

          <div className="absolute bottom-[15%] right-[10%] h-40 w-40 border border-[var(--color-cyan)]/[0.06]" />
          <div className="absolute bottom-[18%] right-[13%] h-24 w-24 border border-[var(--color-red)]/[0.06]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                ARTIFACT ARCHIVE // 03
              </p>

              <h2 className="portfolio-display text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
                SELECTED
                <br />
                <span className="text-[var(--color-red)]">WORK</span>
              </h2>

              <p className="mt-8 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Rotate through the project archive. Focus an artifact and select
                it to open its engineering record.
              </p>
            </div>

            <div className="border border-white/10 bg-[var(--color-panel)]/30 px-5 py-4">
              <span className="portfolio-mono block text-[7px] tracking-[0.18em] text-[var(--color-dim)]">
                AVAILABLE ARTIFACTS
              </span>

              <span className="portfolio-display mt-2 block text-4xl font-bold text-[var(--color-cyan)]">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <ProjectCarousel projects={projects} onSelect={handleSelect} />

          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              PROJECT SYSTEM / ONLINE
            </span>

            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]">
              SELECT / INSPECT
            </span>
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectCaseStudy
          project={selectedProject}
          index={selectedIndex}
          scrollY={scrollY}
          onClose={handleClose}
        />
      )}
    </SceneFrame>
  );
}
