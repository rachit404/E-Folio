import type { PortfolioData } from "@/content/schema/portfolio";

type Item = PortfolioData["sections"][number]["items"][number];

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Certificate {
  issuer: string;
  title: string;
}

function isSkillItem(item: Item): item is { name: string; description: string } {
  return (
    "name" in item &&
    "description" in item &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    !("metadata" in item)
  );
}

function hasText(item: Item): item is { text: string } {
  return "text" in item && typeof item.text === "string";
}

/**
 * Skills are parsed one record per skill, with the row label
 * ("Languages", "Frameworks", ...) in `description`. Group them back
 * by that label, keeping resume order. Items without a label fall
 * back to the section heading.
 */
export function groupSkills(portfolio: PortfolioData): SkillGroup[] {
  const groups = new Map<string, string[]>();

  for (const section of portfolio.sections) {
    if (section.kind !== "skills") {
      continue;
    }

    for (const item of section.items) {
      if (!isSkillItem(item)) {
        continue;
      }

      const category = item.description.trim() || section.heading;

      const existing = groups.get(category);

      if (existing) {
        existing.push(item.name);
      } else {
        groups.set(category, [item.name]);
      }
    }
  }

  return [...groups].map(([category, skills]) => ({ category, skills }));
}

/** "Google Cloud : Cloud Foundations" -> issuer + title. */
export function splitCertificate(text: string): Certificate {
  const separator = text.indexOf(":");

  if (separator === -1) {
    return { issuer: "", title: text.trim() };
  }

  return {
    issuer: text.slice(0, separator).trim(),
    title: text.slice(separator + 1).trim(),
  };
}

/** Certificates / courses: generic "content" sections with text items. */
export function collectCertificates(portfolio: PortfolioData): {
  heading: string;
  certificates: Certificate[];
}[] {
  return portfolio.sections
    .filter((section) => section.kind === "content")
    .map((section) => ({
      heading: section.heading,
      certificates: section.items
        .filter(hasText)
        .map((item) => splitCertificate(item.text)),
    }))
    .filter((section) => section.certificates.length > 0);
}
