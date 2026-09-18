import { loadPortfolio } from "@/content/loader/portfolio";
import { loadTheme } from "@/lib/theme";

import PortfolioShell from "@/components/layout/PortfolioShell";
import Hero from "@/components/hero/Hero";
import PlaceholderScene from "@/components/scenes/PlaceholderScene";
import AboutScene from "@/components/about/AboutScene";

export default async function Home() {
  const portfolio = await loadPortfolio("main");
  const theme = await loadTheme();

  return (
    <PortfolioShell theme={theme}>
      <Hero portfolio={portfolio} theme={theme} />
      <AboutScene portfolio={portfolio} />

      <PlaceholderScene
        id="about"
        number="01"
        label="IDENTITY"
        title="WHO IS RACHIT?"
        description="The engineer behind the systems, experiments, ideas and things being built."
      />

      <PlaceholderScene
        id="experience"
        number="02"
        label="JOURNEY"
        title="THE JOURNEY"
        description="Experience, internships, education and milestones will become an interactive timeline."
      />

      <PlaceholderScene
        id="skills"
        number="03"
        label="ENGINEERING ARSENAL"
        title="SKILL MATRIX"
        description="A dynamic representation of the technologies, disciplines and tools used to build."
      />

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
