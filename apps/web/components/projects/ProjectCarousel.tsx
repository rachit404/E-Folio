"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectCarouselItem {
  name: string;
  description: string;
  metadata: {
    primary: string;
    secondary: string;
  };
  details: string[];
  links: ProjectLink[];
}

interface ProjectCarouselProps {
  projects: ProjectCarouselItem[];
  onSelect: (project: ProjectCarouselItem, index: number) => void;
}

function normalizeIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getCircularOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;

  if (offset > length / 2) {
    offset -= length;
  }

  if (offset < -length / 2) {
    offset += length;
  }

  return offset;
}

export default function ProjectCarousel({
  projects,
  onSelect,
}: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [pointerInside, setPointerInside] = useState(false);

  const dragStartX = useRef<number | null>(null);

  const count = projects.length;

  const activeProject = useMemo(
    () => projects[activeIndex],
    [activeIndex, projects],
  );

  const rotate = useCallback(
    (direction: number) => {
      if (!count) {
        return;
      }

      setActiveIndex((current) => normalizeIndex(current + direction, count));
    },
    [count],
  );

  const selectIndex = useCallback(
    (index: number) => {
      if (!count) {
        return;
      }

      setActiveIndex(normalizeIndex(index, count));
    },
    [count],
  );

  /*
   * Wheel navigation only becomes active while the
   * pointer is inside the carousel. This prevents the
   * component from hijacking normal page scrolling.
   */
  useEffect(() => {
    if (!count || !pointerInside) {
      return;
    }

    let lastWheelTime = 0;

    const handleWheel = (event: WheelEvent) => {
      const now = performance.now();

      if (now - lastWheelTime < 180) {
        return;
      }

      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      event.preventDefault();

      lastWheelTime = now;

      rotate(event.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [count, pointerInside, rotate]);

  /*
   * Keyboard controls remain available when the user
   * is not typing into another interactive element.
   */
  useEffect(() => {
    if (!count) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.matches(
          "input, textarea, select, button, a, [contenteditable='true']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        rotate(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        rotate(1);
        return;
      }

      if (event.key === "Enter" && activeProject) {
        event.preventDefault();

        onSelect(activeProject, activeIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, activeProject, count, onSelect, rotate]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const delta = event.clientX - dragStartX.current;

    if (Math.abs(delta) < 55) {
      return;
    }

    rotate(delta > 0 ? -1 : 1);

    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = null;

    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (!count) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-white/10 bg-black/30">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/30">
          No project artifacts available
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full select-none"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => {
        setPointerInside(false);
        dragStartX.current = null;
        setIsDragging(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pan-y",
      }}
    >
      <div
        className="relative mx-auto h-[430px] w-full max-w-6xl"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {projects.map((project, index) => {
          const offset = getCircularOffset(index, activeIndex, count);

          const absoluteOffset = Math.abs(offset);

          const isActive = offset === 0;

          if (absoluteOffset > 2) {
            return null;
          }

          const translateX = offset * 230;

          const translateZ = isActive ? 100 : -absoluteOffset * 120;

          const rotateY = offset * -22;

          const scale = isActive
            ? 1
            : Math.max(0.72, 1 - absoluteOffset * 0.11);

          const opacity = isActive
            ? 1
            : Math.max(0.28, 0.68 - absoluteOffset * 0.15);

          return (
            <button
              key={`${project.name}-${index}`}
              type="button"
              aria-label={
                isActive ? `Open ${project.name}` : `Focus ${project.name}`
              }
              aria-current={isActive}
              onClick={() => {
                if (isActive) {
                  onSelect(project, index);
                  return;
                }

                selectIndex(index);
              }}
              className="absolute left-1/2 top-1/2 h-[340px] w-[min(78vw,460px)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{
                transform: `
                    translate(-50%, -50%)
                    translateX(${translateX}px)
                    translateZ(${translateZ}px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                opacity,
                zIndex: 30 - absoluteOffset,
                transition: isDragging
                  ? "none"
                  : "transform 420ms cubic-bezier(.22,.61,.36,1), opacity 300ms ease",
              }}
            >
              <article
                className={[
                  "comic-panel relative flex h-full flex-col overflow-hidden",
                  "transition-[box-shadow,transform] duration-300",
                  isActive
                    ? "[--comic-shadow:var(--color-primary)]"
                    : "[--comic-shadow-offset:4px]",
                ].join(" ")}
              >
                <div className="relative z-10 flex items-center justify-between border-b-[length:var(--comic-border)] border-[var(--comic-ink)] bg-[var(--color-accent)] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-void)]">
                  <span>Issue #{String(index + 1).padStart(2, "0")}</span>

                  <span>{isActive ? "Now reading" : "Archive"}</span>
                </div>

                <div className="relative z-10 flex flex-1 flex-col p-6">
                  {project.metadata.primary && (
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                      {project.metadata.primary}
                    </p>
                  )}

                  <h3 className="portfolio-display text-3xl font-black leading-[0.95] tracking-tight text-[var(--color-white)]">
                    {project.name}
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
                    {project.description}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-dim)]">
                      {project.metadata.secondary ||
                        `${project.details.length} chapters`}
                    </span>

                    <span className="comic-caption">
                      {isActive ? "Read issue →" : "Select"}
                    </span>
                  </div>
                </div>
              </article>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => rotate(-1)}
            aria-label="Previous project"
            className="border-2 border-[var(--comic-ink)] px-4 py-2 font-mono text-xs font-bold text-[var(--color-white)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-void)]"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {projects.map((project, index) => (
              <button
                key={`${project.name}-dot`}
                type="button"
                aria-label={`Focus ${project.name}`}
                aria-current={index === activeIndex}
                onClick={() => selectIndex(index)}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-[var(--color-primary)]"
                    : "w-2 bg-white/25 hover:bg-white/50",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotate(1)}
            aria-label="Next project"
            className="border-2 border-[var(--comic-ink)] px-4 py-2 font-mono text-xs font-bold text-[var(--color-white)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-void)]"
          >
            →
          </button>
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/30">
          Drag / Wheel / ← → / Enter
        </p>
      </div>
    </div>
  );
}
