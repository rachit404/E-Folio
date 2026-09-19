"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface SkillsSceneProps {
  portfolio: PortfolioData;
}

interface SkillRecord {
  name: string;
  description: string;
  category: string;
  index: number;
}

export default function SkillsScene({ portfolio }: SkillsSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const skillSections = useMemo(
    () => portfolio.sections.filter((section) => section.kind === "skills"),
    [portfolio.sections],
  );

  const skills = useMemo<SkillRecord[]>(() => {
    let index = 0;

    return skillSections.flatMap((section) =>
      section.items.flatMap((item) => {
        if (!("name" in item) || !("description" in item)) {
          return [];
        }

        const skill: SkillRecord = {
          name: item.name,
          description: item.description,
          category: section.heading,
          index,
        };

        index += 1;

        return [skill];
      }),
    );
  }, [skillSections]);

  const categoryCount = skillSections.length;

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
        "[data-skills-header]",
        {
          opacity: 0,
          x: -40,
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
        "[data-skills-stats]",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-skill-card]",
        {
          opacity: 0,
          y: 35,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.055,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        "[data-skills-category]",
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          delay: 0.45,
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
    <SceneFrame
      id="skills"
      number="03"
      label="ENGINEERING ARSENAL"
      className="min-h-screen"
    >
      <div ref={sceneRef}>
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Background geometry */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[12%] h-32 w-32 rounded-full border border-[var(--color-cyan)]/10" />

            <div className="absolute left-[calc(10%+16px)] top-[calc(12%+16px)] h-24 w-24 rounded-full border border-[var(--color-red)]/10" />

            <div className="absolute bottom-[10%] right-[8%] h-48 w-48 border border-white/[0.04]" />

            <div className="absolute bottom-[calc(10%+24px)] right-[calc(8%+24px)] h-32 w-32 border border-[var(--color-cyan)]/[0.06]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
            {/* Header */}
            <div
              data-skills-header
              className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"
            >
              <div>
                <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                  SYSTEM LOADOUT // 03
                </p>

                <h2 className="portfolio-display text-[clamp(3rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.06em]">
                  ENGINEERING
                  <br />
                  <span className="text-[var(--color-red)]">ARSENAL</span>
                </h2>

                <p className="mt-8 max-w-xl text-sm leading-6 text-[var(--color-muted)] md:text-base">
                  Technologies, tools and technical capabilities extracted
                  directly from the portfolio data source.
                </p>
              </div>

              {/* System stats */}
              <div className="grid grid-cols-2 border border-white/10 bg-[var(--color-panel)]/30 backdrop-blur-sm">
                <div
                  data-skills-stats
                  className="border-r border-white/10 px-6 py-5"
                >
                  <span className="portfolio-mono block text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                    SKILLS
                  </span>

                  <span className="portfolio-display mt-2 block text-4xl font-bold text-[var(--color-white)]">
                    {String(skills.length).padStart(2, "0")}
                  </span>
                </div>

                <div data-skills-stats className="px-6 py-5">
                  <span className="portfolio-mono block text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                    GROUPS
                  </span>

                  <span className="portfolio-display mt-2 block text-4xl font-bold text-[var(--color-cyan)]">
                    {String(categoryCount).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Skill matrix */}
            {skills.length > 0 ? (
              <div className="mt-20">
                {skillSections.map((section, sectionIndex) => {
                  const sectionSkills = skills.filter(
                    (skill) => skill.category === section.heading,
                  );

                  return (
                    <div
                      key={`${section.heading}-${sectionIndex}`}
                      data-skills-category
                      className="mb-16 last:mb-0"
                    >
                      {/* Category header */}
                      <div className="mb-6 flex items-center gap-4">
                        <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                          {String(sectionIndex + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-10 bg-[var(--color-red)]" />

                        <h3 className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-muted)]">
                          {section.heading}
                        </h3>

                        <span className="portfolio-mono ml-auto text-[8px] text-[var(--color-dim)]">
                          {String(sectionSkills.length).padStart(2, "0")}{" "}
                          MODULES
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {sectionSkills.map((skill) => {
                          const isActive = activeSkill === skill.name;

                          return (
                            <article
                              key={`${skill.name}-${skill.index}`}
                              data-skill-card
                              onMouseEnter={() => setActiveSkill(skill.name)}
                              onMouseLeave={() => setActiveSkill(null)}
                              className={`group relative min-h-[150px] overflow-hidden border bg-[var(--color-panel)]/25 p-5 backdrop-blur-sm transition-all duration-300 ${
                                isActive
                                  ? "border-[var(--color-cyan)]/50 bg-[var(--color-panel)]/50"
                                  : "border-white/10 hover:border-[var(--color-cyan)]/30"
                              }`}
                            >
                              {/* Scan line */}
                              <div
                                className={`pointer-events-none absolute left-0 top-0 h-px bg-[var(--color-cyan)] transition-all duration-500 ${
                                  isActive ? "w-full" : "w-0 group-hover:w-full"
                                }`}
                              />

                              {/* Corner */}
                              <div
                                className={`pointer-events-none absolute right-0 top-0 h-6 w-6 border-l border-b transition-colors duration-300 ${
                                  isActive
                                    ? "border-[var(--color-red)]/50"
                                    : "border-white/5"
                                }`}
                              />

                              {/* Index */}
                              <div className="flex items-start justify-between">
                                <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                                  MOD.
                                  {String(skill.index + 1).padStart(2, "0")}
                                </span>

                                <span
                                  className={`h-1.5 w-1.5 transition-all duration-300 ${
                                    isActive
                                      ? "bg-[var(--color-cyan)] shadow-[0_0_8px_var(--color-cyan)]"
                                      : "bg-[var(--color-dim)]"
                                  }`}
                                />
                              </div>

                              {/* Skill */}
                              <h4
                                className={`portfolio-display mt-7 text-xl font-bold tracking-tight transition-colors duration-300 md:text-2xl ${
                                  isActive
                                    ? "text-[var(--color-cyan)]"
                                    : "text-[var(--color-white)]"
                                }`}
                              >
                                {skill.name}
                              </h4>

                              {/* Description */}
                              <p
                                className={`mt-3 text-xs leading-5 transition-colors duration-300 ${
                                  isActive
                                    ? "text-[var(--color-muted)]"
                                    : "text-[var(--color-dim)]"
                                }`}
                              >
                                {skill.description}
                              </p>

                              {/* Bottom status */}
                              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                                <span className="portfolio-mono text-[7px] tracking-[0.14em] text-[var(--color-dim)]">
                                  {isActive ? "ACTIVE" : "STANDBY"}
                                </span>

                                <span
                                  className={`portfolio-mono text-[7px] transition-colors duration-300 ${
                                    isActive
                                      ? "text-[var(--color-cyan)]"
                                      : "text-[var(--color-dim)]"
                                  }`}
                                >
                                  {isActive ? "●" : "○"}
                                </span>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-20 border border-dashed border-white/10 p-12 text-center">
                <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                  NO SKILL RECORDS AVAILABLE
                </p>
              </div>
            )}

            {/* Bottom system bar */}
            <div className="mt-20 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <span className="h-2 w-2 animate-pulse bg-[var(--color-cyan)]" />

                  <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-muted)]">
                    ALL SYSTEMS AVAILABLE
                  </span>
                </div>

                <a
                  href="#projects"
                  className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
                >
                  ACCESS PROJECT ARCHIVE →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
