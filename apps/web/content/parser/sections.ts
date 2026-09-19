import { cleanLatex } from "./cleaner";

import {
  extractBraced,
  parseCommandArguments,
  extractItemsFromList,
} from "./commands";

export interface RawSection {
  heading: string;
  body: string;
}

export type SectionKind =
  | "projects"
  | "skills"
  | "positions"
  | "timeline"
  | "content";

export function extractSections(text: string): RawSection[] {
  const sections: RawSection[] = [];

  /*
   * Supports both:
   *
   * \section{Education}
   *
   * \section*{Education}
   *
   * and headings containing nested LaTeX:
   *
   * \section{\textbf{Personal Projects}}
   */
  const pattern = /\\section\s*\*?\s*\{/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index ?? 0;

    try {
      const [heading, headingEnd] = extractBraced(
        text,
        start + match[0].length - 1,
      );

      const bodyStart = headingEnd;

      const nextSectionPattern = /\\section\s*\*?\s*\{/g;

      nextSectionPattern.lastIndex = bodyStart;

      const nextSection = nextSectionPattern.exec(text);

      let bodyEnd: number;

      if (nextSection) {
        bodyEnd = nextSection.index;
      } else {
        const documentEnd = text.indexOf("\\end{document}", bodyStart);

        bodyEnd = documentEnd === -1 ? text.length : documentEnd;
      }

      sections.push({
        heading: cleanLatex(heading),

        body: text.slice(bodyStart, bodyEnd).trim(),
      });
    } catch {
      /*
       * A malformed section should not prevent
       * later valid sections from being parsed.
       */
      continue;
    }
  }

  return sections;
}

export function classifySection(body: string): SectionKind {
  /*
   * Classification is structural.
   *
   * We deliberately do NOT check:
   *
   * "Education"
   * "Experience"
   * "Skills"
   * "Projects"
   *
   * because role-specific .tex files may use
   * different headings.
   */

  /*
   * Most specific structures first.
   */

  if (/\\resumeProject\b/.test(body)) {
    return "projects";
  }

  /*
   * Skills use:
   *
   * \textbf{Languages}{: Java, Python, ...}
   *
   * Any valid category/value pair is enough.
   */
  const skillPattern = /\\textbf\s*\{[^{}]+\}\s*\{\s*:/g;

  if (skillPattern.test(body)) {
    return "skills";
  }

  if (/\\resumePOR\b/.test(body)) {
    return "positions";
  }

  if (/\\resumeSubheading\b/.test(body)) {
    return "timeline";
  }

  return "content";
}

export function parseTimelineSection(body: string): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  /*
   * Current resume format:
   *
   * \resumeSubheading
   *   {Organization}
   *   {Secondary}
   *   {Role}
   *   {Dates}
   */
  const timelineArguments = parseCommandArguments(body, "resumeSubheading", 4);

  /*
   * Extract all item-list blocks in their original
   * document order.
   */
  const lists = extractResumeItemLists(body);

  for (let index = 0; index < timelineArguments.length; index++) {
    const [organization, secondary, role, dates] = timelineArguments[index];

    items.push({
      organization: cleanLatex(organization),

      secondary: cleanLatex(secondary),

      role: cleanLatex(role),

      dates: cleanLatex(dates),

      details:
        index < lists.length
          ? extractItemsFromList(lists[index], cleanLatex)
          : [],
    });
  }

  return items;
}

export function parseProjectSection(body: string): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  /*
   * Current project format is intentionally handled
   * explicitly:
   *
   * \resumeProject
   *   {\href{URL}{Project Name}}
   *   {Description}
   *
   * The current resume has TWO meaningful arguments.
   */
  const pattern = /\\resumeProject\b/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    let position = (match.index ?? 0) + match[0].length;

    try {
      position = skipWhitespace(body, position);

      if (body[position] !== "{") {
        continue;
      }

      const [nameRaw, afterName] = extractBraced(body, position);

      position = skipWhitespace(body, afterName);

      if (body[position] !== "{") {
        continue;
      }

      const [descriptionRaw, afterDescription] = extractBraced(body, position);

      position = afterDescription;

      let name = nameRaw;

      let repositoryUrl: string | undefined;

      /*
       * Extract:
       *
       * \href{https://...}{Project Name}
       */
      const hrefMatch = nameRaw.match(/\\href\s*\{([^{}]+)\}\s*\{([^{}]+)\}/);

      if (hrefMatch) {
        repositoryUrl = cleanLatex(hrefMatch[1]);

        name = hrefMatch[2];
      }

      /*
       * The project body extends until the next
       * \resumeProject command.
       */
      const remaining = body.slice(position);

      const nextProject = remaining.search(/\\resumeProject\b/);

      const projectBody =
        nextProject === -1 ? remaining : remaining.slice(0, nextProject);

      const listMatch = projectBody.match(
        /\\resumeItemListStart\b([\s\S]*?)\\resumeItemListEnd\b/,
      );

      const details = listMatch
        ? extractItemsFromList(listMatch[1], cleanLatex)
        : [];

      const links: Array<{
        label: string;
        url: string;
      }> = [];

      if (repositoryUrl) {
        links.push({
          label: "repository",
          url: repositoryUrl,
        });
      }

      items.push({
        name: cleanLatex(name),

        description: cleanLatex(descriptionRaw),

        metadata: {
          primary: "",
          secondary: "",
        },

        details,

        links,
      });
    } catch {
      /*
       * Ignore a malformed project and continue
       * searching for the next project.
       */
      continue;
    }
  }

  return items;
}

export function parseSkillSection(body: string): Record<string, string>[] {
  const skills: Record<string, string>[] = [];

  /*
   * Current format:
   *
   * \textbf{Languages}{: Java, Python, JavaScript, C} \\
   * \textbf{Frameworks}{: React.js, Vite.js, ...} \\
   *
   * We use the LaTeX structure rather than the
   * section heading.
   */
  const pattern = /\\textbf\s*\{([^{}]+)\}\s*\{\s*:\s*([^{}]*)\}/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    const category = cleanLatex(match[1]);

    const values = cleanLatex(match[2])
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    for (const value of values) {
      skills.push({
        name: value,
        description: category,
      });
    }
  }

  return skills;
}

export function parsePositionsSection(body: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];

  for (const args of parseCommandArguments(body, "resumePOR", 3)) {
    const [title, organization, dates] = args;

    items.push({
      title: cleanLatex(title),

      organization: cleanLatex(organization),

      dates: cleanLatex(dates),
    });
  }

  return items;
}

export function parseGenericSection(body: string): { text: string }[] {
  const result = extractItemsFromList(body, cleanLatex).map((text) => ({
    text,
  }));

  if (result.length === 0) {
    const cleaned = cleanLatex(body);

    if (cleaned) {
      result.push({
        text: cleaned,
      });
    }
  }

  return result;
}

function extractResumeItemLists(body: string): string[] {
  const lists: string[] = [];

  const pattern = /\\resumeItemListStart\b([\s\S]*?)\\resumeItemListEnd\b/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    lists.push(match[1]);
  }

  return lists;
}

function skipWhitespace(text: string, start: number): number {
  let position = start;

  while (position < text.length && /\s/.test(text[position])) {
    position++;
  }

  return position;
}
