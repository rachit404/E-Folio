import { notFound } from "next/navigation";

import {
  applyExtras,
  hasResumePdf,
  loadSiteExtras,
} from "@/content/loader/extras";
import { listProfiles, loadPortfolio } from "@/content/loader/portfolio";
import { loadTheme } from "@/lib/theme";

import PortfolioShell from "@/components/layout/PortfolioShell";
import AboutScene from "@/components/scenes/AboutScene";
import ContactScene from "@/components/scenes/ContactScene";
import ExperienceScene from "@/components/scenes/ExperienceScene";
import HomeScene from "@/components/scenes/HomeScene";
import ProjectsScene from "@/components/scenes/ProjectsScene";
import SkillsScene from "@/components/scenes/SkillsScene";

interface RolePageProps {
  params: Promise<{
    role: string;
  }>;
}

/**
 * Prerender one page per resume at build time, so the personal
 * .tex files are only needed during `next build`, not at runtime.
 */
export async function generateStaticParams() {
  const profiles = await listProfiles();

  return profiles.map((role) => ({ role }));
}

export const dynamicParams = false;

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;

  const profiles = await listProfiles();

  const activeRole = role.trim().toLowerCase();

  if (!profiles.includes(activeRole)) {
    notFound();
  }

  const [portfolio, baseTheme, extras, hasResume] = await Promise.all([
    loadPortfolio(activeRole),
    loadTheme(activeRole),
    loadSiteExtras(activeRole),
    hasResumePdf(activeRole),
  ]);

  // Optional gitignored site files can override individual copy fields.
  const theme = { ...baseTheme, copy: applyExtras(baseTheme.copy, extras) };

  return (
    <PortfolioShell theme={theme} profiles={profiles} activeRole={activeRole}>
      <HomeScene
        portfolio={portfolio}
        copy={theme.copy}
        role={activeRole}
        hasResume={hasResume}
      />

      <AboutScene portfolio={portfolio} copy={theme.copy} />

      <ExperienceScene portfolio={portfolio} />

      <ProjectsScene portfolio={portfolio} />

      <SkillsScene portfolio={portfolio} />

      <ContactScene
        portfolio={portfolio}
        copy={theme.copy}
        role={activeRole}
        hasResume={hasResume}
      />
    </PortfolioShell>
  );
}
