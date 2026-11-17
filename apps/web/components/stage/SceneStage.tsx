"use client";

import { useEffect, useRef } from "react";

import {
  CityRenderer,
  parseColor,
  rgba,
  type CityPalette,
} from "@/lib/scenes/city";
import {
  coverRect,
  dissolvePlan,
  frameIndex,
  framePath,
  loadOrder,
  nearestLoaded,
  pickSequence,
  pushZoom,
  sceneProgress,
  visibleFraction,
  type SceneManifest,
} from "@/lib/scenes/frames";

interface SceneStageProps {
  /** Section element ids, in page order. */
  scenes: string[];
  /** Frame sequences per scene id; missing ids use the placeholder. */
  manifest: Record<string, SceneManifest>;
  palette: CityPalette;
}

interface FrameSet {
  pattern: string;
  pad: number;
  count: number;
  images: (HTMLImageElement | null)[];
  loaded: boolean[];
  failed: boolean;
  queue: number[];
}

interface SceneState {
  id: string;
  element: HTMLElement | null;
  progress: number;
  frames: FrameSet | null;
  renderer: CityRenderer | null;
}

const SMOOTHING = 0.12;
const CONCURRENT_LOADS = 6;

/**
 * Fixed full-viewport stage behind the page.
 *
 * Each section is a scene. Scrolling is the playhead: a scene's
 * progress (0..1 as its section scrolls through the viewport) picks
 * the frame to draw, smoothed so motion feels slow and cinematic.
 * Neighbouring scenes cross-dissolve. A scene without a frame
 * sequence is drawn by the procedural placeholder.
 */
export default function SceneStage({
  scenes,
  manifest,
  palette,
}: SceneStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const narrow = window.matchMedia("(max-width: 767px)");

    const states: SceneState[] = scenes.map((id) => ({
      id,
      element: document.getElementById(id),
      progress: 0,
      frames: null,
      renderer: null,
    }));

    let width = 0;
    let height = 0;
    let animation = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = Math.round(window.innerWidth * dpr);
      height = Math.round(window.innerHeight * dpr);

      canvas.width = width;
      canvas.height = height;

      // Offscreen placeholder layers are sized to the canvas.
      for (const state of states) {
        state.renderer = null;
      }
    };

    const startLoading = (state: SceneState) => {
      const entry = manifest[state.id];

      if (!entry || state.frames) {
        return;
      }

      const sequence = pickSequence(entry, narrow.matches);

      const set: FrameSet = {
        pattern: sequence.pattern,
        pad: entry.pad,
        count: sequence.frames,
        images: new Array(sequence.frames).fill(null),
        loaded: new Array(sequence.frames).fill(false),
        failed: false,
        queue: loadOrder(sequence.frames),
      };

      state.frames = set;

      const next = () => {
        const index = set.queue.shift();

        if (index === undefined || set.failed) {
          return;
        }

        const image = new Image();

        image.decoding = "async";

        image.onload = () => {
          set.images[index] = image;
          set.loaded[index] = true;

          next();
        };

        image.onerror = () => {
          // No poster frame means there is no usable sequence.
          if (index === 0) {
            set.failed = true;
            set.queue.length = 0;

            return;
          }

          next();
        };

        image.src = framePath(set.pattern, index, set.pad);
      };

      for (let worker = 0; worker < CONCURRENT_LOADS; worker++) {
        next();
      }
    };

    const drawPlaceholder = (
      state: SceneState,
      progress: number,
      time: number,
    ) => {
      if (!state.renderer) {
        state.renderer = new CityRenderer(state.id, width, height, palette);
      }

      state.renderer.draw(context, progress, time);
    };

    /**
     * Darkens the side where the text sits so copy stays readable over
     * bright art. Landscape: left side. Portrait: the whole frame, a
     * little more toward the top where the headline is.
     */
    const drawScrim = () => {
      const base = parseColor(palette.void, [5, 6, 8]);

      const portrait = width < height;

      const gradient = portrait
        ? context.createLinearGradient(0, 0, 0, height)
        : context.createLinearGradient(0, 0, width * 0.6, 0);

      gradient.addColorStop(0, rgba(base, portrait ? 0.72 : 0.8));
      gradient.addColorStop(1, rgba(base, portrait ? 0.35 : 0));

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    /** Returns false when the scene has no frame to show yet. */
    const drawFrames = (state: SceneState, progress: number): boolean => {
      const set = state.frames;

      if (!set || set.failed) {
        return false;
      }

      const found = nearestLoaded(set.loaded, frameIndex(progress, set.count));

      const image = found === null ? null : set.images[found];

      if (!image) {
        return false;
      }

      const entry = manifest[state.id];

      const rect = coverRect(
        image.naturalWidth,
        image.naturalHeight,
        width,
        height,
        entry?.focal ?? [0.5, 0.5],
        pushZoom(progress, entry?.push ?? 1),
      );

      context.drawImage(image, rect.x, rect.y, rect.width, rect.height);

      drawScrim();

      return true;
    };

    let mode = "";
    let active = "";

    const tick = (now: number) => {
      if (!running) {
        return;
      }

      const viewport = window.innerHeight;

      const weights = states.map((state) => {
        if (!state.element) {
          state.element = document.getElementById(state.id);
        }

        const element = state.element;

        if (!element) {
          return 0;
        }

        const rect = element.getBoundingClientRect();

        // Start fetching frames once the scene is within two screens.
        if (rect.top < viewport * 2 && rect.bottom > -viewport) {
          startLoading(state);
        }

        const target = reducedMotion
          ? 0
          : sceneProgress(rect.top, rect.height, viewport);

        state.progress = reducedMotion
          ? 0
          : state.progress + (target - state.progress) * SMOOTHING;

        return visibleFraction(rect.top, rect.height, viewport);
      });

      const plan = dissolvePlan(weights);

      context.globalAlpha = 1;
      context.fillStyle = palette.void;
      context.fillRect(0, 0, width, height);

      let dominantMode = "placeholder";

      plan.forEach(({ index, alpha }, order) => {
        const state = states[index];

        context.globalAlpha = alpha;

        const usedFrames = drawFrames(state, state.progress);

        if (!usedFrames) {
          drawPlaceholder(state, state.progress, now / 1000);
        } else if (order === 0) {
          dominantMode = "frames";
        }

        if (order === 0) {
          active = state.id;
        }
      });

      context.globalAlpha = 1;

      if (mode !== dominantMode) {
        mode = dominantMode;
        canvas.dataset.mode = mode;
      }

      if (canvas.dataset.scene !== active) {
        canvas.dataset.scene = active;
      }

      animation = window.requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      running = document.visibilityState === "visible";

      if (running) {
        animation = window.requestAnimationFrame(tick);
      }
    };

    const handleNarrowChange = () => {
      // Switch between desktop and mobile sequences.
      for (const state of states) {
        if (state.frames) {
          state.frames.failed = true;
          state.frames = null;
        }
      }
    };

    resize();

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    narrow.addEventListener("change", handleNarrowChange);

    animation = window.requestAnimationFrame(tick);

    return () => {
      running = false;

      window.cancelAnimationFrame(animation);

      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      narrow.removeEventListener("change", handleNarrowChange);
    };
  }, [scenes, manifest, palette]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-svh w-screen"
    />
  );
}
