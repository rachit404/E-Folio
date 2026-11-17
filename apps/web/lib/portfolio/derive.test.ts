import { describe, expect, it } from "vitest";

import { PortfolioSchema } from "@/content/schema/portfolio";
import { SAMPLE_TEX } from "@/content/parser/__fixtures__/sample";
import { parseDocument } from "@/content/parser/parser";

import {
  countFacts,
  educationEntries,
  educationSentence,
  experienceEntries,
  projectEntries,
  projectsUsing,
} from "./derive";

const portfolio = PortfolioSchema.parse(parseDocument(SAMPLE_TEX, "s.tex"));

describe("education and experience", () => {
  it("separates education from work by section heading", () => {
    expect(educationEntries(portfolio).map((e) => e.organization)).toEqual([
      "Example University",
      "Example High School",
    ]);

    expect(experienceEntries(portfolio).map((e) => e.organization)).toEqual([
      "Acme Corp",
    ]);
  });

  it("describes ongoing studies from the first education entry", () => {
    expect(educationSentence(portfolio)).toBe(
      "Currently pursuing BTech in Computer Science & Engineering at Example University.",
    );
  });

  it("uses the past tense for finished studies", () => {
    const finished = {
      ...portfolio,
      sections: portfolio.sections.map((section) =>
        section.heading === "Education"
          ? {
              ...section,
              items: [
                {
                  organization: "Old School",
                  secondary: "",
                  role: "HSC Board",
                  dates: "2020",
                  details: [],
                },
              ],
            }
          : section,
      ),
    };

    expect(educationSentence(finished)).toBe("Studied HSC Board at Old School.");
  });

  it("returns null without an education section", () => {
    expect(
      educationSentence({ ...portfolio, sections: portfolio.sections.slice(1) }),
    ).toBeNull();
  });
});

describe("projectEntries / countFacts", () => {
  it("collects projects with their details and links", () => {
    const projects = projectEntries(portfolio);

    expect(projects.map((p) => p.name)).toEqual(["Alpha", "Beta"]);
    expect(projects[0].links[0].url).toContain("alpha");
  });

  it("counts everything from the parsed data", () => {
    expect(countFacts(portfolio)).toEqual({
      roles: 1,
      projects: 2,
      skills: 5,
      records: 2,
    });
  });
});

describe("projectsUsing", () => {
  const projects = projectEntries(portfolio);

  it("finds projects whose text mentions the skill", () => {
    expect(projectsUsing("Flask", projects)).toEqual(["Alpha"]);
    expect(projectsUsing("socket.io", projects)).toEqual(["Beta"]);
  });

  it("matches whole words only, case-insensitively", () => {
    expect(projectsUsing("TF-IDF", projects)).toEqual(["Alpha"]);
    expect(projectsUsing("flas", projects)).toEqual([]);
  });

  it("treats React.js as react", () => {
    const custom = [
      { name: "P", description: "Built with React.", metadata: { primary: "", secondary: "" }, details: [], links: [] },
    ];

    expect(projectsUsing("React.js", custom)).toEqual(["P"]);
  });

  it("never matches one-letter skills", () => {
    expect(projectsUsing("C", projects)).toEqual([]);
  });
});
