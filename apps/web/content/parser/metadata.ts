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

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}

const GITHUB_HOST = /^https?:\/\/(?:www\.)?github\.com(?:\/|$)/i;

const LINKEDIN_HOST = /^https?:\/\/(?:[a-z0-9-]+\.)?linkedin\.com(?:\/|$)/i;

/**
 * A profile URL has exactly one path segment
 * (github.com/user), while repository URLs have more
 * (github.com/user/repo) and must not become the
 * primary social link.
 */
function isGithubProfile(url: string): boolean {
  return /^https?:\/\/(?:www\.)?github\.com\/[^/?#\s]+\/?$/i.test(url);
}

/**
 * Derive a stable key from a hostname:
 * https://www.example.com/x -> "example"
 */
function keyFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    return host.split(".")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");
  } catch {
    return "";
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

  /*
   * The same destination must never be stored twice,
   * regardless of which discovery pass found it.
   */
  const normalizedUrl = normalizeUrl(url);

  const alreadyStored = Object.values(links).some(
    (value) => normalizeUrl(value) === normalizedUrl,
  );

  if (alreadyStored) {
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

    /*
     * Only web links belong in metadata.links. The email
     * address is exposed through metadata.email, and a
     * mailto: whose macro was stripped ("mailto:") is empty.
     */
    if (!/^https?:\/\//i.test(url)) {
      continue;
    }

    /*
     * Known social platforms receive stable keys.
     */
    if (GITHUB_HOST.test(url)) {
      addLink(links, "github", url);
      continue;
    }

    if (LINKEDIN_HOST.test(url)) {
      addLink(links, "linkedin", url);
      continue;
    }

    /*
     * Prefer a readable label ("Portfolio"); fall back to
     * the hostname when the label is itself a URL or empty.
     */
    const labelLooksLikeUrl = /[./]/.test(label);

    const normalizedLabel = labelLooksLikeUrl
      ? ""
      : label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "")
          .trim();

    const key = normalizedLabel || keyFromUrl(url) || "link";

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

  while (!links.github && (githubMatch = githubPattern.exec(text)) !== null) {
    const url = cleanLatex(githubMatch[1]);

    /*
     * Only a profile URL (github.com/user) is the primary
     * GitHub link. Repository URLs belong to projects and
     * must not leak into the profile metadata.
     */
    if (isGithubProfile(url)) {
      addLink(links, "github", url);
    }
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

  while (
    !links.linkedin &&
    (linkedinMatch = linkedinPattern.exec(text)) !== null
  ) {
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
