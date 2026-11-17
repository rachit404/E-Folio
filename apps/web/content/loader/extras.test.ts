import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  applyExtras,
  hasResumePdf,
  listResumePdfs,
  loadSiteExtras,
  readResumePdf,
} from "./extras";

let root: string;
let resumes: string;

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "efolio-extras-"));
  resumes = path.join(root, "resumes");

  await fs.mkdir(resumes);

  process.env.PORTFOLIO_CONTENT_DIR = resumes;
});

afterEach(async () => {
  delete process.env.PORTFOLIO_CONTENT_DIR;

  await fs.rm(root, { recursive: true, force: true });
});

describe("resume PDFs", () => {
  it("finds none when no PDF exists", async () => {
    await fs.writeFile(path.join(resumes, "sde.tex"), "x");

    await expect(listResumePdfs()).resolves.toEqual([]);
    await expect(hasResumePdf("sde")).resolves.toBe(false);
    await expect(readResumePdf("sde")).resolves.toBeNull();
  });

  it("lists and reads PDFs case-insensitively", async () => {
    await fs.writeFile(path.join(resumes, "SDE.pdf"), "pdf-bytes");

    await expect(listResumePdfs()).resolves.toEqual(["sde"]);
    await expect(hasResumePdf("SDE")).resolves.toBe(true);

    const pdf = await readResumePdf("sde");

    expect(pdf?.toString()).toBe("pdf-bytes");
  });

  it("refuses unsafe role names", async () => {
    await expect(hasResumePdf("../secret")).resolves.toBe(false);
    await expect(readResumePdf("../secret")).resolves.toBeNull();
  });

  it("returns an empty list when the folder is missing", async () => {
    process.env.PORTFOLIO_CONTENT_DIR = path.join(root, "nope");

    await expect(listResumePdfs()).resolves.toEqual([]);
  });
});

describe("loadSiteExtras", () => {
  it("is empty when there is no site folder", async () => {
    await expect(loadSiteExtras("sde")).resolves.toEqual({ copy: {} });
  });

  it("overlays the role file on the default file", async () => {
    const site = path.join(root, "site");

    await fs.mkdir(site);

    await fs.writeFile(
      path.join(site, "default.json"),
      JSON.stringify({ copy: { intro: "Default intro", greeting: "Hi" } }),
    );

    await fs.writeFile(
      path.join(site, "sde.json"),
      JSON.stringify({ copy: { intro: "SDE intro" } }),
    );

    await expect(loadSiteExtras("sde")).resolves.toEqual({
      copy: { intro: "SDE intro", greeting: "Hi" },
    });

    await expect(loadSiteExtras("ai")).resolves.toEqual({
      copy: { intro: "Default intro", greeting: "Hi" },
    });
  });

  it("rejects an invalid file instead of ignoring it silently", async () => {
    const site = path.join(root, "site");

    await fs.mkdir(site);

    await fs.writeFile(
      path.join(site, "default.json"),
      JSON.stringify({ copy: { roles: "not-an-array" } }),
    );

    await expect(loadSiteExtras("sde")).rejects.toThrow();
  });
});

describe("applyExtras", () => {
  it("overrides only the given fields", () => {
    expect(applyExtras({ a: 1, b: 2 }, { copy: { b: 3 } as never })).toEqual({
      a: 1,
      b: 3,
    });

    expect(applyExtras({ a: 1 }, {})).toEqual({ a: 1 });
  });
});
