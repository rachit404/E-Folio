import { extractBraced } from "./commands";
import { cleanLatex } from "./cleaner";

export interface PortfolioMetadata {
  name?: string;
  course?: string;
  phone?: string;
  email?: string;
  links: Record<string, string>;
}

function extractNewCommand(text: string, command: string): string | undefined {
  const pattern = new RegExp(
    String.raw`\\newcommand\s*\{\\${escapeRegExp(command)}\}`,
    "g",
  );

  const match = pattern.exec(text);

  if (!match) {
    return undefined;
  }

  let position = (match.index ?? 0) + match[0].length;

  while (position < text.length && /\s/.test(text[position])) {
    position++;
  }

  /*
   * Support optional arguments:
   *
   * \newcommand{\foo}[1]{...}
   */
  if (text[position] === "[") {
    let optionalEnd = position + 1;

    while (optionalEnd < text.length && text[optionalEnd] !== "]") {
      optionalEnd++;
    }

    if (optionalEnd >= text.length) {
      return undefined;
    }

    position = optionalEnd + 1;

    while (position < text.length && /\s/.test(text[position])) {
      position++;
    }
  }

  if (text[position] !== "{") {
    return undefined;
  }

  try {
    const [value] = extractBraced(text, position);

    const cleaned = cleanLatex(value);

    return cleaned || undefined;
  } catch {
    return undefined;
  }
}

function addLink(
  links: Record<string, string>,
  key: string,
  url: string,
): void {
  if (!url) {
    return;
  }

  if (!links[key]) {
    links[key] = url;
    return;
  }

  let suffix = 2;

  while (links[`${key}${suffix}`]) {
    suffix++;
  }

  links[`${key}${suffix}`] = url;
}

/**
 * Extract metadata links.
 *
 * Generic links are read from the header.
 *
 * GitHub and LinkedIn are additionally searched across
 * the COMPLETE document because resume templates can
 * place social links in different locations.
 */
function extractLinks(text: string): Record<string, string> {
  const links: Record<string, string> = {};

  /*
   * ----------------------------------------------------
   * 1. Generic header links
   * ----------------------------------------------------
   *
   * This keeps arbitrary links such as:
   *
   * portfolio
   * website
   * email
   * etc.
   *
   * from project-level URLs.
   */
  const firstSection = text.search(/\\section\s*\*?\s*\{/);

  const header = firstSection === -1 ? text : text.slice(0, firstSection);

  const headerHrefPattern = /\\href\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;

  let headerMatch: RegExpExecArray | null;

  while ((headerMatch = headerHrefPattern.exec(header)) !== null) {
    const url = cleanLatex(headerMatch[1]);

    const label = cleanLatex(headerMatch[2]);

    if (!url) {
      continue;
    }

    /*
     * Known social platforms receive stable keys.
     */
    if (/(?:^|\/)github\.com(?:\/|$)/i.test(url)) {
      addLink(links, "github", url);
      continue;
    }

    if (/(?:^|\/)linkedin\.com(?:\/|$)/i.test(url)) {
      addLink(links, "linkedin", url);
      continue;
    }

    const normalizedLabel = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim();

    const key = normalizedLabel || "link";

    addLink(links, key, url);
  }

  /*
   * ----------------------------------------------------
   * 2. Explicit GitHub discovery
   * ----------------------------------------------------
   *
   * Search the complete .tex file.
   *
   * This catches GitHub links even if the template
   * places them outside the header.
   */
  const githubPattern =
    /\\href\s*\{\s*(https?:\/\/(?:www\.)?github\.com\/[^{}\s]+)\s*\}/gi;

  let githubMatch: RegExpExecArray | null;

  while ((githubMatch = githubPattern.exec(text)) !== null) {
    addLink(links, "github", cleanLatex(githubMatch[1]));

    /*
     * We only need the first primary GitHub URL.
     * Additional URLs can still be represented as
     * github2, github3, etc.
     */
  }

  /*
   * ----------------------------------------------------
   * 3. Explicit LinkedIn discovery
   * ----------------------------------------------------
   *
   * This is the important fix.
   *
   * We do NOT depend on:
   *
   * - the link label
   * - \faLinkedin
   * - the link location
   *
   * We identify LinkedIn by its URL.
   */
  const linkedinPattern =
    /\\href\s*\{\s*(https?:\/\/(?:www\.)?linkedin\.com\/[^{}\s]+)\s*\}/gi;

  let linkedinMatch: RegExpExecArray | null;

  while ((linkedinMatch = linkedinPattern.exec(text)) !== null) {
    addLink(links, "linkedin", cleanLatex(linkedinMatch[1]));
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
