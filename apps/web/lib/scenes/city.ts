/**
 * Procedural night-city placeholder for scenes that have no frame
 * sequence yet. Real art replaces it by adding frames and a manifest
 * entry; nothing else changes.
 *
 * Pure parts (rng, skyline, colours) are unit tested. CityRenderer
 * needs a canvas and only runs in the browser.
 */

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

// -----------------------------------------------------------------
// Colours
// -----------------------------------------------------------------

export type Rgb = readonly [number, number, number];

/** Parses #rgb / #rrggbb. Anything else (css vars, names) -> fallback. */
export function parseColor(value: string, fallback: Rgb): Rgb {
  const hex = value.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  return fallback;
}

export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function rgba(color: Rgb, alpha: number = 1): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

// -----------------------------------------------------------------
// Skyline
// -----------------------------------------------------------------

export interface Building {
  /** 0..1 across the layer. */
  x: number;
  width: number;
  /** Fraction of the layer height. */
  height: number;
  cols: number;
  rows: number;
  /** cols * rows flags: is this window lit. */
  lit: boolean[];
  /** 0 = primary glow, 1 = accent glow. */
  hue: (0 | 1)[];
  antenna: boolean;
}

export function buildSkyline(
  seed: number,
  minHeight: number,
  maxHeight: number,
  litChance: number,
): Building[] {
  const rng = mulberry32(seed);

  const buildings: Building[] = [];

  let x = 0;

  while (x < 1) {
    const width = 0.025 + rng() * 0.05;

    const height = minHeight + rng() * (maxHeight - minHeight);

    const cols = Math.max(2, Math.round(width * 120));
    const rows = Math.max(3, Math.round(height * 40));

    const lit: boolean[] = [];
    const hue: (0 | 1)[] = [];

    for (let index = 0; index < cols * rows; index++) {
      lit.push(rng() < litChance);
      hue.push(rng() < 0.7 ? 0 : 1);
    }

    buildings.push({
      x,
      width,
      height,
      cols,
      rows,
      lit,
      hue,
      antenna: rng() < 0.18,
    });

    x += width * (rng() < 0.3 ? 1.05 : 0.98);
  }

  return buildings;
}

// -----------------------------------------------------------------
// Renderer (browser only)
// -----------------------------------------------------------------

export interface CityPalette {
  void: string;
  primary: string;
  accent: string;
}

interface SceneLook {
  seed: number;
  /** Horizon line as a fraction of the viewport height. */
  horizon: number;
  /** Total push-in over the scene (1 = none). */
  zoom: number;
  /** Horizontal parallax strength. */
  drift: number;
  feature: "moon" | "road" | "core" | "crystal" | "sun" | "none";
}

const LOOKS: Record<string, SceneLook> = {
  home: { seed: 11, horizon: 0.7, zoom: 1.18, drift: 0.05, feature: "moon" },
  about: { seed: 23, horizon: 0.72, zoom: 1.08, drift: 0.12, feature: "moon" },
  experience: {
    seed: 37,
    horizon: 0.62,
    zoom: 1.25,
    drift: 0.03,
    feature: "road",
  },
  projects: { seed: 41, horizon: 0.7, zoom: 1.14, drift: 0.04, feature: "core" },
  skills: { seed: 53, horizon: 0.7, zoom: 1.0, drift: 0.06, feature: "crystal" },
  contact: { seed: 67, horizon: 0.74, zoom: 1.1, drift: 0.04, feature: "sun" },
};

const DEFAULT_LOOK: SceneLook = {
  seed: 5,
  horizon: 0.7,
  zoom: 1.1,
  drift: 0.05,
  feature: "none",
};

const VOID: Rgb = [5, 6, 8];
const CYAN: Rgb = [0, 229, 255];
const RED: Rgb = [255, 33, 71];

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  return canvas;
}

export class CityRenderer {
  private readonly width: number;
  private readonly height: number;
  private readonly look: SceneLook;
  private readonly primary: Rgb;
  private readonly accent: Rgb;
  private readonly base: Rgb;

  private readonly sky: HTMLCanvasElement;
  private readonly layers: HTMLCanvasElement[];

  constructor(
    sceneId: string,
    width: number,
    height: number,
    palette: CityPalette,
  ) {
    this.width = width;
    this.height = height;
    this.look = LOOKS[sceneId] ?? {
      ...DEFAULT_LOOK,
      seed: hashString(sceneId) % 1000,
    };

    this.base = parseColor(palette.void, VOID);
    this.primary = parseColor(palette.primary, CYAN);
    this.accent = parseColor(palette.accent, RED);

    this.sky = this.renderSky();

    this.layers = [
      this.renderLayer(0, 0.18, 0.5, 0.05, 0.06),
      this.renderLayer(1, 0.24, 0.62, 0.08, 0.16),
      this.renderLayer(2, 0.3, 0.78, 0.0, 0.3),
    ];
  }

