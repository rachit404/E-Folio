import { notFound } from "next/navigation";

import { listProfiles, loadPortfolio } from "@/content/loader/portfolio";
import { loadTheme } from "@/lib/theme";

import PortfolioShell from "@/components/layout/PortfolioShell";
import PortfolioWorld from "@/components/layout/PortfolioWorld";

import Hero from "@/components/hero/Hero";
import AboutScene from "@/components/about/AboutScene";
import ExperienceScene from "@/components/experience/ExperienceScene";
import SkillsScene from "@/components/skills/SkillsScene";
import ProjectsScene from "@/components/projects/ProjectsScene";
import ContactScene from "@/components/contact/ContactScene";

interface RolePageProps {
  params: Promise<{
    role: string;
  }>;
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;

  const profiles = await listProfiles();

  const activeRole = role.trim().toLowerCase();

  if (!profiles.includes(activeRole)) {
    notFound();
  }

  const [portfolio, theme] = await Promise.all([
    loadPortfolio(activeRole),
    loadTheme(),
  ]);

  return (
    <PortfolioShell theme={theme} profiles={profiles} activeRole={activeRole}>
      <PortfolioWorld theme={theme}>
        <Hero portfolio={portfolio} theme={theme} />

        <AboutScene portfolio={portfolio} />

        <ExperienceScene portfolio={portfolio} />

        <SkillsScene portfolio={portfolio} />

        <ProjectsScene portfolio={portfolio} />

        <ContactScene portfolio={portfolio} />
      </PortfolioWorld>
    </PortfolioShell>
  );
}
