"use client";

import { useCallback, useEffect, useRef } from "react";

import gsap from "gsap";

import { usePortfolioWorld } from "@/components/world/context/PortfolioWorldContext";

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
  const rootRef = useRef<HTMLDivElement>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { setWorld } = usePortfolioWorld();

  /*
   * Case Study is an interaction-driven sub-world.
   *
   * It is not a normal scroll section, so entering
   * the case study explicitly changes the world state.
   */
  useEffect(() => {
    setWorld("case-study");
  }, [setWorld]);

  /*
   * Centralized close handler.
   *
   * ProjectsScene owns the actual selected-project state,
   * while this component tells the world system that we
   * are leaving Case Study.
   */
  const handleClose = useCallback(() => {
    setWorld("projects");
    onClose();
  }, [onClose, setWorld]);

  /*
   * Lock the main document while the case study owns
   * the viewport.
   */
  useEffect(() => {
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
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(focusTimer);

      document.removeEventListener("keydown", handleKeyDown);

      body.style.position = previousPosition;

      body.style.top = previousTop;

      body.style.width = previousWidth;

      body.style.overflow = previousOverflow;

      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: "instant",
      });
    };
  }, [handleClose, scrollY]);

  /*
   * Cinematic entrance animation.
   */
  useEffect(() => {
    const root = rootRef.current;

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
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          "[data-case-topbar]",
          {
            opacity: 0,
            y: -20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
        )
        .fromTo(
          "[data-case-label]",
          {
            opacity: 0,
            x: -25,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
          },
          "-=0.25",
        )
        .fromTo(
          "[data-case-title]",
          {
            opacity: 0,
            y: 70,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
          },
          "-=0.2",
        )
        .fromTo(
          "[data-case-description]",
          {
            opacity: 0,
            x: -30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
          },
          "-=0.45",
        )
        .fromTo(
          "[data-case-meta]",
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.1,
          },
          "-=0.25",
        )
        .fromTo(
          "[data-case-visual]",
          {
            opacity: 0,
            x: 55,
            scale: 0.92,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
          },
          "-=0.65",
        )
        .fromTo(
          "[data-case-log]",
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.2",
        )
        .fromTo(
          "[data-case-detail]",
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .fromTo(
          "[data-case-links]",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.15",
        );
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-native-scroll
      className="fixed inset-0 z-[100] h-[100dvh] overflow-y-auto overscroll-contain bg-[var(--color-void)]/98 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-case-study-title"
    >
      {/* Global atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-px w-[45%] bg-[var(--color-cyan)]/20" />

        <div className="absolute right-[5%] top-[34%] h-px w-[30%] bg-[var(--color-red)]/20" />

        <div className="absolute bottom-[20%] left-[20%] h-px w-[25%] bg-[var(--color-red)]/10" />

        <div className="absolute bottom-[15%] right-[12%] h-48 w-48 border border-[var(--color-cyan)]/10" />

        <div className="absolute bottom-[18%] right-[15%] h-32 w-32 border border-[var(--color-red)]/10" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.07),transparent_35%),radial-gradient(circle_at_25%_70%,rgba(255,33,71,0.06),transparent_35%)]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* Scrollable content */}
      <div className="relative min-h-full">
        <div className="mx-auto min-h-screen max-w-[1500px] px-6 py-24 md:px-10 md:py-28">
          {/* Top bar */}
          <div
            data-case-topbar
            className="mb-14 flex items-center justify-between border-b border-[var(--color-white)]/10 pb-5"
          >
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
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="portfolio-mono flex items-center gap-3 border border-[var(--color-white)]/10 px-4 py-3 text-[8px] tracking-[0.14em] text-[var(--color-white)] transition-all hover:border-[var(--color-red)]/50 hover:text-[var(--color-red)] focus:border-[var(--color-cyan)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)]/40"
              aria-label="Close project case study"
            >
              CLOSE
              <span className="text-sm">×</span>
            </button>
          </div>

          {/* Main identity */}
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <div>
              <p
                data-case-label
                className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-red)]"
              >
                PROJECT RECORD / VERIFIED
              </p>

              <h1
                id="project-case-study-title"
                data-case-title
                className="portfolio-display mt-7 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[var(--color-white)]"
              >
                {project.name}
              </h1>

              <div
                data-case-description
                className="mt-10 max-w-3xl border-l border-[var(--color-cyan)]/40 pl-6"
              >
                <p className="text-base leading-8 text-[var(--color-muted)] md:text-lg">
                  {project.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-10 flex flex-wrap gap-3">
                {project.metadata.primary && (
                  <span
                    data-case-meta
                    className="portfolio-mono border border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/[0.03] px-4 py-3 text-[8px] tracking-[0.12em] text-[var(--color-cyan)]"
                  >
                    {project.metadata.primary}
                  </span>
                )}

                {project.metadata.secondary && (
                  <span
                    data-case-meta
                    className="portfolio-mono border border-[var(--color-white)]/10 px-4 py-3 text-[8px] tracking-[0.12em] text-[var(--color-muted)]"
                  >
                    {project.metadata.secondary}
                  </span>
                )}
              </div>
            </div>

            {/* Artifact visualizer */}
            <div
              data-case-visual
              className="relative min-h-[340px] overflow-hidden border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/30"
            >
              <div className="absolute inset-5 border border-[var(--color-white)]/5" />

              <div className="absolute left-7 top-7">
                <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                  ARTIFACT VISUALIZER
                </span>
              </div>

              {/* Orbit */}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-[var(--color-cyan)]/20">
                <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-cyan)] shadow-[0_0_15px_var(--color-cyan)]" />
              </div>

              {/* Counter orbit */}
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-[var(--color-red)]/20">
                <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 bg-[var(--color-red)] shadow-[0_0_15px_var(--color-red)]" />
              </div>

              {/* Core */}
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-cyan)]/30">
                <div className="absolute inset-5 border border-[var(--color-red)]/30" />

                <div className="absolute inset-10 border border-[var(--color-cyan)]/30" />

                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-cyan)] shadow-[0_0_25px_var(--color-cyan)]" />
              </div>

              {/* Crosshair */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-px -translate-x-1/2 bg-[var(--color-cyan)]/10" />

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-72 -translate-x-1/2 bg-[var(--color-cyan)]/10" />

              <span className="portfolio-mono absolute bottom-7 left-7 text-[7px] tracking-[0.16em] text-[var(--color-cyan)]">
                SYSTEM / ONLINE
              </span>

              <span className="portfolio-mono absolute bottom-7 right-7 text-[7px] text-[var(--color-dim)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Implementation log */}
          <div
            data-case-log
            className="mt-24 grid gap-10 lg:grid-cols-[0.35fr_1fr]"
          >
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
                      key={`${detail}-${detailIndex}`}
                      data-case-detail
                      className="group flex gap-5 border-b border-[var(--color-white)]/10 py-6"
                    >
                      <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-red)]">
                        {String(detailIndex + 1).padStart(2, "0")}
                      </span>

                      <span className="max-w-3xl text-sm leading-7 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-white)] md:text-base">
                        {detail}
                      </span>

                      <span className="ml-auto mt-2 hidden h-1 w-1 shrink-0 bg-[var(--color-cyan)] opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
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
          <div
            data-case-links
            className="mt-16 border-t border-[var(--color-white)]/10 pt-7"
          >
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
                      className="portfolio-mono inline-flex items-center gap-4 border border-[var(--color-cyan)]/20 px-5 py-3 text-[8px] tracking-[0.14em] text-[var(--color-cyan)] transition-all hover:border-[var(--color-cyan)]/60 hover:bg-[var(--color-cyan)]/[0.04] focus:border-[var(--color-cyan)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--color-cyan)]/30"
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

          {/* Footer */}
          <div className="mt-16 flex items-center justify-between border-t border-[var(--color-white)]/10 pt-6">
            <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
              CASE RECORD / END
            </span>

            <button
              type="button"
              onClick={handleClose}
              className="portfolio-mono text-[8px] tracking-[0.14em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)] focus:outline-none"
            >
              RETURN TO ARCHIVE ↑
            </button>
          </div>

          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