  private renderSky(): HTMLCanvasElement {
    const canvas = makeCanvas(this.width, this.height);
    const context = canvas.getContext("2d");

    if (!context) {
      return canvas;
    }

    const horizon = this.look.horizon * this.height;

    const gradient = context.createLinearGradient(0, 0, 0, horizon);

    gradient.addColorStop(0, rgba(this.base));
    gradient.addColorStop(0.55, rgba(mix(this.base, this.primary, 0.12)));
    gradient.addColorStop(1, rgba(mix(this.base, this.accent, 0.38)));

    context.fillStyle = gradient;
    context.fillRect(0, 0, this.width, this.height);

    const rng = mulberry32(this.look.seed * 7);

    for (let index = 0; index < 90; index++) {
      context.fillStyle = rgba([255, 255, 255], 0.15 + rng() * 0.5);

      context.fillRect(
        rng() * this.width,
        rng() * horizon * 0.7,
        1 + rng() * 1.2,
        1 + rng() * 1.2,
      );
    }

    return canvas;
  }

  /** One parallax layer, 1.5x as wide as the viewport so it can drift. */
  private renderLayer(
    layer: number,
    minHeight: number,
    maxHeight: number,
    tint: number,
    litChance: number,
  ): HTMLCanvasElement {
    const span = this.width * 1.5;

    const canvas = makeCanvas(span, this.height);
    const context = canvas.getContext("2d");

    if (!context) {
      return canvas;
    }

    const horizon = this.look.horizon * this.height;

    const buildings = buildSkyline(
      this.look.seed * 31 + layer,
      minHeight,
      maxHeight,
      litChance,
    );

    const body = mix(this.base, this.primary, tint);

    for (const building of buildings) {
      const x = building.x * span;
      const w = building.width * span;
      const h = building.height * (this.height * 0.8);
      const top = horizon - h + layer * this.height * 0.04;

      context.fillStyle = rgba(body);
      context.fillRect(x, top, w, this.height - top);

      if (building.antenna) {
        context.fillRect(x + w / 2 - 1, top - h * 0.18, 2, h * 0.18);
      }

      if (layer > 0) {
        context.fillStyle = rgba(
          mix(body, building.hue[0] ? this.accent : this.primary, 0.5),
          0.5,
        );

        context.fillRect(x, top, w, 1.5);
      }

      const cell = {
        w: (w * 0.8) / building.cols,
        h: (h * 0.82) / building.rows,
      };

      for (let row = 0; row < building.rows; row++) {
        for (let col = 0; col < building.cols; col++) {
          const index = row * building.cols + col;

          if (!building.lit[index]) {
            continue;
          }

          context.fillStyle = rgba(
            building.hue[index] ? this.accent : this.primary,
            0.35 + layer * 0.2,
          );

          context.fillRect(
            x + w * 0.1 + col * cell.w,
            top + h * 0.06 + row * cell.h,
            Math.max(1, cell.w * 0.5),
            Math.max(1, cell.h * 0.45),
          );
        }
      }
    }

    // Haze between layers.
    const haze = context.createLinearGradient(0, horizon - h2(this.height), 0, horizon + 40);

    haze.addColorStop(0, rgba(mix(this.base, this.accent, 0.3), 0));
    haze.addColorStop(1, rgba(mix(this.base, this.accent, 0.3), 0.18 - layer * 0.04));

    context.fillStyle = haze;
    context.fillRect(0, horizon - h2(this.height), span, this.height);

    return canvas;
  }

