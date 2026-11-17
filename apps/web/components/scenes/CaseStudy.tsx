"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import type { ProjectEntry } from "@/lib/portfolio/derive";

interface CaseStudyProps {
  project: ProjectEntry;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}

/**
 * Full-screen "Mission" view for one project, built only from the
 * project's own resume text: its description, its bullets as the
 * mission timeline, and its links.
 *
 * Rendered through a portal into the theme root so fixed positioning
 * is never trapped by an animated ancestor, while theme colours still
 * apply.
 */
export default function CaseStudy({
  project,
  index,
  total,
  onClose,
  onStep,
}: CaseStudyProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onStep(1);
      }

      if (event.key === "ArrowLeft") {
        onStep(-1);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", onKey);

      opener?.focus?.();
    };
  }, [onClose, onStep]);

  const target =
    typeof document === "undefined"
      ? null
      : (document.querySelector<HTMLElement>("[data-theme]") ?? document.body);

  if (!target) {
    return null;
  }

  const number = String(index + 1).padStart(2, "0");

  const stats = [
    { label: "Chapters", value: String(project.details.length).padStart(2, "0") },
    { label: "Links", value: String(project.links.length).padStart(2, "0") },
    { label: "Project", value: `${number}/${String(total).padStart(2, "0")}` },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-title"
      className="fixed inset-0 z-[100] flex flex-col bg-[var(--color-void)]/88 px-6 pb-6 pt-24 backdrop-blur-md md:px-12"
    >
      <div className="mx-auto grid min-h-0 w-full max-w-[1500px] flex-1 gap-6 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col gap-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="micro self-start text-[var(--color-accent)] hover:text-[var(--color-white)]"
          >
            ← Back to projects
          </button>

          <p className="micro text-[var(--color-muted)]">
            <span className="text-[var(--color-accent)]">Case file</span>
            {` // project-${number}`}
          </p>

          <div id="mission-title">
            <BrushTitle
              first="Mission:"
              second={project.name}
              className="[&_span]:break-words"
            />
          </div>

          <p className="text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:720px)]:text-[13px] [@media(max-height:720px)]:leading-5">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.links.map((link, linkIndex) => (
              <a
                key={`${link.url}-${linkIndex}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkIndex === 0 ? "cta" : "cta-ghost"}
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

          <div className="mt-auto flex gap-3 pt-2">
            <button type="button" className="cta-ghost" onClick={() => onStep(-1)}>
              ← Previous
            </button>

            <button type="button" className="cta-ghost" onClick={() => onStep(1)}>
              Next →
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <HoloCard
            className="min-h-0 flex-1"
            bodyClassName="flex h-full min-h-0 flex-col p-5"
          >
            <p className="micro mb-3 text-[var(--color-primary)]">
              {"// Mission timeline"}
            </p>

            {project.details.length === 0 ? (
              <p className="micro text-[var(--color-dim)]">
                No additional records
              </p>
            ) : (
              <ol
                data-native-scroll
                className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2"
              >
                {project.details.map((detail, detailIndex) => (
                  <li
                    key={`${detailIndex}-${detail}`}
                    className="flex gap-4 border-b border-white/10 pb-3 last:border-b-0"
                  >
                    <span
                      className={`micro shrink-0 pt-0.5 ${
                        detailIndex === 0
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {String(detailIndex + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm leading-6 text-[var(--color-white)]/85">
                      {detail}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </HoloCard>

          <ul className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <li key={stat.label}>
                <HoloCard bodyClassName="p-3">
                  <p className="micro text-[8px] text-[var(--color-muted)]">
                    {stat.label}
                  </p>

                  <p className="brush mt-1 text-2xl text-[var(--color-white)]">
                    {stat.value}
                  </p>
                </HoloCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    target,
  );
}
