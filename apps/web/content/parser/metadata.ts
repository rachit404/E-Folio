import { extractBraced } from "./commands";

import { cleanLatex } from "./cleaner";

export interface PortfolioMetadata {
  name?: string;
  course?: string;
  phone?: string;
  email?: string;
  links: Record<string, string>;
}

/**
 * Extract the value of a LaTeX \newcommand.
 *
 * Supported format:
 *
 * \newcommand{\name}{Rachit Doshi}
 * \newcommand{\course}{Artificial Intelligence and Data Science}
 * \newcommand{\phone}{...}
 * \newcommand{\emaila}{...}
 *
 * We parse balanced braces instead of using a simple
 * [^}]* regex so nested LaTeX remains supported.
 */
function extractNewCommand(text: string, command: string): string | undefined {
  const pattern = new RegExp(String.raw`\\newcommand\s*\{\\${command}\}`, "g");

  const match = pattern.exec(text);

  if (!match) {
    return undefined;
  }

  let position = match.index + match[0].length;

  while (position < text.length && /\s/.test(text[position])) {
    position++;
  }

  if (text[position] !== "{") {
    return undefined;
  }

  try {
    const [value] = extractBraced(text, position);

    return cleanLatex(value);
  } catch {
    return undefined;
  }
}

/**
 * Extract all \href{URL}{label} occurrences.
 *
 * This is intentionally generic. We do not hard-code
 * GitHub/LinkedIn into the parser's structural logic.
 */
function extractLinks(text: string): Record<string, string> {
  const links: Record<string, string> = {};

  const pattern = /\\href\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const url = cleanLatex(match[1]);

    const label = cleanLatex(match[2]);

    if (!url) {
      continue;
    }

    /*
     * Determine a stable semantic key when possible.
     */
    const normalizedLabel = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim();

    let key = normalizedLabel;

    if (url.includes("github.com")) {
      key = "github";
    } else if (url.includes("linkedin.com")) {
      key = "linkedin";
    }

    /*
     * Avoid overwriting an existing link if the
     * document contains multiple links with the
     * same label.
     */
    if (links[key]) {
      let suffix = 2;

      while (links[`${key}${suffix}`]) {
        suffix++;
      }

      key = `${key}${suffix}`;
    }

    links[key] = url;
  }

  return links;
}

export function parseMetadata(text: string): PortfolioMetadata {
  const metadata: PortfolioMetadata = {
    links: {},
  };

  const name = extractNewCommand(text, "name");

  const course = extractNewCommand(text, "course");

  const phone = extractNewCommand(text, "phone");

  const email = extractNewCommand(text, "emaila");

  if (name) {
    metadata.name = name;
  }

  if (course) {
    metadata.course = course;
  }

  if (phone) {
    metadata.phone = phone;
  }

  if (email) {
    metadata.email = email;
  }

  metadata.links = extractLinks(text);

  return metadata;
}
