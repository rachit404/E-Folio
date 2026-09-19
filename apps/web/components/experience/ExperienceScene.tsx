"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface ExperienceSceneProps {
  portfolio: PortfolioData;
}

export default function ExperienceScene({ portfolio }: ExperienceSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const timelineSections = portfolio.sections.filter(
    (section) => section.kind === "timeline" || section.kind === "positions",
  );

  const timelineEntries = timelineSections.filter(
    (section) => section.kind === "timeline",
  );

  const positionEntries = timelineSections.filter(
    (section) => section.kind === "positions",
  );

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
        "[data-experience-header]",
        {
          opacity: 0,
          x: -35,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-experience-rail]",
        {
          scaleY: 0,
          transformOrigin: "top",
        },
        {
          scaleY: 1,
          duration: 1.4,
          delay: 0.2,
          ease: "power3.inOut",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-experience-entry]",
        {
          opacity: 0,
          x: 55,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          stagger: 0.18,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-experience-node]",
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.18,
          delay: 0.45,
          ease: "back.out(1.7)",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-experience-detail]",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.65,
          ease: "power2.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-position-entry]",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          delay: 0.75,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <SceneFrame
      id="experience"
      number="02"
      label="JOURNEY / EXPERIENCE"
      className="min-h-screen"
    >
      <div ref={sceneRef}>
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
            {/* Header */}
            <div
              data-experience-header
              className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
            >
              <div>
                <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                  CAREER LOG // 02
                </p>

                <h2 className="portfolio-display text-[clamp(3rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.06em]">
                  FIELD
                  <br />
                  <span className="text-[var(--color-red)]">RECORDS</span>
                </h2>
              </div>

              <div className="max-w-sm">
                <p className="text-sm leading-6 text-[var(--color-muted)] md:text-base">
                  A chronological record of engineering work, internships, roles
                  and technical environments.
                </p>
              </div>
            </div>

            {/* Timeline */}
            {timelineEntries.length > 0 && (
              <div className="relative">
                {/* Rail */}
                <div
                  data-experience-rail
                  className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-b from-[var(--color-cyan)] via-[var(--color-cyan)]/30 to-transparent md:left-[15px]"
                />

                <div className="space-y-10 md:space-y-14">
                  {timelineEntries.flatMap((section) =>
                    section.items.map((item, itemIndex) => {
                      if (
                        !(
                          "organization" in item &&
                          "role" in item &&
                          "dates" in item &&
                          "details" in item
                        )
                      ) {
                        return null;
                      }

                      return (
                        <article
                          key={`${section.heading}-${itemIndex}`}
                          data-experience-entry
                          className="relative pl-10 md:pl-16"
                        >
                          {/* Node */}
                          <div
                            data-experience-node
                            className="absolute left-[5px] top-2 flex h-3 w-3 items-center justify-center rounded-full border border-[var(--color-cyan)] bg-[var(--color-void)] md:left-[9px]"
                          >
                            <span className="h-1 w-1 rounded-full bg-[var(--color-cyan)]" />
                          </div>

                          {/* Entry */}
                          <div className="group relative overflow-hidden border border-white/10 bg-[var(--color-panel)]/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-cyan)]/30 hover:bg-[var(--color-panel)]/50 md:p-8">
                            <div className="pointer-events-none absolute right-0 top-0 h-px w-0 bg-[var(--color-cyan)] transition-all duration-500 group-hover:w-full" />

                            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                              <div>
                                <p
                                  data-experience-detail
                                  className="portfolio-mono mb-2 text-[8px] tracking-[0.16em] text-[var(--color-cyan)]"
                                >
                                  {section.heading}
                                </p>

                                <h3
                                  data-experience-detail
                                  className="portfolio-display text-2xl font-bold tracking-tight text-[var(--color-white)] md:text-3xl"
                                >
                                  {item.organization}
                                </h3>

                                <p
                                  data-experience-detail
                                  className="mt-2 text-sm text-[var(--color-red)]"
                                >
                                  {item.role}
                                </p>
                              </div>

                              <span
                                data-experience-detail
                                className="portfolio-mono shrink-0 border border-white/10 px-3 py-2 text-[8px] tracking-[0.12em] text-[var(--color-muted)]"
                              >
                                {item.dates}
                              </span>
                            </div>

                            {item.secondary && (
                              <p
                                data-experience-detail
                                className="mt-5 text-xs text-[var(--color-dim)]"
                              >
                                {item.secondary}
                              </p>
                            )}

                            {item.details.length > 0 && (
                              <div className="mt-7 border-t border-white/10 pt-6">
                                <ul className="space-y-3">
                                  {item.details.map((detail, detailIndex) => (
                                    <li
                                      key={`${detail}-${detailIndex}`}
                                      data-experience-detail
                                      className="flex gap-4 text-sm leading-6 text-[var(--color-muted)]"
                                    >
                                      <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-cyan)]">
                                        {String(detailIndex + 1).padStart(
                                          2,
                                          "0",
                                        )}
                                      </span>

                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    }),
                  )}
                </div>
              </div>
            )}

            {/* Positions */}
            {positionEntries.length > 0 && (
              <div className="mt-24">
                <div className="mb-8 flex items-center gap-4">
                  <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                    ADDITIONAL RECORDS
                  </span>

                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {positionEntries.flatMap((section) =>
                    section.items.map((item, itemIndex) => {
                      if (
                        !(
                          "title" in item &&
                          "organization" in item &&
                          "dates" in item
                        )
                      ) {
                        return null;
                      }

                      return (
                        <article
                          key={`${section.heading}-${itemIndex}`}
                          data-position-entry
                          className="group relative border border-white/10 bg-[var(--color-panel)]/20 p-6 transition-all duration-500 hover:border-[var(--color-red)]/30 hover:bg-[var(--color-panel)]/40"
                        >
                          <div className="mb-6 flex items-center justify-between">
                            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                              POSITION
                            </span>

                            <span className="h-1.5 w-1.5 bg-[var(--color-red)] opacity-50 transition-opacity group-hover:opacity-100" />
                          </div>

                          <h3 className="portfolio-display text-xl font-bold text-[var(--color-white)] md:text-2xl">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-[var(--color-red)]">
                            {item.organization}
                          </p>

                          <p className="portfolio-mono mt-5 text-[8px] tracking-[0.12em] text-[var(--color-muted)]">
                            {item.dates}
                          </p>
                        </article>
                      );
                    }),
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {timelineEntries.length === 0 && positionEntries.length === 0 && (
              <div className="border border-dashed border-white/10 p-10 text-center">
                <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                  NO EXPERIENCE RECORDS AVAILABLE
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                END OF RECORD
              </span>

              <a
                href="#skills"
                className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
              >
                SKILLS →
              </a>
            </div>
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
