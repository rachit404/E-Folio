"use client";

import { useMemo, useState, type KeyboardEvent } from "react";

import type { PortfolioData } from "@/content/schema/portfolio";
import GameGate from "@/components/games/GameGate";
import SceneSection from "@/components/shell/SceneSection";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import { buildJourney, windowAround } from "@/lib/portfolio/journey";
import { sceneNumber } from "@/lib/scenes/order";

interface ExperienceSceneProps {
  portfolio: PortfolioData;
}

/** Cards visible along the road at once on wide screens. */
const ROAD_CARDS = 4;

export default function ExperienceScene({ portfolio }: ExperienceSceneProps) {
  const steps = useMemo(() => buildJourney(portfolio), [portfolio]);

  const [focus, setFocus] = useState(Math.max(0, steps.length - 1));

  const visible = windowAround(steps.length, focus, ROAD_CARDS);

  const move = (delta: number) =>
    setFocus((current) =>
      Math.min(steps.length - 1, Math.max(0, current + delta)),
    );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    }
  };

  return (
    <SceneSection id="experience">
      <GameGate sectionId="experience" data={{ labels: [], words: steps.map((step) => step.title) }}>
      <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex max-w-[24rem] shrink-0 flex-col justify-center gap-4 md:w-[26%]">
          <SectionChip number={sceneNumber("experience")} label="Experience" />

          <BrushTitle first="The" second="Journey" />

          <p className="text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:700px)]:hidden">
            A path through study and work, from where it started to what I am
            building now.
          </p>

          <div>
            <a href="#projects" className="cta">
              Explore my projects
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {steps.length === 0 ? (
          <p className="micro self-center text-[var(--color-dim)]">
            No experience records available
          </p>
        ) : (
          <div
            role="group"
            aria-label="Journey steps"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative flex min-h-0 min-w-0 flex-1 gap-4 outline-none"
          >
            {/* Road: wide screens show a staggered row climbing to the right. */}
            <ol className="hidden min-w-0 flex-1 items-end gap-3 pb-4 md:flex">
              {visible.map((index, position) => {
                const step = steps[index];

                const focused = index === focus;

                return (
                  <li
                    key={step.key}
                    className="min-w-0 flex-1 transition-all duration-500"
                    style={{
                      transform: `translateY(${-position * 5.5}svh)`,
                      opacity: focused ? 1 : 0.68,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setFocus(index)}
                      aria-current={focused ? "step" : undefined}
                      className="block h-full w-full text-left"
                    >
                      <StepCard step={step} focused={focused} />
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Small screens: only the focused step. */}
            <div className="flex-1 md:hidden">
              <StepCard step={steps[focus]} focused />
            </div>

            {/* Step rail. */}
            <nav
              aria-label="Steps"
              className="flex shrink-0 items-center gap-2 self-end md:flex-col md:self-center"
            >
              <button
                type="button"
                className="micro px-2 py-1 text-[var(--color-muted)] hover:text-[var(--color-white)] md:hidden"
                onClick={() => move(-1)}
                aria-label="Previous step"
              >
                ‹
              </button>

              {steps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setFocus(index)}
                  aria-label={`Step ${step.number}: ${step.title}`}
                  aria-current={index === focus ? "step" : undefined}
                  className={`micro hidden h-8 w-8 items-center justify-center rounded-full border transition-colors md:flex ${
                    index === focus
                      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                      : "border-white/30 text-[var(--color-white)]/70 hover:border-white"
                  }`}
                >
                  {step.number}
                </button>
              ))}

              <span className="micro text-[var(--color-white)] md:hidden">
                {`${steps[focus].number} / ${String(steps.length).padStart(2, "0")}`}
              </span>

              <button
                type="button"
                className="micro px-2 py-1 text-[var(--color-muted)] hover:text-[var(--color-white)] md:hidden"
                onClick={() => move(1)}
                aria-label="Next step"
              >
                ›
              </button>

              <span className="micro hidden text-[8px] text-[var(--color-accent)] md:block">
                {focus === steps.length - 1 ? "Current" : ""}
              </span>
            </nav>
          </div>
        )}
      </div>
      </GameGate>
    </SceneSection>
  );
}

function StepCard({
  step,
  focused,
}: {
  step: ReturnType<typeof buildJourney>[number];
  focused: boolean;
}) {
  const lines = step.lines.slice(0, step.key === "education" ? 3 : 2);

  return (
    <HoloCard
      tone={step.current ? "accent" : "primary"}
      className="h-full"
      bodyClassName="flex h-full flex-col gap-2 p-4"
    >
      <div className="flex items-start gap-3">
        <span
          className={`micro border px-1.5 py-0.5 ${
            focused
              ? "border-[var(--holo)] text-[var(--holo)]"
              : "border-white/30 text-[var(--color-white)]/70"
          }`}
        >
          {step.number}
        </span>

        <div className="min-w-0">
          <h3 className="micro leading-4 text-[var(--color-white)]">
            {step.title}
          </h3>

          {step.dates && (
            <p className="micro mt-0.5 text-[8px] text-[var(--color-muted)]">
              {step.dates}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs font-semibold leading-4 text-[var(--holo)]">
        {step.subtitle}
      </p>

      <ul className="space-y-1.5 text-[11px] leading-4 text-[var(--color-muted)]">
        {lines.map((line) => (
          <li key={line} className="line-clamp-3 [@media(max-height:760px)]:line-clamp-2">
            {line}
          </li>
        ))}
      </ul>

      {step.current && (
        <p className="micro mt-auto text-[8px] text-[var(--color-accent)]">
          Current
        </p>
      )}
    </HoloCard>
  );
}
