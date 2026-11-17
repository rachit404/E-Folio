import type { PortfolioData } from "@/content/schema/portfolio";
import SceneSection from "@/components/shell/SceneSection";
import BrushTitle from "@/components/ui/BrushTitle";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import { ChipIcon, CodeIcon, FlaskIcon, ShieldIcon } from "@/components/ui/icons";
import { countFacts, educationSentence } from "@/lib/portfolio/derive";
import { sceneNumber } from "@/lib/scenes/order";
import type { PortfolioTheme } from "@/lib/theme";

interface AboutSceneProps {
  portfolio: PortfolioData;
  copy: PortfolioTheme["copy"];
}

const PILLAR_ICONS = [CodeIcon, ChipIcon, ShieldIcon, FlaskIcon];

export default function AboutScene({ portfolio, copy }: AboutSceneProps) {
  const [first] = (portfolio.metadata.name ?? "You").trim().split(/\s+/);

  const education = educationSentence(portfolio);

  const counts = countFacts(portfolio);

  const facts = [
    { label: "roles", value: counts.roles },
    { label: "projects", value: counts.projects },
    { label: "skills", value: counts.skills },
  ].filter((fact) => fact.value > 0);

  return (
    <SceneSection id="about">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="max-w-[30rem] space-y-4">
          <SectionChip number={sceneNumber("about")} label="About" />

          <BrushTitle first="Who is" second={`${first}?`} />

          <div className="space-y-2 text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:720px)]:text-[13px] [@media(max-height:720px)]:leading-5">
            {education && <p>{education}</p>}

            {copy.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
            <a href="#experience" className="cta">
              View my journey
              <span aria-hidden="true">→</span>
            </a>

            <p className="micro text-[var(--color-muted)]">
              {facts
                .map((fact) => `${String(fact.value).padStart(2, "0")} ${fact.label}`)
                .join("  /  ")}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {copy.pillars.slice(0, 4).map((pillar, index) => {
            const PillarIcon = PILLAR_ICONS[index % PILLAR_ICONS.length];

            return (
              <li key={pillar.title}>
                <HoloCard
                  tone={index % 2 === 0 ? "accent" : "primary"}
                  bodyClassName="p-3 md:p-4"
                >
                  <PillarIcon className="mb-2 h-5 w-5 text-[var(--holo)]" />

                  <h3 className="micro text-[var(--color-white)]">
                    {pillar.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)] [@media(max-height:760px)]:hidden">
                    {pillar.text}
                  </p>

                  <p className="mt-2 hidden flex-wrap gap-1.5 lg:flex [@media(max-height:820px)]:hidden">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="micro border border-white/15 px-1.5 py-0.5 text-[7px] text-[var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                </HoloCard>
              </li>
            );
          })}
        </ul>
      </div>
    </SceneSection>
  );
}
