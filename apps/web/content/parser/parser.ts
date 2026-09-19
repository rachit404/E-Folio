import { stripComments, cleanLatex } from "./cleaner";

import { parseMetadata } from "./metadata";

import {
  extractSections,
  classifySection,
  parseTimelineSection,
  parseProjectSection,
  parseSkillSection,
  parsePositionsSection,
  parseGenericSection,
} from "./sections";

export interface ParsedPortfolio {
  schemaVersion: number;

  source: {
    file: string;
  };

  metadata: {
    name?: string;
    course?: string;
    phone?: string;
    email?: string;
    links: Record<string, string>;
  };

  sections: Array<{
    heading: string;

    kind: "projects" | "skills" | "positions" | "timeline" | "content";

    items: unknown[];
  }>;
}

/**
 * Parse a complete LaTeX resume.
 *
 * Pipeline:
 *
 * .tex
 *   ↓
 * comment removal
 *   ↓
 * metadata extraction
 *   ↓
 * section extraction
 *   ↓
 * structural classification
 *   ↓
 * section-specific parsing
 *   ↓
 * LaTeX cleaning
 *   ↓
 * PortfolioSchema validation in loader
 *
 * The parser intentionally understands the structural
 * conventions used by this portfolio's .tex resumes.
 *
 * It is NOT intended to be a general-purpose LaTeX parser.
 */
export function parseDocument(
  source: string,
  sourceName: string,
): ParsedPortfolio {
  if (typeof source !== "string") {
    throw new TypeError("Portfolio source must be a string.");
  }

  if (!sourceName || !sourceName.trim()) {
    throw new Error("Portfolio source name is required.");
  }

  /*
   * Remove comments before any structural parsing.
   *
   * This prevents commented-out commands such as:
   *
   * % \resumeProject
   *
   * from becoming real portfolio records.
   */
  const sourceWithoutComments = stripComments(source);

  const metadata = parseMetadata(sourceWithoutComments);

  const rawSections = extractSections(sourceWithoutComments);

  const sections = rawSections
    .map((section) => {
      const heading = cleanLatex(section.heading);

      const kind = classifySection(section.body);

      let items: unknown[];

      switch (kind) {
        case "projects":
          items = parseProjectSection(section.body);
          break;

        case "skills":
          items = parseSkillSection(section.body);
          break;

        case "timeline":
          items = parseTimelineSection(section.body);
          break;

        case "positions":
          items = parsePositionsSection(section.body);
          break;

        case "content":
        default:
          items = parseGenericSection(section.body);
          break;
      }

      return {
        heading,
        kind,
        items,
      };
    })
    .filter(
      (section) => section.heading.length > 0 || section.items.length > 0,
    );

  return {
    schemaVersion: 1,

    source: {
      file: sourceName,
    },

    metadata,

    sections,
  };
}
