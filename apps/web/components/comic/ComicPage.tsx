"use client";

import { useEffect, useRef, type ReactNode } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useTheme } from "@/components/layout/ThemeProvider";

import { frameLabel, revealVars } from "./reveal";

gsap.registerPlugin(ScrollTrigger);

interface ComicPageProps {
  /** Section id, used to look up the theme's onomatopoeia. */
  sceneId: string;

  /** Label shown on the left of the page bar, e.g. "ISSUE 02". */
  issue: string;

  /**
   * Show the section's onomatopoeia on this page. Scenes with several
   * pages enable it on the first page only.
   */
  showSfx?: boolean;

  children: ReactNode;
}

/**
 * One comic page: a grid of <ComicPanel>s whose reveal is scrubbed
 * by scroll, frame by frame.
 *
 * Each panel owns a small timeline (panel, then its beats) tied to
 * its own scroll position, so panels play in the order the reader
 * reaches them. The FRAME counter reflects how many have played.
 *
 * Without JS, or with prefers-reduced-motion, every panel is simply
 * visible.
 */
export default function ComicPage({
  sceneId,
  issue,
  showSfx = true,
  children,
}: ComicPageProps) {
  const theme = useTheme();

  const rootRef = useRef<HTMLDivElement>(null);

  const { style, scrub } = theme.comic.reveal;

  const sfx = showSfx ? theme.comic.sfx[sceneId] : undefined;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const panels = gsap.utils.toArray<HTMLElement>(
      "[data-comic-panel]",
      root,
    );

    const counter = root.querySelector("[data-comic-counter]");

    const total = panels.length;

    const write = (current: number) => {
      if (counter) {
        counter.textContent = frameLabel(current, total);
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      write(total);

      return;
    }

    write(0);

    const played = new Set<number>();

    const context = gsap.context(() => {
      panels.forEach((panel, index) => {
        const beats = panel.querySelectorAll("[data-comic-beat]");

        const { from, to } = revealVars(style, index);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            end: "top 55%",
            scrub,
            onUpdate: (self) => {
              if (self.progress > 0.6) {
                played.add(index);
              } else {
                played.delete(index);
              }

              write(played.size);
            },
          },
        });

        timeline.fromTo(panel, from, {
          ...to,
          duration: 1,
          ease: "power2.out",
        });

        if (beats.length) {
          timeline.fromTo(
            beats,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.out",
            },
            "-=0.35",
          );
        }
      });

      if (sfx) {
        gsap.fromTo(
          "[data-comic-sfx]",
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2.2)",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, root);

    /*
     * Trigger positions are measured when the effect runs, but the
     * page keeps changing height afterwards (web fonts, images, the
     * WebGL canvas, other scenes). Re-measure when that happens so
     * panels reveal where they actually are.
     */
    let refreshTimer: number | undefined;

    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);

      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    scheduleRefresh();

    window.addEventListener("load", scheduleRefresh);

    void document.fonts?.ready.then(scheduleRefresh);

    const resizeObserver = new ResizeObserver(scheduleRefresh);

    resizeObserver.observe(document.body);

    return () => {
      window.clearTimeout(refreshTimer);

      window.removeEventListener("load", scheduleRefresh);

      resizeObserver.disconnect();

      context.revert();
    };
  }, [style, scrub, sfx]);

  return (
    <div ref={rootRef} className="relative">
      <div className="mb-8 flex items-center justify-between gap-6">
        <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-primary)]">
          {issue}
        </span>

        <span className="h-px flex-1 bg-white/10" />

        <span
          data-comic-counter
          aria-hidden="true"
          className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-dim)]"
        >
          {frameLabel(0, 0)}
        </span>
      </div>

      {sfx && (
        <span
          data-comic-sfx
          aria-hidden="true"
          className="comic-sfx pointer-events-none absolute -top-8 right-2 z-20 md:right-8"
        >
          {sfx}
        </span>
      )}

      <div
        className="grid md:grid-cols-2"
        style={{ gap: "var(--comic-gutter)" }}
      >
        {children}
      </div>
    </div>
  );
}
