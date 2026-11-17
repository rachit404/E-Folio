import type { PortfolioData } from "@/content/schema/portfolio";

type Section = PortfolioData["sections"][number];

type Item = Section["items"][number];

export interface TimelineEntry {
  organization: string;
  secondary: string;
  role: string;
  dates: string;
  details: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  metadata: { primary: string; secondary: string };
  details: string[];
  links: { label: string; url: string }[];
}

export function isTimelineEntry(item: Item): item is TimelineEntry {
  return (
    "organization" in item &&
    "role" in item &&
    "dates" in item &&
    "details" in item
  );
}

export function isProjectEntry(item: Item): item is ProjectEntry {
  return (
    "name" in item &&
    "description" in item &&
    "metadata" in item &&
    "details" in item &&
    "links" in item
  );
}

const EDUCATION = /educat|academic|school|college/i;

/** Timeline sections that are education (by heading). */
export function educationEntries(portfolio: PortfolioData): TimelineEntry[] {
  return portfolio.sections
    .filter((section) => section.kind === "timeline")
    .filter((section) => EDUCATION.test(section.heading))
    .flatMap((section) => section.items.filter(isTimelineEntry));
}

/** Timeline entries that are not education, newest first as written. */
export function experienceEntries(portfolio: PortfolioData): TimelineEntry[] {
  return portfolio.sections
    .filter((section) => section.kind === "timeline")
    .filter((section) => !EDUCATION.test(section.heading))
    .flatMap((section) => section.items.filter(isTimelineEntry));
}

export function projectEntries(portfolio: PortfolioData): ProjectEntry[] {
  return portfolio.sections
    .filter((section) => section.kind === "projects")
    .flatMap((section) => section.items.filter(isProjectEntry));
}

/** "Currently pursuing X at Y." from the first education entry. */
export function educationSentence(portfolio: PortfolioData): string | null {
  const [latest] = educationEntries(portfolio);

  if (!latest) {
    return null;
  }

  const ongoing = /present|current|ongoing/i.test(latest.dates);

  const verb = ongoing ? "Currently pursuing" : "Studied";

  return `${verb} ${latest.role} at ${latest.organization}.`;
}

export interface Counts {
  roles: number;
  projects: number;
  skills: number;
  records: number;
}

/** Numbers shown on the About scene, all taken from the parsed resume. */
export function countFacts(portfolio: PortfolioData): Counts {
  const total = (predicate: (section: Section) => boolean) =>
    portfolio.sections
      .filter(predicate)
      .reduce((sum, section) => sum + section.items.length, 0);

  return {
    roles: experienceEntries(portfolio).length,
    projects: total((section) => section.kind === "projects"),
    skills: total((section) => section.kind === "skills"),
    records: total((section) => section.kind === "content"),
  };
}

/** "React.js" -> ["react.js", "react"], "Node.js" -> ["node.js", "node"]. */
function skillVariants(skill: string): string[] {
  const lower = skill.trim().toLowerCase();

  const variants = [lower];

  if (lower.endsWith(".js")) {
    variants.push(lower.slice(0, -3));
  }

  return variants.filter((variant) => variant.length >= 2);
}

/**
 * Names of projects whose own text (name, description, bullets)
 * mentions the skill. Whole-word, case-insensitive. One-letter skills
 * such as "C" are never matched because they would hit everything.
 */
export function projectsUsing(
  skill: string,
  projects: readonly ProjectEntry[],
): string[] {
  const variants = skillVariants(skill);

  if (variants.length === 0) {
    return [];
  }

  const escape = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `(^|[^a-z0-9])(${variants.map(escape).join("|")})($|[^a-z0-9])`,
    "i",
  );

  return projects
    .filter((project) =>
      pattern.test([project.name, project.description, ...project.details].join(" ")),
    )
    .map((project) => project.name);
}
