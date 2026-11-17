import { describe, expect, it } from "vitest";

import { PortfolioSchema } from "@/content/schema/portfolio";
import { parseDocument } from "@/content/parser/parser";
import { SAMPLE_TEX } from "@/content/parser/__fixtures__/sample";

import {
  collectCertificates,
  groupSkills,
  splitCertificate,
} from "./skills";

const portfolio = PortfolioSchema.parse(parseDocument(SAMPLE_TEX, "s.tex"));

describe("groupSkills", () => {
  it("groups skills by their row label in resume order", () => {
    expect(groupSkills(portfolio)).toEqual([
      { category: "Languages", skills: ["Java", "Python", "C"] },
      { category: "Frameworks", skills: ["React.js", "Flask"] },
    ]);
  });

  it("returns nothing when there are no skill sections", () => {
    expect(
      groupSkills({ ...portfolio, sections: portfolio.sections.slice(0, 2) }),
    ).toEqual([]);
  });
});

describe("splitCertificate", () => {
  it("splits issuer and title on the first colon", () => {
    expect(splitCertificate("Google Cloud : Cloud: Foundations")).toEqual({
      issuer: "Google Cloud",
      title: "Cloud: Foundations",
    });
  });

  it("keeps text without a colon as the title", () => {
    expect(splitCertificate("Standalone Award")).toEqual({
      issuer: "",
      title: "Standalone Award",
    });
  });
});

describe("collectCertificates", () => {
  it("collects text records from generic sections", () => {
    const [section] = collectCertificates(portfolio);

    expect(section.heading).toBe("Courses And Certificates");

    expect(section.certificates).toEqual([
      {
        issuer: "ExampleLearn",
        title: "Machine Learning Specialization",
      },
      { issuer: "Example Cloud", title: "Cloud Foundations" },
    ]);
  });
});
