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

export function extractSections(text: string): RawSection[] {
  const sections: RawSection[] = [];

  /*
   * Supports:
   *
   * \section{Education}
   * \section{\textbf{Technical Skills}}
   *
   * We intentionally do not depend on section names.
   */
  const pattern = /\\section\s*\{/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index ?? 0;

    try {
      const [heading, headingEnd] = extractBraced(
        text,
        start + match[0].length - 1,
      );

      const bodyStart = headingEnd;

      const nextSectionMatch = /\\section\s*\{/g;

      nextSectionMatch.lastIndex = bodyStart;

      const nextMatch = nextSectionMatch.exec(text);

      let bodyEnd: number;

      if (nextMatch) {
        bodyEnd = nextMatch.index;
      } else {
        const documentEnd = text.indexOf("\\end{document}", bodyStart);

        bodyEnd = documentEnd === -1 ? text.length : documentEnd;
      }

      sections.push({
        heading: cleanLatex(heading),
        body: text.slice(bodyStart, bodyEnd).trim(),
      });
    } catch {
      continue;
    }
  }

  return sections;
}

export function classifySection(
  body: string,
): "projects" | "skills" | "positions" | "timeline" | "content" {
  /*
   * Detect the structural LaTeX pattern rather than
   * relying on English section headings.
   */

  // Projects
  if (body.includes("\\resumeProject")) {
    return "projects";
  }

  /*
   * Skills in the current resume use:
   *
   * \textbf{Languages}{: Java, Python, JavaScript, C}
   *
   * Detect multiple category/value pairs.
   */
  const skillCategoryPattern = /\\textbf\s*\{[^{}]+\}\s*\{\s*:/g;

  const skillCategoryMatches = body.match(skillCategoryPattern) ?? [];

  if (skillCategoryMatches.length >= 2) {
    return "skills";
  }

  // Positions / leadership
  if (body.includes("\\resumePOR")) {
    return "positions";
  }

  // Education / professional experience
  if (body.includes("\\resumeSubheading")) {
    return "timeline";
  }

  return "content";
}

export function parseTimelineSection(body: string): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  for (const args of parseCommandArguments(body, "resumeSubheading", 4)) {
    const [organization, secondary, role, dates] = args;

    items.push({
      organization: cleanLatex(organization),
      secondary: cleanLatex(secondary),
      role: cleanLatex(role),
      dates: cleanLatex(dates),
      details: [],
    });
  }

  /*
   * Associate each resumeItemList with the
   * corresponding timeline item.
   */
  const lists: string[] = [];

  const listPattern = /\\resumeItemListStart([\s\S]*?)\\resumeItemListEnd/g;

  let listMatch: RegExpExecArray | null;

  while ((listMatch = listPattern.exec(body)) !== null) {
    lists.push(listMatch[1]);
  }

  for (let index = 0; index < lists.length; index++) {
    if (index < items.length) {
      items[index].details = extractItemsFromList(lists[index], cleanLatex);
    }
  }

  return items;
}

export function parseProjectSection(body: string): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  /*
   * Current resume structure:
   *
   * \resumeProject
   *   {\href{URL}{Project Name}}
   *   {Description}
   *
   * Projects currently have 2 meaningful arguments.
   *
   * We therefore parse the command manually rather than
   * assuming the older 4-argument template.
   */

  const projectPattern = /\\resumeProject\b/g;

  let projectMatch: RegExpExecArray | null;

  while ((projectMatch = projectPattern.exec(body)) !== null) {
    let position = (projectMatch.index ?? 0) + projectMatch[0].length;

    try {
      while (position < body.length && /\s/.test(body[position])) {
        position++;
      }

      if (body[position] !== "{") {
        continue;
      }

      const [nameRaw, afterName] = extractBraced(body, position);

      position = afterName;

      while (position < body.length && /\s/.test(body[position])) {
        position++;
      }

      if (body[position] !== "{") {
        continue;
      }

      const [descriptionRaw, afterDescription] = extractBraced(body, position);

      position = afterDescription;

      /*
       * Extract URL from:
       *
       * \href{https://...}{Project Name}
       */
      const hrefMatch = nameRaw.match(/\\href\s*\{([^{}]+)\}\s*\{([^{}]+)\}/);

      let name = nameRaw;
      let repositoryUrl: string | undefined;

      if (hrefMatch) {
        repositoryUrl = hrefMatch[1];
        name = hrefMatch[2];
      }

      const project: Record<string, unknown> = {
        name: cleanLatex(name),
        description: cleanLatex(descriptionRaw),

        metadata: {
          primary: "",
          secondary: "",
        },

        details: [],
        links: [],
      };

      if (repositoryUrl) {
        project.links = [
          {
            label: "repository",
            url: repositoryUrl,
          },
        ];
      }

      /*
       * Find the first item list after this project
       * and before the next project.
       */
      const remainingBody = body.slice(position);

      const nextProjectIndex = remainingBody.search(/\\resumeProject\b/);

      const projectBody =
        nextProjectIndex === -1
          ? remainingBody
          : remainingBody.slice(0, nextProjectIndex);

      const listMatch = projectBody.match(
        /\\resumeItemListStart([\s\S]*?)\\resumeItemListEnd/,
      );

      if (listMatch) {
        project.details = extractItemsFromList(listMatch[1], cleanLatex);
      }

      items.push(project);
    } catch {
      continue;
    }
  }

  return items;
}

export function parseSkillSection(body: string): Record<string, string>[] {
  const skills: Record<string, string>[] = [];

  /*
   * Current resume structure:
   *
   * \textbf{Languages}{: Java, Python, JavaScript, C} \\
   * \textbf{Frameworks}{: React.js, Vite.js, Node.js} \\
   *
   * We extract the category and then split the
   * values into individual skill records.
   *
   * The section heading is intentionally irrelevant.
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
