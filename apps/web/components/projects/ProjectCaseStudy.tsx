"use client";

import { useEffect } from "react";

interface ProjectLink {
  label: string;
  url: string;
}

interface Project {
  name: string;
  description: string;
  metadata: {
    primary: string;
    secondary: string;
  };
  details: string[];
  links: ProjectLink[];
}

interface ProjectCaseStudyProps {
  project: Project;
  index: number;
  scrollY: number;
  onClose: () => void;
}

export default function ProjectCaseStudy({
  project,
  index,
  scrollY,
  onClose,
}: ProjectCaseStudyProps) {
  useEffect(() => {
    /*
     * Freeze the underlying document at the exact position
     * where the user opened the project.
     *
     * This is more reliable than simply using
     * document.body.style.overflow = "hidden".
     */
    const body = document.body;

    const previousPosition = body.style.position;

    const previousTop = body.style.top;

    const previousWidth = body.style.width;

    const previousOverflow = body.style.overflow;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      body.style.position = previousPosition;

      body.style.top = previousTop;

      body.style.width = previousWidth;

      body.style.overflow = previousOverflow;

      /*
       * Restore the exact position after the
       * overlay has been removed.
       */
      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: "instant",
      });
    };
  }, [onClose, scrollY]);

  return (
    <div
      data-native-scroll
      className="fixed inset-0 z-[100] h-[100dvh] overflow-y-auto overscroll-contain bg-[var(--color-void)]/95 backdrop-blur-xl"
    >
      {/* Technical background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-px w-[45%] bg-[var(--color-cyan)]/20" />

        <div className="absolute right-[5%] top-[35%] h-px w-[30%] bg-[var(--color-red)]/20" />

        <div className="absolute bottom-[20%] left-[20%] h-px w-[25%] bg-[var(--color-red)]/10" />

        <div className="absolute bottom-[15%] right-[12%] h-48 w-48 border border-[var(--color-cyan)]/10" />

        <div className="absolute bottom-[18%] right-[15%] h-32 w-32 border border-[var(--color-red)]/10" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.07),transparent_35%),radial-gradient(circle_at_25%_70%,rgba(255,33,71,0.06),transparent_35%)]" />
      </div>

      {/* Scrollable content */}
      <div className="relative min-h-full">
        <div className="mx-auto min-h-screen max-w-[1500px] px-6 py-24 md:px-10 md:py-28">
          {/* Top bar */}
          <div className="mb-14 flex items-center justify-between border-b border-[var(--color-white)]/10 pb-5">
            <div className="flex items-center gap-4">
              <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                CASE STUDY
              </span>

              <span className="h-px w-8 bg-[var(--color-red)]" />

              <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                ARTIFACT {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="portfolio-mono flex items-center gap-3 border border-[var(--color-white)]/10 px-4 py-3 text-[8px] tracking-[0.14em] text-[var(--color-white)] transition-colors hover:border-[var(--color-red)]/50 hover:text-[var(--color-red)]"
              aria-label="Close project case study"
            >
              CLOSE
              <span className="text-sm">×</span>
            </button>
          </div>

          {/* Main content */}
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            {/* Project identity */}
            <div>
              <p className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-red)]">
                PROJECT RECORD / VERIFIED
              </p>

              <h1
                id="project-case-study-title"
                className="portfolio-display mt-7 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[var(--color-white)]"
              >
                {project.name}
              </h1>

              <div className="mt-10 max-w-3xl border-l border-[var(--color-cyan)]/40 pl-6">
                <p className="text-base leading-8 text-[var(--color-muted)] md:text-lg">
                  {project.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-10 flex flex-wrap gap-3">
                {project.metadata.primary && (
                  <span className="portfolio-mono border border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/[0.03] px-4 py-3 text-[8px] tracking-[0.12em] text-[var(--color-cyan)]">
                    {project.metadata.primary}
                  </span>
                )}

                {project.metadata.secondary && (
                  <span className="portfolio-mono border border-[var(--color-white)]/10 px-4 py-3 text-[8px] tracking-[0.12em] text-[var(--color-muted)]">
                    {project.metadata.secondary}
                  </span>
                )}
              </div>
            </div>

            {/* Artifact visualization */}
            <div className="relative min-h-[320px] border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/30">
              <div className="absolute inset-5 border border-[var(--color-white)]/5" />

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-cyan)]/30">
                <div className="absolute inset-5 border border-[var(--color-red)]/30" />

                <div className="absolute inset-10 border border-[var(--color-cyan)]/30" />

                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-cyan)] shadow-[0_0_20px_var(--color-cyan)]" />
              </div>

              <span className="portfolio-mono absolute left-7 top-7 text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                ARTIFACT VISUALIZER
              </span>

              <span className="portfolio-mono absolute bottom-7 left-7 text-[7px] tracking-[0.16em] text-[var(--color-cyan)]">
                SYSTEM / ONLINE
              </span>

              <span className="portfolio-mono absolute bottom-7 right-7 text-[7px] text-[var(--color-dim)]">
                0{index + 1}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="mt-20 grid gap-10 lg:grid-cols-[0.35fr_1fr]">
            <div>
              <p className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                IMPLEMENTATION LOG
              </p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--color-muted)]">
                Engineering details extracted directly from the active portfolio
                source.
              </p>
            </div>

            <div className="border-t border-[var(--color-white)]/10">
              {project.details.length > 0 ? (
                <ul>
                  {project.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="group flex gap-5 border-b border-[var(--color-white)]/10 py-6"
                    >
                      <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-red)]">
                        {String(detailIndex + 1).padStart(2, "0")}
                      </span>

                      <span className="max-w-3xl text-sm leading-7 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-white)] md:text-base">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-6">
                  <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                    NO ADDITIONAL IMPLEMENTATION RECORDS
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="mt-16 border-t border-[var(--color-white)]/10 pt-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                EXTERNAL TRANSMISSIONS
              </span>

              <div className="flex flex-wrap gap-3">
                {project.links.length > 0 ? (
                  project.links.map((link, linkIndex) => (
                    <a
                      key={`${link.url}-${linkIndex}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="portfolio-mono inline-flex items-center gap-4 border border-[var(--color-cyan)]/20 px-5 py-3 text-[8px] tracking-[0.14em] text-[var(--color-cyan)] transition-all hover:border-[var(--color-cyan)]/60 hover:bg-[var(--color-cyan)]/[0.04]"
                    >
                      {link.label.toUpperCase()}
                      <span>↗</span>
                    </a>
                  ))
                ) : (
                  <span className="portfolio-mono border border-[var(--color-white)]/10 px-5 py-3 text-[8px] text-[var(--color-dim)]">
                    NO EXTERNAL LINKS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom breathing room */}
          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
