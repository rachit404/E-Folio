"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

gsap.registerPlugin(ScrollTrigger);

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

  const sections = useMemo(
    () => portfolio.sections.filter((section) => section.kind === "skills"),
    [portfolio.sections],
  );

  const skills = useMemo<SkillRecord[]>(() => {
    let index = 0;

    return sections.flatMap((section) =>
      section.items.flatMap((item) => {
        if (
          !("name" in item) ||
          !("description" in item) ||
          typeof item.name !== "string" ||
          typeof item.description !== "string"
        ) {
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
  }, [sections]);

  useEffect(() => {
    const root = sceneRef.current;

    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const trigger = {
        trigger: root,
        start: "top 72%",
        once: true,
      };

      const animate = (
        selector: string,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
      ) => {
        const elements = root.querySelectorAll(selector);

        if (!elements.length) return;

        gsap.fromTo(elements, from, {
          ...to,
          scrollTrigger: trigger,
        });
      };

      animate(
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
        },
      );

      animate(
        "[data-skill-category]",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      animate(
        "[data-skill-card]",
        {
          opacity: 0,
          y: 25,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
        },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <SceneFrame
      id="skills"
      number="05"
      label="ENGINEERING ARSENAL"
      className="min-h-screen"
    >
      <div ref={sceneRef}>
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[15%] h-32 w-32 rounded-full border border-[var(--color-cyan)]/10" />
            <div className="absolute bottom-[15%] right-[10%] h-44 w-44 border border-[var(--color-red)]/[0.06]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
            <div
              data-skills-header
              className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <p className="portfolio-mono mb-4 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
                  CAPABILITY MATRIX // 05
                </p>

                <h2 className="portfolio-display text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
                  ENGINEERING
                  <br />
                  <span className="text-[var(--color-red)]">ARSENAL</span>
                </h2>

                <p className="mt-8 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                  Technical capabilities and tools extracted directly from the
                  portfolio data.
                </p>
              </div>

              <div className="grid grid-cols-2 border border-white/10 bg-[var(--color-panel)]/30">
                <div className="border-r border-white/10 px-6 py-5">
                  <span className="portfolio-mono block text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                    MODULES
                  </span>

                  <span className="portfolio-display mt-2 block text-4xl font-bold text-white">
                    {String(skills.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="px-6 py-5">
                  <span className="portfolio-mono block text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                    GROUPS
                  </span>

                  <span className="portfolio-display mt-2 block text-4xl font-bold text-[var(--color-cyan)]">
                    {String(sections.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {sections.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center">
                <span className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-dim)]">
                  NO SKILL RECORDS AVAILABLE
                </span>
              </div>
            ) : (
              <div className="space-y-16">
                {sections.map((section, sectionIndex) => {
                  const sectionSkills = skills.filter(
                    (skill) => skill.category === section.heading,
                  );

                  return (
                    <div
                      key={`${section.heading}-${sectionIndex}`}
                      data-skill-category
                    >
                      <div className="mb-6 flex items-center gap-4">
                        <span className="portfolio-mono text-[8px] text-[var(--color-cyan)]">
                          {String(sectionIndex + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-10 bg-[var(--color-red)]" />

                        <h3 className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-muted)]">
                          {section.heading}
                        </h3>

                        <span className="portfolio-mono ml-auto text-[7px] text-[var(--color-dim)]">
                          {String(sectionSkills.length).padStart(2, "0")}{" "}
                          MODULES
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {sectionSkills.map((skill) => {
                          const active = activeSkill === skill.name;

                          return (
                            <button
                              key={`${skill.name}-${skill.index}`}
                              type="button"
                              data-skill-card
                              onMouseEnter={() => setActiveSkill(skill.name)}
                              onMouseLeave={() => setActiveSkill(null)}
                              onFocus={() => setActiveSkill(skill.name)}
                              onBlur={() => setActiveSkill(null)}
                              className={`group relative min-h-[170px] overflow-hidden border p-5 text-left transition-all duration-300 ${
                                active
                                  ? "border-[var(--color-cyan)]/50 bg-[var(--color-panel)]/60"
                                  : "border-white/10 bg-[var(--color-panel)]/25 hover:border-[var(--color-cyan)]/30"
                              }`}
                            >
                              <span
                                className={`absolute left-0 top-0 h-px bg-[var(--color-cyan)] transition-all duration-500 ${
                                  active ? "w-full" : "w-0 group-hover:w-full"
                                }`}
                              />

                              <div className="flex items-center justify-between">
                                <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                                  MOD.{String(skill.index + 1).padStart(2, "0")}
                                </span>

                                <span
                                  className={`h-1.5 w-1.5 ${
                                    active
                                      ? "bg-[var(--color-cyan)] shadow-[0_0_10px_var(--color-cyan)]"
                                      : "bg-[var(--color-dim)]"
                                  }`}
                                />
                              </div>

                              <h4
                                className={`portfolio-display mt-7 text-xl font-bold md:text-2xl ${
                                  active
                                    ? "text-[var(--color-cyan)]"
                                    : "text-white"
                                }`}
                              >
                                {skill.name}
                              </h4>

                              <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
                                {skill.description}
                              </p>

                              <span className="portfolio-mono absolute bottom-4 right-5 text-[7px] text-[var(--color-dim)]">
                                {active ? "ACTIVE" : "STANDBY"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                CAPABILITY MATRIX / END
              </span>

              <a
                href="#projects"
                className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)] hover:text-white"
              >
                PROJECT ARCHIVE →
              </a>
            </div>
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
