import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SAMPLE_TEX } from "../parser/__fixtures__/sample";

import { listProfiles, loadPortfolio } from "./portfolio";

let directory: string;

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "efolio-resumes-"));

  process.env.PORTFOLIO_CONTENT_DIR = directory;
});

afterEach(async () => {
  delete process.env.PORTFOLIO_CONTENT_DIR;

  await fs.rm(directory, { recursive: true, force: true });
});

describe("listProfiles", () => {
  it("discovers every .tex file as a lowercase profile", async () => {
    await fs.writeFile(path.join(directory, "SDE.tex"), SAMPLE_TEX);
    await fs.writeFile(path.join(directory, "main.tex"), SAMPLE_TEX);
    await fs.writeFile(path.join(directory, "notes.txt"), "ignored");

    await expect(listProfiles()).resolves.toEqual(["main", "sde"]);
  });

  it("explains how to fix a missing resume directory", async () => {
    process.env.PORTFOLIO_CONTENT_DIR = path.join(directory, "missing");

    await expect(listProfiles()).rejects.toThrow(/PORTFOLIO_CONTENT_DIR/);
  });

  it("fails clearly when the directory has no resumes", async () => {
    await expect(listProfiles()).rejects.toThrow(/No \.tex resumes/);
  });
});

describe("loadPortfolio", () => {
  it("parses and validates a profile", async () => {
    await fs.writeFile(path.join(directory, "sde.tex"), SAMPLE_TEX);

    const portfolio = await loadPortfolio("SDE");

    expect(portfolio.source.file).toBe("sde.tex");
    expect(portfolio.metadata.name).toBe("Jane Example");
  });

  it("rejects unsafe profile names", async () => {
    await fs.writeFile(path.join(directory, "sde.tex"), SAMPLE_TEX);

    await expect(loadPortfolio("../secret")).rejects.toThrow(/Invalid/);
  });

  it("lists the available profiles for an unknown one", async () => {
    await fs.writeFile(path.join(directory, "sde.tex"), SAMPLE_TEX);

    await expect(loadPortfolio("ghost")).rejects.toThrow(/Available.*sde/);
  });
});