  /** Draw the scene at scroll progress 0..1 into a width x height box. */
  draw(
    context: CanvasRenderingContext2D,
    progress: number,
    time: number,
  ): void {
    const { width, height, look } = this;

    context.fillStyle = rgba(this.base);
    context.fillRect(0, 0, width, height);

    const eased = progress * progress * (3 - 2 * progress);

    const zoom = 1 + (look.zoom - 1) * eased;

    context.save();

    // Push in around the horizon centre.
    context.translate(width / 2, look.horizon * height);
    context.scale(zoom, zoom);
    context.translate(-width / 2, -look.horizon * height);

    context.drawImage(this.sky, 0, 0);

    this.drawFeature(context, progress, time, "back");

    const speeds = [0.3, 0.6, 1];

    this.layers.forEach((layer, index) => {
      const slack = layer.width - width;

      const offset = -slack / 2 + (progress - 0.5) * slack * look.drift * 6 * speeds[index];

      context.drawImage(layer, offset, 0);
    });

    this.drawFeature(context, progress, time, "front");

    context.restore();

    // Vignette keeps the text column readable.
    const vignette = context.createLinearGradient(0, 0, width * 0.55, 0);

    vignette.addColorStop(0, rgba(this.base, 0.82));
    vignette.addColorStop(1, rgba(this.base, 0));

    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);
  }

  private drawFeature(
    context: CanvasRenderingContext2D,
    progress: number,
    time: number,
    pass: "back" | "front",
  ): void {
    const { width, height, look } = this;

    const horizon = look.horizon * height;

    if (pass === "back" && (look.feature === "moon" || look.feature === "sun")) {
      const sun = look.feature === "sun";

      const radius = (sun ? 0.16 : 0.07) * height;

      const cx = width * (sun ? 0.7 : 0.74);
      const cy = sun ? horizon - radius * 0.6 : height * 0.2;

      const glow = context.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 4);

      glow.addColorStop(0, rgba(sun ? this.accent : [235, 240, 255], 0.5));
      glow.addColorStop(1, rgba(this.base, 0));

      context.fillStyle = glow;
      context.fillRect(cx - radius * 4, cy - radius * 4, radius * 8, radius * 8);

      context.fillStyle = rgba(sun ? this.accent : [235, 240, 255], 0.92);
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fill();
    }

    if (pass === "front" && look.feature === "core") {
      const cx = width * 0.66;
      const pulse = 0.6 + 0.4 * Math.sin(time * 1.6);

      const beam = context.createLinearGradient(cx - 60, 0, cx + 60, 0);

      beam.addColorStop(0, rgba(this.accent, 0));
      beam.addColorStop(0.5, rgba(this.accent, 0.4 * pulse));
      beam.addColorStop(1, rgba(this.accent, 0));

      context.fillStyle = beam;
      context.fillRect(cx - 60, height * 0.12, 120, horizon - height * 0.12);

      context.strokeStyle = rgba(this.primary, 0.5);
      context.lineWidth = 2;

      for (let ring = 0; ring < 3; ring++) {
        context.beginPath();
        context.ellipse(cx, horizon + 10, 90 + ring * 46, 18 + ring * 9, 0, 0, Math.PI * 2);
        context.stroke();
      }
    }

    if (pass === "front" && look.feature === "crystal") {
      const cx = width * 0.66;
      const cy = height * 0.46;
      const radius = height * 0.2;
      const turn = progress * Math.PI * 2 + time * 0.2;

      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.4);

      glow.addColorStop(0, rgba(this.accent, 0.45));
      glow.addColorStop(0.5, rgba(this.primary, 0.12));
      glow.addColorStop(1, rgba(this.base, 0));

      context.fillStyle = glow;
      context.fillRect(cx - radius * 2.4, cy - radius * 2.4, radius * 4.8, radius * 4.8);

      context.strokeStyle = rgba(this.primary, 0.75);
      context.fillStyle = rgba(this.accent, 0.12);
      context.lineWidth = 1.5;

      for (let facet = 0; facet < 6; facet++) {
        const a = turn + (facet / 6) * Math.PI * 2;
        const b = turn + ((facet + 1) / 6) * Math.PI * 2;

        context.beginPath();
        context.moveTo(cx, cy - radius * 1.1);
        context.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * 0.45);
        context.lineTo(cx + Math.cos(b) * radius, cy + Math.sin(b) * radius * 0.45);
        context.closePath();
        context.fill();
        context.stroke();
      }
    }

    if (pass === "front" && look.feature === "road") {
      const vx = width * 0.55;
      const vy = horizon;

      const road = context.createLinearGradient(0, vy, 0, height);

      road.addColorStop(0, rgba(mix(this.base, this.accent, 0.35), 0.5));
      road.addColorStop(1, rgba(this.base, 0.92));

      context.fillStyle = road;
      context.beginPath();
      context.moveTo(vx - 6, vy);
      context.lineTo(vx + 6, vy);
      context.lineTo(width * 0.95, height);
      context.lineTo(width * 0.05, height);
      context.closePath();
      context.fill();

      // Dashes streaming toward the camera as the page scrolls.
      context.strokeStyle = rgba(this.accent, 0.85);
      context.lineWidth = 3;

      for (let dash = 0; dash < 9; dash++) {
        const t = (dash / 9 + progress * 2.2) % 1;
        const depth = t * t;

        const y = vy + (height - vy) * depth;
        const len = 6 + 60 * depth;

        context.beginPath();
        context.moveTo(vx + (width * 0.45 - vx) * 0, y);
        context.lineTo(vx, y + len);
        context.stroke();
      }
    }
  }
}

function h2(height: number): number {
  return height * 0.12;
}
