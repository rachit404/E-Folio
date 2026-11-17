import { describe, expect, it } from "vitest";

import { PortfolioSchema } from "@/content/schema/portfolio";
import { SAMPLE_TEX } from "@/content/parser/__fixtures__/sample";
import { parseDocument } from "@/content/parser/parser";

import { buildJourney, windowAround } from "./journey";

const portfolio = PortfolioSchema.parse(parseDocument(SAMPLE_TEX, "s.tex"));

describe("buildJourney", () => {
  const steps = buildJourney(portfolio);

  it("groups education into the first step", () => {
    expect(steps[0]).toMatchObject({
      key: "education",
      number: "01",
      title: "Education",
    });

    expect(steps[0].lines).toEqual([
      "BTech in Computer Science & Engineering, Example University",
      "HSC Board, Example High School",
    ]);
  });

  it("follows with each job and marks the newest as current", () => {
    expect(steps).toHaveLength(2);
    expect(steps[1]).toMatchObject({
      title: "Acme Corp",
      subtitle: "Frontend Intern",
      number: "02",
      current: true,
    });

    expect(steps[0].current).toBe(false);
  });

  it("orders jobs oldest first", () => {
    const base = portfolio.sections.find((s) => s.heading.startsWith("Prof"))!;

    const two = {
      ...portfolio,
      sections: portfolio.sections.map((section) =>
        section === base
          ? {
              ...section,
              items: [
                { organization: "New Co", secondary: "", role: "Dev", dates: "2025", details: [] },
                { organization: "Old Co", secondary: "", role: "Dev", dates: "2023", details: [] },
              ],
            }
          : section,
      ),
    };

    expect(buildJourney(two).map((s) => s.title)).toEqual([
      "Education",
      "Old Co",
      "New Co",
    ]);
  });

  it("returns no steps for an empty resume", () => {
    expect(buildJourney({ ...portfolio, sections: [] })).toEqual([]);
  });
});

describe("windowAround", () => {
  it("returns every index when there are few items", () => {
    expect(windowAround(3, 1, 4)).toEqual([0, 1, 2]);
    expect(windowAround(0, 0, 4)).toEqual([]);
  });

  it("centres the focus and clamps at both ends", () => {
    expect(windowAround(9, 4, 4)).toEqual([2, 3, 4, 5]);
    expect(windowAround(9, 0, 4)).toEqual([0, 1, 2, 3]);
    expect(windowAround(9, 8, 4)).toEqual([5, 6, 7, 8]);
  });
});
