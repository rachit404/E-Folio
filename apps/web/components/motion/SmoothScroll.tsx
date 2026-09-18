"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.08,

      /*
       * Elements marked with data-native-scroll
       * keep normal browser wheel/touch scrolling.
       *
       * This is required for:
       * - modal dialogs
       * - case studies
       * - command palettes
       * - future terminal/code panels
       * - any independently scrollable UI
       */
      prevent: (node) => {
        return (
          node instanceof HTMLElement &&
          Boolean(node.closest("[data-native-scroll]"))
        );
      },
    });

    let animationFrame = 0;

    const raf = (time: number) => {
      lenis.raf(time);

      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);

      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
