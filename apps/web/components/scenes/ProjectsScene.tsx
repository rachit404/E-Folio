"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";

import type { PortfolioData } from "@/content/schema/portfolio";
import GameGate from "@/components/games/GameGate";
import SceneSection from "@/components/shell/SceneSection";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import { projectEntries } from "@/lib/portfolio/derive";
import { sceneNumber } from "@/lib/scenes/order";

import CaseStudy from "./CaseStudy";

interface ProjectsSceneProps {
  portfolio: PortfolioData;
}

/** Circular distance from the active card, in [-n/2, n/2]. */
function offsetFrom(index: number, active: number, count: number): number {
  let offset = index - active;

  if (offset > count / 2) {
    offset -= count;
  }

  if (offset < -count / 2) {
    offset += count;
  }

  return offset;
}

export default function ProjectsScene({ portfolio }: ProjectsSceneProps) {
  const projects = useMemo(() => projectEntries(portfolio), [portfolio]);

  const count = projects.length;

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const step = useCallback(
    (delta: number) => {
      if (count > 0) {
        setActive((current) => (current + delta + count) % count);
      }
    },
    [count],
  );

  const close = useCallback(() => setOpen(false), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  return (
    <SceneSection id="projects">
      <GameGate sectionId="projects" data={{ labels: projects.map((project) => project.name), words: projects.map((project) => project.name) }}>
      <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex max-w-[24rem] shrink-0 flex-col justify-center gap-4 md:w-[26%]">
          <SectionChip number={sceneNumber("projects")} label="Projects" />

          <BrushTitle first="Project" second="Vault" />

          <p className="text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:700px)]:hidden">
            {count > 0
              ? `${count} projects. Pick a card, then open its case file.`
              : "No projects on this resume."}
          </p>

          {count > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="cta-ghost !px-3 !py-2"
                onClick={() => step(-1)}
                aria-label="Previous project"
              >
                ←
              </button>

              <div className="flex gap-1.5">
                {projects.map((project, index) => (
                  <button
                    key={project.name}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Show ${project.name}`}
                    aria-current={index === active}
                    className={`h-1.5 transition-all ${
                      index === active
                        ? "w-6 bg-[var(--color-accent)]"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="cta-ghost !px-3 !py-2"
                onClick={() => step(1)}
                aria-label="Next project"
              >
                →
              </button>
            </div>
          )}
        </div>

        {count > 0 && (
          <div
            role="group"
            aria-label="Projects"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative min-h-[300px] flex-1 outline-none [perspective:1400px]"
          >
            {projects.map((project, index) => {
              const offset = offsetFrom(index, active, count);

              const distance = Math.abs(offset);

              if (distance > 1) {
                return null;
              }

              const featured = offset === 0;

              return (
                <div
                  key={project.name}
                  className={`absolute left-1/2 top-1/2 h-[min(62svh,26rem)] w-[min(88%,26rem)] transition-all duration-500 ease-out md:w-[min(58%,26rem)] ${featured ? "" : "hidden md:block"}`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${offset * 54}%) translateZ(${-distance * 90}px) rotateY(${offset * -12}deg) scale(${1 - distance * 0.1})`,
                    opacity: featured ? 1 : 0.55,
                    zIndex: 10 - distance,
                  }}
                >
                  <button
                    type="button"
                    className="block h-full w-full text-left"
                    aria-label={
                      featured
                        ? `Open case file: ${project.name}`
                        : `Show ${project.name}`
                    }
                    onClick={() => (featured ? setOpen(true) : setActive(index))}
                  >
                    <HoloCard
                      tone={featured ? "accent" : "primary"}
                      className="h-full"
                      bodyClassName="flex h-full flex-col gap-3 p-5"
                    >
                      <p className="micro flex items-center justify-between text-[var(--color-muted)]">
                        <span className="border border-[var(--holo)] px-1.5 py-0.5 text-[var(--holo)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-[8px]">
                          {featured ? "Now showing" : "Archive"}
                        </span>
                      </p>

                      <h3 className="brush text-[clamp(1.1rem,2.2svh+0.6rem,1.7rem)] text-[var(--color-white)]">
                        {project.name}
                      </h3>

                      <p className="line-clamp-4 text-xs leading-5 text-[var(--color-muted)]">
                        {project.description}
                      </p>

                      <div className="mt-auto flex items-end justify-between gap-3">
                        <span className="micro text-[8px] text-[var(--color-dim)]">
                          {project.details.length} chapters
                        </span>

                        {featured && (
                          <span className="cta !px-3 !py-2 !text-[10px]">
                            Case study
                            <span aria-hidden="true">→</span>
                          </span>
                        )}
                      </div>
                    </HoloCard>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {open && count > 0 && (
        <CaseStudy
          project={projects[active]}
          index={active}
          total={count}
          onClose={close}
          onStep={step}
        />
      )}
      </GameGate>
    </SceneSection>
  );
}
