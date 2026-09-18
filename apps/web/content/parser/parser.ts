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
 * Parse a complete LaTeX resume into the portfolio
 * data structure consumed by the website.
 *
 * The parser intentionally works from LaTeX structure,
 * not from section names.
 */
export function parseDocument(
  source: string,
  sourceName: string,
): ParsedPortfolio {
  /*
   * Remove comments BEFORE doing any structural parsing.
   *
   * This is important because commented-out commands
   * such as:
   *
   * % \resumeProject
   *
   * must never reach the individual parsers.
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
    /*
     * Don't expose completely empty sections to the UI.
     *
     * This is useful for LaTeX sections which may exist
     * temporarily while being edited.
     */
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
