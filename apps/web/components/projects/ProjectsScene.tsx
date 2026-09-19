"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";

interface ProjectsSceneProps {
  portfolio: PortfolioData;
}

type ProjectItem = {
  name: string;
  description: string;
  metadata: {
    primary: string;
    secondary: string;
  };
  details: string[];
  links: {
    label: string;
    url: string;
  }[];
};

function isProjectItem(item: unknown): item is ProjectItem {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const candidate = item as Partial<ProjectItem>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.metadata === "object" &&
    candidate.metadata !== null &&
    Array.isArray(candidate.details) &&
    Array.isArray(candidate.links)
  );
}

export default function ProjectsScene({ portfolio }: ProjectsSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const [selectedProject, setSelectedProject] = useState<{
    project: ProjectItem;
    index: number;
  } | null>(null);

  const returnScrollY = useRef(0);

  const projectSections = portfolio.sections.filter(
    (section) => section.kind === "projects",
  );

  const projects = projectSections.flatMap((section) =>
    section.items.filter(isProjectItem),
  );

  function openProject(project: ProjectItem, index: number) {
    returnScrollY.current = window.scrollY;

    setSelectedProject({
      project,
      index,
    });
  }

  function closeProject() {
    setSelectedProject(null);
  }

  useEffect(() => {
    const root = sceneRef.current;

    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const trigger = {
        trigger: root,
        start: "top 72%",
        once: true,
      };

      gsap.fromTo(
        "[data-project-header]",
        {
          opacity: 0,
          x: -45,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-project-stat]",
        {
          opacity: 0,
          y: 25,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-project-card]",
        {
          opacity: 0,
          y: 55,
          scale: 0.94,
          rotateX: 4,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.1,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-project-footer]",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.9,
          ease: "power2.out",
          scrollTrigger: trigger,
        },
      );
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <>
      <SceneFrame
        id="projects"
        number="04"
        label="PROJECT VAULT"
        className="min-h-screen"
      >
        <div ref={sceneRef}>
          <section className="relative min-h-screen overflow-hidden py-24 md:py-32">
            {/* Technical background */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[8%] top-[14%] h-px w-[38%] bg-[var(--color-cyan)]/10" />

              <div className="absolute right-[8%] top-[26%] h-px w-[24%] bg-[var(--color-red)]/10" />

              <div className="absolute bottom-[20%] left-[15%] h-px w-[22%] bg-[var(--color-red)]/10" />

              <div className="absolute bottom-[12%] right-[14%] h-32 w-32 border border-[var(--color-cyan)]/10" />

              <div className="absolute bottom-[15%] right-[17%] h-20 w-20 border border-[var(--color-red)]/10" />

              <div className="absolute left-[50%] top-[18%] h-[55%] w-px bg-gradient-to-b from-transparent via-[var(--color-cyan)]/10 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
              {/* Header */}
              <div
                data-project-header
                className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
              >
                <div>
                  <p className="portfolio-mono mb-7 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                    04 / PROJECT ARCHIVE
                  </p>

                  <h2 className="portfolio-display text-[clamp(4rem,8vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]">
                    THINGS
                    <br />
                    I&apos;VE
                    <br />
                    <span className="text-[var(--color-red)]">BUILT.</span>
                  </h2>

                  <p className="mt-10 max-w-md border-l border-[var(--color-cyan)]/30 pl-6 text-sm leading-7 text-[var(--color-muted)] md:text-base">
                    Systems, experiments and products engineered from ideas into
                    working software.
                  </p>

                  <div className="mt-10 flex items-center gap-5">
                    <div data-project-stat>
                      <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                        ARTIFACTS
                      </p>

                      <p className="portfolio-mono mt-2 text-2xl text-[var(--color-white)]">
                        {String(projects.length).padStart(2, "0")}
                      </p>
                    </div>

                    <div className="h-10 w-px bg-[var(--color-white)]/10" />

                    <div data-project-stat>
                      <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                        VAULT STATUS
                      </p>

                      <p className="portfolio-mono mt-2 text-[9px] text-[var(--color-cyan)]">
                        {projects.length > 0 ? "ONLINE" : "EMPTY"}
                      </p>
                    </div>
                  </div>

                  <p className="portfolio-mono mt-12 text-[8px] tracking-[0.14em] text-[var(--color-dim)]">
                    SELECT AN ARTIFACT TO INSPECT
                  </p>
                </div>

                {/* Project grid */}
                <div>
                  {projects.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/30 p-8">
                      <div className="text-center">
                        <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                          PROJECT ARCHIVE EMPTY
                        </p>

                        <p className="mt-3 text-sm text-[var(--color-muted)]">
                          No project records detected in the active resume.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="grid gap-4 sm:grid-cols-2"
                      style={{ perspective: "1200px" }}
                    >
                      {projects.map((project, index) => (
                        <article
                          key={`${project.name}-${index}`}
                          data-project-card
                          role="button"
                          tabIndex={0}
                          onClick={() => openProject(project, index)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openProject(project, index);
                            }
                          }}
                          className="group relative flex min-h-[380px] cursor-pointer flex-col overflow-hidden border border-[var(--color-white)]/10 bg-[var(--color-panel)]/40 p-6 outline-none backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-cyan)]/40 hover:bg-[var(--color-panel)]/70 focus:-translate-y-2 focus:border-[var(--color-cyan)]/60 focus:ring-1 focus:ring-[var(--color-cyan)]/40 md:p-7"
                          aria-label={`Inspect ${project.name}`}
                        >
                          {/* Corner geometry */}
                          <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 border-b border-l border-[var(--color-cyan)]/10 transition-colors duration-500 group-hover:border-[var(--color-cyan)]/40" />

                          <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 border-r border-t border-[var(--color-red)]/10 transition-colors duration-500 group-hover:border-[var(--color-red)]/40" />

                          {/* Scan line */}
                          <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[var(--color-cyan)] transition-all duration-700 group-hover:w-full" />

                          {/* Vertical scan */}
                          <div className="pointer-events-none absolute bottom-0 right-0 h-0 w-px bg-[var(--color-red)] transition-all duration-700 group-hover:h-full" />

                          {/* Index */}
                          <div className="flex items-center justify-between">
                            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                              ARTIFACT {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="h-1.5 w-1.5 bg-[var(--color-cyan)] opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_12px_var(--color-cyan)]" />
                          </div>

                          {/* Accent */}
                          <div className="mt-7 h-1 w-10 bg-[var(--color-red)] transition-all duration-500 group-hover:w-20 group-hover:bg-[var(--color-cyan)]" />

                          {/* Project name */}
                          <h3 className="portfolio-display mt-6 max-w-[90%] text-2xl font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[var(--color-white)] transition-colors duration-300 group-hover:text-[var(--color-cyan)] md:text-3xl">
                            {project.name}
                          </h3>

                          {/* Description */}
                          <p className="mt-5 text-xs leading-6 text-[var(--color-muted)] md:text-sm">
                            {project.description}
                          </p>

                          {/* Metadata */}
                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.metadata.primary && (
                              <span className="portfolio-mono border border-[var(--color-cyan)]/20 px-2.5 py-1.5 text-[7px] tracking-[0.1em] text-[var(--color-cyan)]">
                                {project.metadata.primary}
                              </span>
                            )}

                            {project.metadata.secondary && (
                              <span className="portfolio-mono border border-[var(--color-white)]/10 px-2.5 py-1.5 text-[7px] tracking-[0.1em] text-[var(--color-dim)]">
                                {project.metadata.secondary}
                              </span>
                            )}
                          </div>

                          {/* Details preview */}
                          {project.details.length > 0 && (
                            <div className="mt-5 border-t border-[var(--color-white)]/5 pt-4">
                              <ul className="space-y-2">
                                {project.details
                                  .slice(0, 2)
                                  .map((detail, detailIndex) => (
                                    <li
                                      key={`${detail}-${detailIndex}`}
                                      className="flex gap-2 text-[10px] leading-5 text-[var(--color-muted)]"
                                    >
                                      <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-red)]" />

                                      <span>{detail}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Action */}
                          <div className="mt-auto flex items-end justify-between pt-7">
                            <span className="portfolio-mono border border-[var(--color-white)]/10 px-4 py-3 text-[8px] tracking-[0.14em] text-[var(--color-white)] transition-all group-hover:border-[var(--color-cyan)]/50 group-hover:text-[var(--color-cyan)]">
                              INSPECT
                              <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </span>

                            <span className="portfolio-mono text-[7px] text-[var(--color-dim)] transition-colors group-hover:text-[var(--color-cyan)]">
                              ENTER
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                data-project-footer
                className="mt-20 flex flex-col gap-5 border-t border-[var(--color-white)]/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                  DISCOVER → BUILD → ITERATE → DEPLOY
                </span>

                <a
                  href="#contact"
                  className="portfolio-mono text-[9px] tracking-[0.14em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
                >
                  START A CONVERSATION →
                </a>
              </div>
            </div>
          </section>
        </div>
      </SceneFrame>

      {selectedProject && (
        <ProjectCaseStudy
          project={selectedProject.project}
          index={selectedProject.index}
          scrollY={returnScrollY.current}
          onClose={closeProject}
        />
      )}
    </>
  );
}
