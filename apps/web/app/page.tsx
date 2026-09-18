import { loadPortfolio } from "@/content/loader/portfolio";
import { loadTheme } from "@/lib/theme";

import PortfolioShell from "@/components/layout/PortfolioShell";
import Hero from "@/components/hero/Hero";
import PlaceholderScene from "@/components/scenes/PlaceholderScene";
import AboutScene from "@/components/about/AboutScene";
import ExperienceScene from "@/components/experience/ExperienceScene";
import SkillsScene from "@/components/skills/SkillsScene";

export default async function Home() {
  const portfolio = await loadPortfolio("main");
  const theme = await loadTheme();

  return (
    <PortfolioShell theme={theme}>
      <Hero portfolio={portfolio} theme={theme} />

      <AboutScene portfolio={portfolio} />

      <ExperienceScene portfolio={portfolio} />

      <SkillsScene portfolio={portfolio} />

      <PlaceholderScene
        id="projects"
        number="04"
        label="PROJECT VAULT"
        title="THINGS I'VE BUILT"
        description="Projects will become interactive technological artifacts inside the portfolio universe."
      />

      <PlaceholderScene
        id="contact"
        number="05"
        label="TRANSMISSION"
        title="LET'S BUILD."
        description="The final destination for opportunities, interesting problems and new missions."
      />
    </PortfolioShell>
  );
}
