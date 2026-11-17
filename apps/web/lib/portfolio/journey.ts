import type { PortfolioData } from "@/content/schema/portfolio";

import { educationEntries, experienceEntries } from "./derive";

export interface JourneyStep {
  key: string;
  /** "01", "02", ... */
  number: string;
  title: string;
  /** Date range for the step, or "". */
  dates: string;
  /** Subtitle: role, or "Education". */
  subtitle: string;
  /** Short lines: bullets for a job, degrees for education. */
  lines: string[];
  /** True for the newest step. */
  current: boolean;
}

/**
 * Resume -> ordered journey, oldest first so the road leads toward the
 * present: education (grouped into one step) and then each job. Only
 * facts from the resume are used.
 */
export function buildJourney(portfolio: PortfolioData): JourneyStep[] {
  const steps: Omit<JourneyStep, "number" | "current">[] = [];

  const education = educationEntries(portfolio);

  if (education.length > 0) {
    steps.push({
      key: "education",
      title: "Education",
      dates: education[0].dates,
      subtitle: education[0].organization,
      lines: education.map((entry) => `${entry.role}, ${entry.organization}`),
    });
  }

  // Resumes list newest first; the journey runs oldest to newest.
  const jobs = [...experienceEntries(portfolio)].reverse();

  jobs.forEach((job, index) => {
    steps.push({
      key: `job-${index}`,
      title: job.organization,
      dates: job.dates,
      subtitle: job.role,
      lines: job.details,
    });
  });

  return steps.map((step, index) => ({
    ...step,
    number: String(index + 1).padStart(2, "0"),
    current: index === steps.length - 1,
  }));
}

/**
 * Indices of `size` consecutive items that include `focus`, kept
 * inside [0, total). Used to show a few cards at a time on the road.
 */
export function windowAround(
  total: number,
  focus: number,
  size: number,
): number[] {
  const count = Math.min(size, total);

  if (count <= 0) {
    return [];
  }

  const start = Math.min(
    Math.max(0, focus - Math.floor(count / 2)),
    total - count,
  );

  return Array.from({ length: count }, (_, offset) => start + offset);
}
