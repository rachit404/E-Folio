import { describe, expect, it } from "vitest";

import { PortfolioSchema } from "../schema/portfolio";

import { SAMPLE_TEX } from "./__fixtures__/sample";
import { parseDocument } from "./parser";

const parsed = parseDocument(SAMPLE_TEX, "sample.tex");

function section(heading: string) {
  const found = parsed.sections.find((entry) => entry.heading === heading);

  if (!found) {
    throw new Error(`Section "${heading}" was not parsed.`);
  }

  return found;
}

describe("parseDocument", () => {
  it("records the source file and schema version", () => {
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.source.file).toBe("sample.tex");
  });

  it("produces output that satisfies the portfolio schema", () => {
    expect(() => PortfolioSchema.parse(parsed)).not.toThrow();
  });

  it("rejects invalid input", () => {
    expect(() => parseDocument("", "  ")).toThrow();
    expect(() => parseDocument(42 as unknown as string, "x.tex")).toThrow();
  });

  it("finds every section with a clean heading", () => {
    expect(parsed.sections.map((entry) => entry.heading)).toEqual([
      "Education",
      "Professional Experience",
      "Personal Projects",
      "Technical Skills",
      "Courses And Certificates",
    ]);
  });

  it("classifies sections by structure", () => {
    expect(parsed.sections.map((entry) => entry.kind)).toEqual([
      "timeline",
      "timeline",
      "projects",
      "skills",
      "content",
    ]);
  });
});

describe("metadata", () => {
  it("reads \\newcommand values", () => {
    expect(parsed.metadata).toMatchObject({
      name: "Jane Example",
      course: "Computer Science",
      phone: "5550100",
      email: "jane@example.com",
    });
  });

  it("keeps only profile links, with stable keys", () => {
    expect(parsed.metadata.links).toEqual({
      github: "https://github.com/janeexample",
      linkedin: "https://www.linkedin.com/in/jane-example/",
      portfolio: "https://jane.example.dev/",
    });
  });

  it("does not leak mailto, project repository or commented links", () => {
    const urls = Object.values(parsed.metadata.links);

    expect(urls.some((url) => url.startsWith("mailto:"))).toBe(false);
    expect(urls.some((url) => url.includes("/alpha"))).toBe(false);
    expect(urls.some((url) => url.includes("commented-out"))).toBe(false);
  });
});

describe("timeline sections", () => {
  it("maps \\resumeSubheading arguments to fields", () => {
    const [first, second] = section("Education").items;

    expect(first).toEqual({
      organization: "Example University",
      secondary: "CGPA: 9.0",
      role: "BTech in Computer Science & Engineering",
      dates: "2022-Present",
      details: [],
    });

    expect(second).toMatchObject({
      organization: "Example High School",
      dates: "2022",
    });
  });

  it("attaches bullet details to the entry and strips formatting", () => {
    const [entry] = section("Professional Experience").items as Array<{
      organization: string;
      details: string[];
    }>;

    expect(entry.organization).toBe("Acme Corp");

    expect(entry.details).toEqual([
      "Built pixel-perfect UI from designs.",
      "Integrated APIs with Axios.",
    ]);
  });
});

describe("project sections", () => {
  const projects = section("Personal Projects").items as Array<{
    name: string;
    description: string;
    details: string[];
    links: Array<{ label: string; url: string }>;
  }>;

  it("ignores commented-out projects", () => {
    expect(projects.map((project) => project.name)).toEqual(["Alpha", "Beta"]);
  });

  it("extracts description, details and repository links", () => {
    expect(projects[0].description).toBe(
      "A recommendation platform for testing.",
    );

    expect(projects[0].details).toEqual([
      "Used TF-IDF with cosine similarity.",
      "Exposed a Flask REST API.",
    ]);

    expect(projects[0].links).toEqual([
      { label: "repository", url: "https://github.com/janeexample/alpha" },
    ]);
  });
});

describe("skills and certificates", () => {
  it("splits skill rows into one record per skill", () => {
    const skills = section("Technical Skills").items;

    expect(skills).toEqual([
      { name: "Java", description: "Languages" },
      { name: "Python", description: "Languages" },
      { name: "C", description: "Languages" },
      { name: "React.js", description: "Frameworks" },
      { name: "Flask", description: "Frameworks" },
    ]);
  });

  it("joins wrapped lines and skips commented certificates", () => {
    expect(section("Courses And Certificates").items).toEqual([
      { text: "ExampleLearn: Machine Learning Specialization" },
      { text: "Example Cloud : Cloud Foundations" },
    ]);
  });
});
