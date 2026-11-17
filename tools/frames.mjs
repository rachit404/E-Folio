#!/usr/bin/env node
/**
 * Turn generated clips or stills into scroll-scrubbed frame sequences.
 *
 *   node tools/frames.mjs                     # every file in art/source
 *   node tools/frames.mjs --only 01_home.mp4  # one file
 *   node tools/frames.mjs --preset hulk       # write manifest to another preset
 *
 * Input files are named NN_scene.ext (01_home.mp4, 03_experience.mov,
 * 07_404.png, ...). Videos become 90-180 frames; a still becomes one
 * frame plus a slow push-in. Output:
 *
 *   apps/web/public/assets/scenes/<scene>/0001.webp ...        (desktop, 1280 wide)
 *   apps/web/public/assets/scenes/<scene>/m/0001.webp ...      (mobile, 720 wide)
 *
 * and the matching `scenes.<scene>` entry in apps/web/public/assets/theme.json.
 * Requires ffmpeg and ffprobe on PATH. Node only, no other dependencies.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".mkv"]);
const STILL = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const SCENES = {
  home: "home",
  about: "about",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  contact: "contact",
  404: "404",
};

function parseArgs(argv) {
  const options = {
    input: path.join(root, "art", "source"),
    output: path.join(root, "apps", "web", "public", "assets", "scenes"),
    theme: path.join(root, "apps", "web", "public", "assets", "theme.json"),
    preset: null,
    only: null,
    minFrames: 90,
    maxFrames: 180,
    quality: 72,
    width: 1280,
    mobileWidth: 720,
    focal: null,
  };

  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    const value = argv[index + 1];

    const take = (key, transform = (v) => v) => {
      if (value === undefined) fail(`${flag} needs a value`);
      options[key] = transform(value);
      index++;
    };

    if (flag === "--in") take("input", path.resolve);
    else if (flag === "--out") take("output", path.resolve);
    else if (flag === "--theme") take("theme", path.resolve);
    else if (flag === "--preset") take("preset");
    else if (flag === "--only") take("only");
    else if (flag === "--min-frames") take("minFrames", Number);
    else if (flag === "--max-frames") take("maxFrames", Number);
    else if (flag === "--quality") take("quality", Number);
    else if (flag === "--width") take("width", Number);
    else if (flag === "--mobile-width") take("mobileWidth", Number);
    else if (flag === "--focal") take("focal", (v) => v.split(",").map(Number));
    else if (flag === "--help" || flag === "-h") {
      console.log("See the header of tools/frames.mjs for usage.");
      process.exit(0);
    } else fail(`Unknown option: ${flag}`);
  }

  return options;
}

function fail(message) {
  console.error(`frames: ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });

  if (result.error) {
    fail(`could not run ${command}: ${result.error.message}. Is it installed and on PATH?`);
  }

  if (result.status !== 0) {
    fail(`${command} failed:\n${(result.stderr || "").split("\n").slice(-8).join("\n")}`);
  }

  return result.stdout;
}

/** "03_experience.mp4" -> { order: 3, scene: "experience" } or null. */
export function parseSourceName(file) {
  const match = /^(\d+)[_-]([a-z0-9]+)\.[a-z0-9]+$/i.exec(file);

  if (!match) return null;

  const scene = SCENES[match[2].toLowerCase()];

  return scene ? { order: Number(match[1]), scene } : null;
}

/** Frames for a clip: about 24 per second, kept within [min, max]. */
export function frameCount(durationSeconds, min, max) {
  return Math.min(max, Math.max(min, Math.round(durationSeconds * 24)));
}

function duration(file) {
  const out = run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ]);

  const seconds = Number.parseFloat(out);

  if (!Number.isFinite(seconds) || seconds <= 0) fail(`cannot read duration of ${file}`);

  return seconds;
}

function clearDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function extract(file, outDir, { width, fps, quality, single }) {
  const filters = [];

  if (!single) filters.push(`fps=${fps}`);

  // Even height, never upscale.
  filters.push(`scale='min(${width},iw)':-2`);

  const args = [
    "-y", "-v", "error",
    "-i", file,
    "-vf", filters.join(","),
    "-c:v", "libwebp",
    "-quality", String(quality),
    "-compression_level", "4",
  ];

  if (single) args.push("-frames:v", "1");

  args.push(path.join(outDir, "%04d.webp"));

  run("ffmpeg", args);

  return fs.readdirSync(outDir).filter((name) => name.endsWith(".webp")).length;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.input)) {
    fail(`input folder not found: ${options.input}`);
  }

  const files = fs
    .readdirSync(options.input)
    .filter((name) => !options.only || name === options.only)
    .map((name) => ({ name, ext: path.extname(name).toLowerCase(), info: parseSourceName(name) }))
    .filter((entry) => entry.info && (VIDEO.has(entry.ext) || STILL.has(entry.ext)))
    .sort((a, b) => a.info.order - b.info.order);

  if (!files.length) {
    console.log(`frames: nothing to do. Put files like 01_home.mp4 in ${options.input}`);
    return;
  }

  const theme = JSON.parse(fs.readFileSync(options.theme, "utf8"));

  const preset = options.preset ?? theme.default;

  if (!theme.presets?.[preset]) fail(`preset "${preset}" not found in ${options.theme}`);

  theme.presets[preset].scenes ??= {};

  for (const { name, ext, info } of files) {
    const source = path.join(options.input, name);
    const sceneDir = path.join(options.output, info.scene);
    const mobileDir = path.join(sceneDir, "m");

    const still = STILL.has(ext);

    const seconds = still ? 0 : duration(source);

    const target = still ? 1 : frameCount(seconds, options.minFrames, options.maxFrames);

    const fps = still ? 0 : (target / seconds).toFixed(4);

    console.log(`frames: ${name} -> ${info.scene} (${still ? "still" : `${seconds.toFixed(1)}s, ~${target} frames`})`);

    clearDir(sceneDir);
    fs.mkdirSync(mobileDir, { recursive: true });

    const rest = path.join(sceneDir);

    // Desktop first; mobile frames live in the "m" subfolder.
    const desktopFrames = extract(source, rest, { width: options.width, fps, quality: options.quality, single: still });
    // A still that is not downscaled for mobile would be an identical copy.
    const sameAsDesktop = still && options.mobileWidth >= options.width;

    const mobileFrames = sameAsDesktop
      ? 0
      : extract(source, mobileDir, { width: options.mobileWidth, fps, quality: options.quality, single: still });

    if (sameAsDesktop) fs.rmSync(mobileDir, { recursive: true, force: true });

    const entry = {
      frames: desktopFrames,
      pattern: `/assets/scenes/${info.scene}/{n}.webp`,
      ...(mobileFrames > 0
        ? { mobilePattern: `/assets/scenes/${info.scene}/m/{n}.webp`, mobileFrames }
        : {}),
      pad: 4,
      focal: options.focal ?? theme.presets[preset].scenes[info.scene]?.focal ?? [0.62, 0.5],
      push: still ? 1.12 : 1,
    };

    theme.presets[preset].scenes[info.scene] = entry;

    console.log(`        ${desktopFrames} desktop + ${mobileFrames} mobile frames`);
  }

  fs.writeFileSync(options.theme, JSON.stringify(theme, null, 2) + "\n");

  console.log(`frames: manifest written to ${path.relative(root, options.theme)} (preset "${preset}")`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
